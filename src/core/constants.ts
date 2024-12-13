// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0


export const GAME_WASM_PATH = "./Build/b44bd5435ca3c1a43cf61f3de774ec0c.wasm.unityweb";
export const GAME_LOADER_PATH = "./Build/5336a4b2c43054286fd70b1faa467eee.loader.js";
export const GAME_DATA_PATH  = "./Build/92fb571e94889e591bb508b40ab1eef1.data.unityweb";
export const GAME_FRAMEWORK_PATH = "./Build/7567b985417689c0d50a5f7dac1b2604.framework.js.unityweb";

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