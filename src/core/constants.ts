// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0


export const GAME_WASM_PATH = "./Build/2cd76998061cc1e0cbf7d0754c3aaa46.wasm.unityweb";
export const GAME_LOADER_PATH = "./Build/bb0d9ecdb05db3e84da20bd14a4f84dc.loader.js";
export const GAME_DATA_PATH  = "./Build/06b2baabc51b57d2232e75f87e6c8893.data.unityweb";
export const GAME_FRAMEWORK_PATH = "./Build/504e3bd30082d3bc6f39904c312ffcc1.framework.js.unityweb";
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