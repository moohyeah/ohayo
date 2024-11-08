// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0


export const GAME_WASM_PATH = "./Build/8650dbdf95ed6921c38e9f25a67cbb30.wasm.gz";
export const GAME_LOADER_PATH = "./Build/bb0d9ecdb05db3e84da20bd14a4f84dc.loader.js";
export const GAME_DATA_PATH  = "./Build/d1d87ef178ccaa9bf06a4e9d3ff646a4.data.gz";
export const GAME_FRAMEWORK_PATH = "./Build/8dad7303fd30c791f74bebb8eb982cce.framework.js.gz";
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