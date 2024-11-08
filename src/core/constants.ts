// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0


export const GAME_WASM_PATH = "./Build/130be388f5859e9663f8050dd22de535.wasm.gz";
export const GAME_LOADER_PATH = "./Build/bb0d9ecdb05db3e84da20bd14a4f84dc.loader.js";
export const GAME_DATA_PATH  = "./Build/ff66fd0cc926b64fe5df1459644c11a6.data.gz";
export const GAME_FRAMEWORK_PATH = "./Build/008b4fe435330425b80028923a1813a3.framework.js.gz";
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