// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const LocalStorageKeys = {
  keylessAccounts: "@aptos-connect/keyless-accounts",
};

export const devnetClient = new Aptos(
  new AptosConfig({ network: Network.MAINNET })
);

/// FIXME: Put your client id here
export const GOOGLE_CLIENT_ID = "654936766903-3hvv86qokdbhv1oouf7slormgeoh6l0k.apps.googleusercontent.com";
export const adminAdress = "0xb99efb212699f360849001ad54679c51c8557cf533f601942810f94be0fd8fb1"
export const NftCollectionAddr = ""
