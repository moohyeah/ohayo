import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { useEffect, useCallback, useState } from 'react';
import { adminAdress } from "../core/constants";
import { GOOGLE_CLIENT_ID } from "../core/constants";
import useEphemeralKeyPair from "../core/useEphemeralKeyPair";
import Tabs from "../components/Tabs";

const GAME_WASM_PATH = "./Build/7b7231e6f820f0ffce5628e22f52e5df.wasm.unityweb";
const GAME_LOADER_PATH = "./Build/5336a4b2c43054286fd70b1faa467eee.loader.js";
const GAME_DATA_PATH  = "./Build/c488277a3f1916f7efcefcb91f5f58a7.data.unityweb";
const GAME_FRAMEWORK_PATH = "./Build/71082b2a0870e4e16c64fad78d7f6315.framework.js.unityweb";
const GAME_InitView_PATH = "./StreamingAssets/art_ui_uigameupdateview.prefab_d6bf55d13d246f7a5166990d03d02189.ab";
const GAME_StreamingAsset_PATH = "./StreamingAssets/StreamingAssets";


function HomePage() {
  const ephemeralKeyPair = useEphemeralKeyPair();
  const baseUrl = import.meta.env.VITE_BASE_URL || '/';

  const { activeAccount, disconnectKeylessAccount, transferNft, getNfts, transferCoin, getBalance} = useKeylessAccounts();
  const [progress, setProgress] = useState<number>(0);
  const [gameInited, setGameInited] = useState<boolean>(false);

  useEffect(() => {
    if (activeAccount == null) {
      return;
    }

    var canvas = document.querySelector("#unity-canvas");

    var config = {
      dataUrl: GAME_DATA_PATH,
      frameworkUrl: GAME_FRAMEWORK_PATH,
      codeUrl: GAME_WASM_PATH,
      cacheControl: function(url: string) {
        // Caching enabled for .data and .bundle files. 
        // Revalidate if file is up to date before loading from cache
        if (url.match(/\.data/) || url.match(/\.unityweb/) || url.match(/\.ab/)) {
          return "must-revalidate";
        }

        // Caching enabled for .mp4 and .custom files
        // Load file from cache without revalidation.
        if (url.match(/\.mp4/) || url.match(/\.custom/)) {
          return "immutable";
        }

        // Disable explicit caching for all other files.
        // Note: the default browser cache may cache them anyway.
        return "no-store";
      },
      streamingAssetsUrl: "./StreamingAssets",
      companyName: "Zhuhai Theophilus Network Technology Co. Ltd.",
      productName: "Ohayo Master",
      productVersion: "1.5.7",
      // showBanner: unityShowBanner,
    };

    const head = document.querySelector("head");
    const script = document.createElement("script");

    script.setAttribute("src", GAME_LOADER_PATH);
    head?.appendChild(script);
    script.onload = () => {
      (window as any).createUnityInstance(canvas, config, (progress: number) => {
        setProgress(100 * progress - 1);
      }).then((unityInstance: any) => {
        (window as any).unityInstance = unityInstance;
        console.log('init Done');
        setTimeout(function() {
          setProgress(100)
          setGameInited(true);
        }, 3000)
      }).catch((message: string) => {
        alert(message);
      });
    };

    return () => {
      head?.removeChild(script);
    };
  }, [activeAccount, setProgress, setGameInited]);

  const googleLogin = useCallback(()=> {

    const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  
    const searchParams = new URLSearchParams({
      /**
       * Replace with your own client ID
       */
      client_id: GOOGLE_CLIENT_ID,
      /**
       * The redirect_uri must be registered in the Google Developer Console. This callback page
       * parses the id_token from the URL fragment and combines it with the ephemeral key pair to
       * derive the keyless account.
       *
       * window.location.origin == http://localhost:5173
       */
      redirect_uri: `${window.location.origin}${baseUrl}callback`,
      /**
       * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
       * for SPAs as it does not require a backend server.
       */
      response_type: "id_token",
      scope: "openid email profile",
      nonce: ephemeralKeyPair.nonce,
    });
    redirectUrl.search = searchParams.toString();
    console.log(`${redirectUrl.toString()}`);
    window.location.href = redirectUrl.toString();
  }, [useEphemeralKeyPair]);

  const playGame = useCallback(()=> {
    if (activeAccount == null) {
      googleLogin();
      return;
    }
    const indexElement = document.getElementById('index');
    const gameContainerElement = document.getElementById('game-container');
    if (indexElement) indexElement.style.display = 'none';
    if (gameContainerElement) gameContainerElement.style.top = '0'; 
  }, []);

  const SendBlockChainMsgToGame = useCallback((data: any) => {
    (window as any).unityInstance.SendMessage("MainController", "OnBlockChainMsg", JSON.stringify(data));
  }, []);

  const handleGameLogin = useCallback(async ()=>{
    const account = activeAccount?.accountAddress?.toString();
    if (account) {
      console.log(`=======login?${account}`);
      const nick = `${account.slice(0, 4)}...${account.slice(-6)}`;
      (window as any).unityInstance.SendMessage("MainController", "OnPlatformLoginMsg", JSON.stringify({account: account, token: account, nick: nick}));
    } else {
      console.warn("账户未定义，无法登录");
    }
  }, []);

  const handleGameLogout = useCallback(()=>{
    disconnectKeylessAccount()
  }, []);

  const handleNFtTransfer = useCallback(async (evt : any) => {
    const {tokenId, recipient} = evt.detail;
    console.log(`transferNft: ${tokenId}, ${recipient}`);
    const hash = await transferNft(tokenId, recipient);
    console.log(`transferNft Finish: ${hash}`);
    SendBlockChainMsgToGame({msgType: "nft_transfer_ret", hash: hash});
  }, [transferNft]);

  const handleGetNfts = useCallback(async () => {
    const nfts = await getNfts();
    const formattedNfts = nfts.map(nft => ({
      token_id: nft.token_data_id,
      tid: parseInt(nft.current_token_data?.token_properties?.id),
    }));
    (window as any).unityInstance.SendMessage("MainController", "OnNftListMsg", JSON.stringify(formattedNfts));
  }, [getNfts]);

  const handleTransferCoin = useCallback(async (evt : any) => {
    const {amount, recipient} = evt.detail;
    let balance = await getBalance();
    if (amount >= balance) {
      alert("Insufficient APT balance");
      return;
    }
    const tranx_hash = await transferCoin(amount, recipient);
    balance = await getBalance();
    SendBlockChainMsgToGame({msgType: "transfer_coin_ret", balance: balance, hash: tranx_hash})
  }, [transferCoin]);

  const handlePayOrder = useCallback(async (evt : any) => {
    const {amount, orderId} = evt.detail;
    const balance = await getBalance();
    if (amount >= balance) {
      alert("Insufficient APT balance");
      return;
    }
    const tranx_hash = await transferCoin(amount, adminAdress);
    (window as any).unityInstance.SendMessage("MainController", "OnPlatformPayMsg", JSON.stringify({hash: tranx_hash, order_id: orderId}));
  }, [transferCoin]);

  useEffect(()=>{
    window.addEventListener("GameLogout", handleGameLogout);
    return ()=> {
      window.removeEventListener("GameLogout", handleGameLogout);
    };
  }, [handleGameLogout]);

  useEffect(()=>{
    window.addEventListener("GameLogin", handleGameLogin);
    return ()=> {
      window.removeEventListener("GameLogin", handleGameLogin);
    };
  }, [handleGameLogin]);

  useEffect(()=>{
    window.addEventListener("NFTTransfer", handleNFtTransfer);
    return ()=> {
      window.removeEventListener("NFTTransfer", handleNFtTransfer);
    };
  }, [handleNFtTransfer]);

  useEffect(()=>{
    window.addEventListener("NFTList", handleGetNfts);
    return ()=> {
      window.removeEventListener("NFTList", handleGetNfts);
    };
  }, [handleGetNfts]);

  useEffect(()=>{
    window.addEventListener("TransferCoin", handleTransferCoin);
    return ()=> {
      window.removeEventListener("TransferCoin", handleTransferCoin);
    };
  }, [handleTransferCoin]);

  useEffect(()=>{
    window.addEventListener("PayOrder", handlePayOrder);
    return ()=> {
      window.removeEventListener("PayOrder", handlePayOrder);
    };
  }, [handlePayOrder]);

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
    {/* <div className="min-h-screen flex flex-col  bg-cover bg-center" style={{ backgroundImage: `url('./bg.svg')` }}> */}
      <div id="#unity-container" className="fixed inset-0 flex flex-col justify-center items-center" style={{display: activeAccount == null ? 'none' : 'flex'}}>
        <canvas id="unity-canvas" className="h-full max-w-full justify-center border items-center aspect-[720/1280] bg-zinc-400"></canvas>
        <div id="game-loader" className="h-full max-w-full justify-center items-center aspect-[720/1280] absolute top-0" style={{backgroundImage: "url('./loading-bg.jpg')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'top', display: gameInited ? 'none' : 'flex'}}>
          <div id="unity-progress-bar-empty" className="w-4/5 bg-neutral-500 rounded-full h-4 absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div id="unity-progress-bar-full" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-4 rounded-full" style={{width: progress + "%"}}></div>
          </div>
        </div>
      </div>
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
          <div className="relative text-center sm:h-auto h-1/3 bg-cover" style={{backgroundImage: "url('./bg.jpg')"}}>
            {/* <img className="absolute left-1/2 -translate-x-1/2 w-full h-full" src="./bg.jpg"></img> */}
            <div className="">
              <div className="px-4 relative mx-auto w-full sm:w-2/3 py-14 flex flex-wrap items-center justify-center">
                <img src="./gameshow.png" className=" h-auto absolute top-6 left-4"></img>
                <img src="./k.png" className=" py-8 h-auto w-auto"></img>
                <img src="./rm.png" className="h-auto w-auto"></img>
              </div>
              <div className="px-4 relative mx-auto w-full sm:w-2/3 py-14 flex flex-wrap items-center justify-center">
                <img src="./nft.png" className="h-auto absolute top-10 left-4"></img>
                <div className="pt-16 pb-8 flex flex-wrap items-center justify-center sm:space-x-4 space-y-5">
                  <img src="./nft1.png"></img>
                  <img src="./nft2.png"></img>
                  <img src="./nft3.png"></img>
                </div>
              </div>
              <div className="px-4 relative mx-auto w-full sm:w-2/3 py-14 flex flex-wrap items-center justify-center">
                <img src="./hero.png" className=" h-auto absolute top-6 left-4"></img>
                <Tabs/>
              </div>
              <div className="px-4 relative mx-auto w-full sm:w-2/3 py-14 flex flex-wrap items-center justify-center">
                <img src="./HORCRUX.png" className=" h-auto absolute top-6 left-4"></img>
                <div className="pl-8 pt-16 pb-8 flex flex-wrap items-center justify-center sm:space-x-4 space-y-5">
                  <img src="./HORCRUX1.png" className=" mr-4"></img>
                  <img src="./HORCRUX2.png" className=" mr-4"></img>
                  <img src="./HORCRUX3.png" className=" mr-4"></img>
                  <img src="./HORCRUX4.png" className=" mr-4"></img>
                </div>
              </div>
              <div className="px-4 relative mx-auto w-full sm:w-2/3 py-14 flex flex-wrap items-center justify-center">
                <img src="./Building+AWA.png" className=" h-auto absolute top-6 left-4"></img>
                <div className="pt-14 pb-8 inline-flex">
                  <img src="./jianzhu1.png" className=" mr-4"></img>
                  <img src="./jianzhu2.png" className=" mr-4"></img>
                  <img src="./jianzhu3.png" className=" mr-4"></img>
                  <img src="./jianzhu4.png" className=" mr-4"></img>
                </div>
              </div>
              <div className="px-4 relative mx-auto w-full sm:w-2/3 py-14 flex flex-wrap items-center justify-center">
                <img src="./weapon.png" className=" h-auto absolute top-6 left-4"></img>
                <div className="pt-14 pb-8 inline-flex">
                  <img src="./wuqi1.png" className=" mr-4"></img>
                  <img src="./wuqi2.png" className=" mr-4"></img>
                  <img src="./wuqi3.png" className=" mr-4"></img>
                  <img src="./wuqi4.png" className=" mr-4"></img>
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
