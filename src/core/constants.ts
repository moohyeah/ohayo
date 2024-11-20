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
export const NftCollectionAddr = "0xeae12edd5c14e463917e12f37487310e0e01e5ca7a41d69541f589d4c16acca8"

export const GAME_WASM_PATH = "./Build/7b9779478a730f8188c967494edab403.wasm.unityweb";
export const GAME_LOADER_PATH = "./Build/5336a4b2c43054286fd70b1faa467eee.loader.js";
export const GAME_DATA_PATH  = "./Build/1cf7223ab26850264f10f761a8b178bc.data.unityweb";
export const GAME_FRAMEWORK_PATH = "./Build/ac3093da3d2726a129a790f7f40e2525.framework.js.unityweb";
export const GAME_InitView_PATH = "./StreamingAssets/art_ui_uigameupdateview.prefab_d6bf55d13d246f7a5166990d03d02189.ab";
export const GAME_StreamingAsset_PATH = "./StreamingAssets/StreamingAssets";