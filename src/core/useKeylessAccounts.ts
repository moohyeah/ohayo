// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  AccountAddress,
  EphemeralKeyPair,
  KeylessAccount,
  ProofFetchStatus,
  GetAccountOwnedTokensFromCollectionResponse,
} from "@aptos-labs/ts-sdk";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LocalStorageKeys, devnetClient } from "./constants";
import { validateIdToken } from "./idToken";
import {
  EphemeralKeyPairEncoding,
  isValidEphemeralKeyPair,
  validateEphemeralKeyPair,
} from "./ephemeral";
import { EncryptedScopedIdToken } from "./types";
import { KeylessAccountEncoding, validateKeylessAccount } from "./keyless";
import { NftCollectionAddr } from "./constants";

interface KeylessAccountsState {
  accounts: {
    idToken: { decoded: EncryptedScopedIdToken; raw: string };
    pepper: Uint8Array;
  }[];
  activeAccount?: KeylessAccount;
  ephemeralKeyPair?: EphemeralKeyPair;
}

interface KeylessAccountsActions {
  /**
   * Add an Ephemeral key pair to the store. If the account is invalid, an error is thrown.
   *
   * @param account - The Ephemeral key pair to add to the store.
   */
  commitEphemeralKeyPair: (account: EphemeralKeyPair) => void;
  /**
   * Disconnects the active account from the store.
   */
  disconnectKeylessAccount: () => void;
  /**
   * Retrieve the Ephemeral key pair from the store.
   *
   * @returns The Ephemeral key pair if found, otherwise undefined.
   */
  getEphemeralKeyPair: () => EphemeralKeyPair | undefined;
  /**
   * Switches the active account to the one associated with the provided idToken. If no account is found,
   * undefined is returned. The following conditions must be met for the switch to be successful:
   *
   * 1. The idToken must be valid and contain a nonce.
   * 2. An Ephemeral key pair with the same nonce must exist in the store.
   * 3. The idToken and Ephemeral key pair must both be valid.
   *
   * @param idToken - The idToken of the account to switch to.
   * @returns The active account if the switch was successful, otherwise undefined.
   */
  switchKeylessAccount: (
    idToken: string
  ) => Promise<KeylessAccount | undefined>;
  
  /**
   * 转移 NFT 到指定接收者
   * @param tokenId - NFT 的 token ID
   * @param recipient - 接收者的地址
   */
  transferNft: (tokenId: string, recipient: string) => Promise<string>;
  /**
   * 获取玩家nft
   */
  getNfts: () => Promise<GetAccountOwnedTokensFromCollectionResponse>;
  
}

const storage = createJSONStorage<KeylessAccountsState>(() => localStorage, {
  replacer: (_, e) => {
    if (typeof e === "bigint") return { __type: "bigint", value: e.toString() };
    if (e instanceof Uint8Array)
      return { __type: "Uint8Array", value: Array.from(e) };
    if (e instanceof EphemeralKeyPair)
      return EphemeralKeyPairEncoding.encode(e);
    if (e instanceof KeylessAccount) return KeylessAccountEncoding.encode(e);
    return e;
  },
  reviver: (_, e: any) => {
    if (e && e.__type === "bigint") return BigInt(e.value);
    if (e && e.__type === "Uint8Array") return new Uint8Array(e.value);
    if (e && e.__type === "EphemeralKeyPair")
      return EphemeralKeyPairEncoding.decode(e);
    if (e && e.__type === "KeylessAccount")
      return KeylessAccountEncoding.decode(e);
    return e;
  },
});

export const useKeylessAccounts = create<
  KeylessAccountsState & KeylessAccountsActions
>()(
  persist(
    (set, get, store) => ({
      ...({ accounts: [] } satisfies KeylessAccountsState),
      ...({
        commitEphemeralKeyPair: (keyPair) => {
          const valid = isValidEphemeralKeyPair(keyPair);
          if (!valid)
            throw new Error(
              "addEphemeralKeyPair: Invalid ephemeral key pair provided"
            );
          set({ ephemeralKeyPair: keyPair });
        },

        disconnectKeylessAccount: () => set({ activeAccount: undefined }),

        getEphemeralKeyPair: () => {
          const account = get().ephemeralKeyPair;
          return account ? validateEphemeralKeyPair(account) : undefined;
        },

        switchKeylessAccount: async (idToken: string) => {
          set({ ...get(), activeAccount: undefined }, true);

          // If the idToken is invalid, return undefined
          const decodedToken = validateIdToken(idToken);
          if (!decodedToken) {
            throw new Error(
              "switchKeylessAccount: Invalid idToken provided, could not decode"
            );
          }

          // If a corresponding Ephemeral key pair is not found, return undefined
          const ephemeralKeyPair = get().getEphemeralKeyPair();
          if (
            !ephemeralKeyPair ||
            ephemeralKeyPair?.nonce !== decodedToken.nonce
          ) {
            throw new Error(
              "switchKeylessAccount: Ephemeral key pair not found"
            );
          }

          // Create a handler to allow the proof to be computed asynchronously.
          const proofFetchCallback = async (res: ProofFetchStatus) => {
            if (res.status === "Failed") {
              get().disconnectKeylessAccount();
            } else {
              store.persist.rehydrate();
            }
          };

          // Derive and store the active account
          const storedAccount = get().accounts.find(
            (a) => a.idToken.decoded.sub === decodedToken.sub
          );
          let activeAccount: KeylessAccount | undefined;
          try {
            activeAccount = await devnetClient.deriveKeylessAccount({
              ephemeralKeyPair,
              jwt: idToken,
              proofFetchCallback,
            });
          } catch (error) {
            // If we cannot derive an account using the pepper service, attempt to derive it using the stored pepper
            if (!storedAccount?.pepper) throw error;
            activeAccount = await devnetClient.deriveKeylessAccount({
              ephemeralKeyPair,
              jwt: idToken,
              pepper: storedAccount.pepper,
              proofFetchCallback,
            });
          }

          // Store the account and set it as the active account
          const { pepper } = activeAccount;
          set({
            accounts: storedAccount
              ? // If the account already exists, update it. Otherwise, append it.
                get().accounts.map((a) =>
                  a.idToken.decoded.sub === decodedToken.sub
                    ? {
                        idToken: { decoded: decodedToken, raw: idToken },
                        pepper,
                      }
                    : a
                )
              : [
                  ...get().accounts,
                  { idToken: { decoded: decodedToken, raw: idToken }, pepper },
                ],
            activeAccount,
          });

          return activeAccount;
        },
        transferNft: async (tokenId: string, recipient: string) => {
          const activeAccount = get().activeAccount;
          if (!activeAccount) {
            throw new Error("transferNft: 未找到活跃账户");
          }
          const transferTransaction = await devnetClient.transferDigitalAssetTransaction({
            sender: activeAccount,
            digitalAssetAddress: tokenId,
            recipient: AccountAddress.fromString(recipient),
          });
          const committedTxn = await devnetClient.signAndSubmitTransaction({ signer: activeAccount, transaction: transferTransaction });
          await devnetClient.waitForTransaction({ transactionHash: committedTxn.hash });
          return committedTxn.hash;
        },
        getNfts : async() => {
          const activeAccount = get().activeAccount;
          if (!activeAccount) {
            throw new Error("transferNft: 未找到活跃账户");
          }
          const assets = devnetClient.getAccountOwnedTokensFromCollectionAddress({accountAddress:activeAccount.accountAddress, collectionAddress: AccountAddress.fromString(NftCollectionAddr)})
          return assets;
        },
      } satisfies KeylessAccountsActions),
    }),
    {
      merge: (persistedState, currentState) => {
        const merged = { ...currentState, ...(persistedState as object) };
        return {
          ...merged,
          activeAccount:
            merged.activeAccount &&
            validateKeylessAccount(merged.activeAccount),
          ephemeralKeyPair:
            merged.ephemeralKeyPair &&
            validateEphemeralKeyPair(merged.ephemeralKeyPair),
        };
      },
      name: LocalStorageKeys.keylessAccounts,
      partialize: ({ activeAccount, ephemeralKeyPair, ...state }) => ({
        ...state,
        activeAccount: activeAccount && validateKeylessAccount(activeAccount),
        ephemeralKeyPair:
          ephemeralKeyPair && validateEphemeralKeyPair(ephemeralKeyPair),
      }),
      storage,
      version: 1,
    }
  )
);
