// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0


export const GAME_WASM_PATH = "./Build/0df2ce24b4a458fac315ab4e51d36287.wasm.unityweb";
export const GAME_LOADER_PATH = "./Build/5336a4b2c43054286fd70b1faa467eee.loader.js";
export const GAME_DATA_PATH  = "./Build/f20a8689b036ae25257bcb3b897af996.data.unityweb";
export const GAME_FRAMEWORK_PATH = "./Build/a23d8af17950c310873985e1a1627e58.framework.js.unityweb";

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