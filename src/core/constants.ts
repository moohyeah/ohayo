// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0


export const GAME_WASM_PATH = "./Build/c2d99995bd2b40de821180dbbc268d26.wasm.gz";
export const GAME_LOADER_PATH = "./Build/bb0d9ecdb05db3e84da20bd14a4f84dc.loader.js";
export const GAME_DATA_PATH  = "./Build/44cd26388f4fca6eb8fdea72deb211d2.data.gz";
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