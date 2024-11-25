// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0


export const GAME_WASM_PATH = "./Build/1ca7bf86f5af6b5e0ee63f8ab04aa7f9.wasm.unityweb";
export const GAME_LOADER_PATH = "./Build/5336a4b2c43054286fd70b1faa467eee.loader.js";
export const GAME_DATA_PATH  = "./Build/bea887af1c0ebb94361e51d78a76ad0d.data.unityweb";
export const GAME_FRAMEWORK_PATH = "./Build/a25f8f5b2e5ac008fe39bad378d748ab.framework.js.unityweb";
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