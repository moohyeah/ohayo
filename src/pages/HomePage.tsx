import {
  GAME_WASM_PATH,
  GAME_LOADER_PATH,
  GAME_DATA_PATH,
  GAME_FRAMEWORK_PATH,
  GAME_InitView_PATH,
  GAME_StreamingAsset_PATH,
} from "../core/constants";

function HomePage() {
  const handleGameLogout = () => {};

  return (
    <>
      <link
        rel="preload"
        href={GAME_WASM_PATH}
        type="application/wasm"
        as="fetch"
      ></link>
      <link
        rel="preload"
        href={GAME_LOADER_PATH}
        type="text/javascript"
        as="script"
      ></link>
      <link
        rel="preload"
        href={GAME_DATA_PATH}
        type="application/wasm"
        as="fetch"
      ></link>
      <link
        rel="preload"
        href={GAME_FRAMEWORK_PATH}
        type="application/wasm"
        as="fetch"
      ></link>
      <link
        rel="preload"
        href={GAME_InitView_PATH}
        type="application/octet-stream"
        as="fetch"
      ></link>
      <link
        rel="preload"
        href={GAME_StreamingAsset_PATH}
        type="application/octet-stream"
        as="fetch"
      ></link>

      <div className="min-h-screen flex flex-col bg-slate-900 relative">
        <div className="flex flex-col absolute top-10 right-5 bg-buttonBg border-primary rounded-xl text-white border">
          <button className="rounded-xl text-white p-2">Login</button>
        </div>
        <div className="pb-40 pt-20 flex flex-col justify-center items-center">
          <div className="mt-4 flex flex-col items-center">
            <img src="./profile.png" className="w-20 h-20 rounded-full" />
            <span className=" text-zinc-400 text-xl mt-2 font-bold">
              User's Name
            </span>
          </div>
          <div className="flex justify-center items-center gap-3 mt-2">
            <img src="/images/diamond.png" className="w-[44px] h-[44px]" />
            <span className="font-[impact] text-border text-5xl text-white">
              --
            </span>
          </div>
          <img src="/games/flappy-vbox.png" className="my-6 w-[335px]" />
          <div className="w-full px-10 flex justify-start items-center gap-4 mt-1">
            <div className="flex justify-center gap-2 items-center">
              <img
                src="/images/bone-border.png"
                className="w-[33px] h-[33px] mb-3"
              />
              <span className="text-primaryText text-xl font-bold">0</span>
              <div className="border-[1px] text-primary border-primary rounded-full px-[5px] text-sm">
                <span className="mb-2 font-bold">+</span>
              </div>
            </div>
            <button className="px-10 py-1 border bg-buttonBg border-primary rounded-full  text-zinc-400">
              Play
            </button>
          </div>
          <div className="flex justify-center items-center flex-col w-full px-6 gap-2">
            <span className="my-6 text-disableText">Exchange</span>
            <div className="w-full py-4 px-2 bg-[#1c1c1c] flex justify-between p-2 border border-borderColor rounded-xl">
              <div className="flex justify-center items-center gap-2">
                <img src="/images/diamond.png" className="w-[32px]" />
                <img src="/images/exchange.png" className="w-[30px]" />
                <img src="/images/vbox.png" className="w-[30px]" />
              </div>
              <button className="px-6 font-bold text-white font-[impact] border border-primary rounded-full bg-buttonBg">
                Get vDBX
              </button>
            </div>
            <div className="w-full py-4 px-2 bg-[#1c1c1c] flex justify-between p-2 border border-borderColor rounded-xl">
              <div className="flex justify-center items-center gap-2">
                <img src="/images/vbox.png" className="w-[32px]" />
                <img src="/images/exchange.png" className="w-[30px]" />
                <img src="/images/bone-border.png" className="w-[30px]" />
              </div>
              <button className="px-5 font-bold text-white font-[impact] border border-primary rounded-full bg-buttonBg">
                Get Bones
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
