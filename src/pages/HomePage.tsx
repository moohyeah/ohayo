import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { useEffect, useCallback, useState } from 'react';
import { GAME_WASM_PATH, GAME_LOADER_PATH, GAME_DATA_PATH,
  GAME_FRAMEWORK_PATH, GAME_InitView_PATH, GAME_StreamingAsset_PATH} from "../core/constants";

import useEphemeralKeyPair from "../core/useEphemeralKeyPair";
import Tabs from "../components/Tabs";
import {googleLogin} from '../core/utils';

function HomePage() {
  const ephemeralKeyPair = useEphemeralKeyPair();

  const { activeAccount } = useKeylessAccounts();

  function removeParameterFromCurrentURL() {
    const url = new URL(window.location.href);
    url.search = "";
    // 更新地址栏的 URL
    window.history.replaceState({}, document.title, url.toString());
  }

  if (window.location.search) {
    console.log(window.location.search);
    const params = new URLSearchParams(window.location.search);
    const ref_user = params.get("__ref");
    if (ref_user) {
      sessionStorage.setItem("ref_user", ref_user);
      removeParameterFromCurrentURL();
    }
  }

  const playGame = useCallback(()=> {
    if (activeAccount == null) {
      googleLogin(ephemeralKeyPair.nonce);
      return;
    }
  }, []);

  const [userTotal, setUserTotal] = useState<number | null>(null); // 添加状态管理

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const response = await fetch(`https://ohayoaptos.com/op_hammer/getServerUserNum`); // 替换为实际的 API 地址
        if (!response.ok) {
          throw new Error('网络响应不正常');
        }
        const data = await response.text();
        setUserTotal(parseInt(data)); // 假设返回的数据中有 balance 字段
      } catch (error) {
        console.error('获取用户数:', error);
      }
    };

    fetchUserBalance(); // 调用函数以获取用户余额
  }, []); // 依赖于 baseUrl
                        
  return (
    <>
    <link rel="preload" href={GAME_WASM_PATH} type="application/wasm" as="fetch"></link>
    <link rel="preload" href={GAME_LOADER_PATH} type="text/javascript" as="script"></link>
    <link rel="preload" href={GAME_DATA_PATH} type="application/wasm" as="fetch"></link>
    <link rel="preload" href={GAME_FRAMEWORK_PATH} type="application/wasm" as="fetch"></link>
    <link rel="preload" href={GAME_InitView_PATH} type="application/octet-stream" as="fetch"></link>
    <link rel="preload" href={GAME_StreamingAsset_PATH} type="application/octet-stream" as="fetch"></link>

    <div className="min-h-screen flex flex-col bg-slate-900">
      <div id="index" className="grid min-h-svh grid-rows-[auto_1fr_auto] overflow-hidden" style={{display: activeAccount != null ? 'none' : 'grid'}}>
        <div className="container mx-auto sm:px-6 lg:px-8">
          <div className="relative h-screen text-center" style={{backgroundImage: "url('./bg2.jpg')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
            <div className="absolute left-1/2 -translate-x-1/2 top-0 text-2xl pt-4 scale-75 sm:scale-100" style={{backgroundImage: "url('./dl.png')", width: '438px', height: '61px'}}>
              <span className=" text-white">USER: </span> <span className=" text-amber-300">{userTotal}</span>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-12 pb-10 w-4/5">
              <h1 className="text-4xl sm:text-5xl font-bold text-stroke text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 text-center" style={{ marginTop: '1em' }}>
                Game Is Live! Play Now!<p/>
                <a href="#" className="flex justify-center mx-auto mt-4" style={{ backgroundImage: "url('./anniu.png')", width: '288px', height: '63px'}} onClick={playGame}>
                </a>
              </h1>
              <ul className="inline-flex absolute bottom-0 right-0">
                <li className="px-2">
                  <a href="https://twitter.com/OhayoAptos" target="_blank" className="flex justify-center mx-auto mt-4" style={{ backgroundImage: "url('./x.png')", width: '30px', height: '30px'}}>
                  </a>
                </li>
                <li  className="px-2">
                  <a href="https://www.youtube.com/@OhayoAptos" target="_blank" className="flex justify-center mx-auto mt-4" style={{ backgroundImage: "url('./yt.png')", width: '30px', height: '30px'}}>
                  </a>
                </li>
                <li  className="px-2">
                  <a href="https://t.me/OhayoAptosBot" target="_blank" className="flex justify-center mx-auto mt-4" style={{ backgroundImage: "url('./tg.png')", width: '30px', height: '30px'}}>
                  </a>
                </li>
                <li  className="px-2">
                  <a href="mailto:ohayoaptos@gmail.com" target="_blank" className="flex justify-center mx-auto mt-4" style={{ backgroundImage: "url('./mail.png')", width: '30px', height: '30px'}}>
                  </a>
                </li>
              </ul> 
            </div>
          </div>
          <div className="relative text-center w-full" style={{backgroundImage: "url('./gt.png')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', height: "68px"}}>
          </div>
          <div className="relative text-center h-auto bg-cover" style={{backgroundImage: "url('./bg.jpg')"}}>
            {/* <img className="absolute left-1/2 -translate-x-1/2 w-full h-full" src="./bg.jpg"></img> */}
            <div className="">
              <div className="px-4 relative mx-auto w-full sm:w-3/4 py-14 flex flex-wrap items-center justify-center">
                <img src="./gameshow.png" className=" h-auto absolute top-6 left-4"></img>
                <img src="./k.png" className=" py-8 h-auto w-auto"></img>
                <img src="./rm.png" className="h-auto w-auto"></img>
              </div>
              <div className="px-4 relative mx-auto w-full sm:w-3/4 py-14 flex flex-wrap items-center justify-center">
                <img src="./nft.png" className="h-auto absolute top-10 left-4"></img>
                <div className="pt-16 pb-8 flex flex-wrap items-center justify-center sm:space-x-4 space-y-5">
                  <img src="./nft1.png"></img>
                  <img src="./nft2.png"></img>
                  <img src="./nft3.png"></img>
                </div>
              </div>
              <div className="px-4 relative mx-auto w-full sm:w-3/4 py-14 flex flex-wrap items-center justify-center">
                <img src="./hero.png" className=" h-auto absolute top-6 left-4"></img>
                <Tabs/>
              </div>
              <div className="px-4 relative mx-auto w-full sm:w-3/4 py-14 flex flex-wrap items-center justify-center">
                <img src="./HORCRUX.png" className=" h-auto absolute top-6 left-4"></img>
                <div className="sm:pl-8 pt-16 pb-8 flex flex-wrap items-center justify-center sm:space-x-4 space-y-5">
                  <img src="./HORCRUX1.png"></img>
                  <img src="./HORCRUX2.png"></img>
                  <img src="./HORCRUX3.png"></img>
                  <img src="./HORCRUX4.png"></img>
                </div>
              </div>
              <div className="px-4 relative mx-auto w-full sm:w-3/4 py-14 flex flex-wrap items-center justify-center">
                <img src="./Building+RWA.png" className=" h-auto absolute top-6 left-4"></img>
                <div className="sm:pl-8 pt-16 pb-8 flex flex-wrap items-center justify-center sm:space-x-4 space-y-5">
                  <img src="./jianzhu1.png"></img>
                  <img src="./jianzhu2.png"></img>
                  <img src="./jianzhu3.png"></img>
                  <img src="./jianzhu4.png"></img>
                </div>
              </div>
              <div className="px-4 relative mx-auto w-full sm:w-3/4 py-14 flex flex-wrap items-center justify-center">
                <img src="./weapon.png" className=" h-auto absolute top-6 left-4"></img>
                <div className="sm:pl-8 pt-16 pb-8 flex flex-wrap items-center justify-center sm:space-x-4 space-y-5">
                  <img src="./wuqi1.png"></img>
                  <img src="./wuqi2.png"></img>
                  <img src="./wuqi3.png"></img>
                  <img src="./wuqi4.png"></img>
                </div>
              </div>
            </div>
          </div>
          <div className=" relative  bg-slate-900">
            <div className=" text-white text-left block justify-center items-center mx-auto w-full sm:w-2/3 py-10 px-4">
              <p>Welcome to Ohayo Master! </p>
              <p>Here, you will embark on adventures and live alongside dozens of fun and adorable characters. 
              Gather valuable materials through your adventures, use them to craft various items, fulfill 
              orders, and earn funds. As your wealth grows, you can continually train and strengthen your 
              characters, allowing them to excel in more challenging quests.</p>
              <p>Are you ready to begin your journey of adventure and management?</p>
              <p className="text-left text-xs font-bold xs:text-sm mt-8">2024 Copyright. OhayoMaster Labs Inc. All Rights Reserved.</p>
            </div>
          </ div>
        </div>
      </div>
    </div>
    </>
  );
}

export default HomePage;
