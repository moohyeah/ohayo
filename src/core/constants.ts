// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0


export const GAME_WASM_PATH = "./Build/0a47ac674e6fde4308098eab89f20090.wasm.unityweb";
export const GAME_LOADER_PATH = "./Build/5336a4b2c43054286fd70b1faa467eee.loader.js";
export const GAME_DATA_PATH  = "./Build/68e2c23a9eadc8a3143812c7702700a4.data.unityweb";
export const GAME_FRAMEWORK_PATH = "./Build/a914b16d4513ae8763e067595893f8c4.framework.js.unityweb";

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