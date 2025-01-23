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
export const GOOGLE_CLIENT_ID = "189497334594-ouoibstela8f5n7789vkh4jtp01v7h0q.apps.googleusercontent.com";
export const adminAdress = "0xb99efb212699f360849001ad54679c51c8557cf533f601942810f94be0fd8fb1"
export const NftCollectionAddr = "0xeae12edd5c14e463917e12f37487310e0e01e5ca7a41d69541f589d4c16acca8"

export const GAME_WASM_PATH = "./Build/823c4a100534f865b806a82097dc9292.wasm.unityweb";
export const GAME_LOADER_PATH = "./Build/5336a4b2c43054286fd70b1faa467eee.loader.js";
export const GAME_DATA_PATH  = "./Build/a50cedd5333db06c4391b33e58c95ea5.data.unityweb";
export const GAME_FRAMEWORK_PATH = "./Build/66923f1072fc3cae5cf967fdd2262a5d.framework.js.unityweb";
export const GAME_InitView_PATH = "./StreamingAssets/art_ui_uigameupdateview.prefab_d6bf55d13d246f7a5166990d03d02189.ab";
export const GAME_StreamingAsset_PATH = "./StreamingAssets/StreamingAssets";