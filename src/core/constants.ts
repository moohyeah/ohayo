// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0


export const GAME_WASM_PATH = "./Build/4cc1fd1b0376f0ea14ac05c2cc714510.wasm.unityweb";
export const GAME_LOADER_PATH = "./Build/5336a4b2c43054286fd70b1faa467eee.loader.js";
export const GAME_DATA_PATH  = "./Build/4a095e359b47c33d5e54b0dd294f32bf.data.unityweb";
export const GAME_FRAMEWORK_PATH = "./Build/008b4fe435330425b80028923a1813a3.framework.js.unityweb";
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