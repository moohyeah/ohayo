// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0


export const GAME_WASM_PATH = "./Build/92f93809584e27bf74ea1e6753acdd1c.wasm.unityweb";
export const GAME_LOADER_PATH = "./Build/5336a4b2c43054286fd70b1faa467eee.loader.js";
export const GAME_DATA_PATH  = "./Build/2530f88a644bf331fa3fcf3d59379991.data.unityweb";
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