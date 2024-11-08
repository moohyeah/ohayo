// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0


export const GAME_WASM_PATH = "./Build/fcb20b0f44548c6be62fac952baf6b35.wasm.gz";
export const GAME_LOADER_PATH = "./Build/bb0d9ecdb05db3e84da20bd14a4f84dc.loader.js";
export const GAME_DATA_PATH  = "./Build/b2dff06656acf6130f6ef9c8165056cf.data.gz";
export const GAME_FRAMEWORK_PATH = "./Build/91b01fa2a44df20650c97c4d566536d2.framework.js.gz";
export const APPID = "ShATk8B1VYKHrzx3";

export const postJson = async (url : string, param: any) => {
    const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(param),
      });
    const data = await result.json();
    return data
}