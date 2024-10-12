import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { useEffect, useCallback, useState } from 'react';
import { adminAdress } from "../core/constants";
import { GOOGLE_CLIENT_ID } from "../core/constants";
import useEphemeralKeyPair from "../core/useEphemeralKeyPair";

const GAME_WASM_PATH = "./Build/a2630aec6f4e1eb2f510ff4313ea0673.wasm.unityweb";
const GAME_LOADER_PATH = "./Build/5336a4b2c43054286fd70b1faa467eee.loader.js";
const GAME_DATA_PATH  = "./Build/306d7bcdd5be729a5980c4f3ece40881.data.unityweb";
const GAME_FRAMEWORK_PATH = "./Build/ba7f793600b09a0f8fd01742aba2300b.framework.js.unityweb";

function HomePage() {
  const ephemeralKeyPair = useEphemeralKeyPair();
  const baseUrl = import.meta.env.VITE_BASE_URL || '/';

  const { activeAccount, disconnectKeylessAccount, transferNft, getNfts } = useKeylessAccounts();
  const [progress, setProgress] = useState<number>(0);


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
      productName: "方舟之旅",
      productVersion: "1.5.7",
      // showBanner: unityShowBanner,
    };

    const head = document.querySelector("head");
    const script = document.createElement("script");

    script.setAttribute("src", GAME_LOADER_PATH);
    head?.appendChild(script);
    script.onload = () => {
      (window as any).createUnityInstance(canvas, config, (progress: number) => {
        // console.log(`progress: ${progress}`);
        setProgress(100 * progress);
      }).then((unityInstance: any) => {
        (window as any).unityInstance = unityInstance;
        console.log('init Done')
      }).catch((message: string) => {
        alert(message);
      });
    };

    return () => {
      head?.removeChild(script);
    };
  }, [activeAccount]);

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

  const handleGameLogin = useCallback(()=>{
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

  const handleNFtBurn = useCallback(async (evt : any) => {
    const {tokenId} = evt.detail;
    const hash = await transferNft(tokenId, adminAdress);
    console.log(`transferNft Finish: ${hash}`)
  }, [transferNft]);

  const handleGetNfts = useCallback(async () => {
    const nfts = await getNfts();
    const formattedNfts = nfts.map(nft => ({
      token_id: nft.token_data_id,
      property: nft.current_token_data?.token_properties
    }));
    console.log('格式化的NFT列表:', formattedNfts);
    (window as any).unityInstance.SendMessage("MainController", "OnNftListMsg", JSON.stringify(formattedNfts))
  }, [getNfts]);

  useEffect(()=>{
    window.addEventListener("GameLogout", handleGameLogout);
    return ()=> {
      window.removeEventListener("GameLogout", handleGameLogout);
    };
  }, [handleGameLogout])

  useEffect(()=>{
    window.addEventListener("GameLogin", handleGameLogin);
    return ()=> {
      window.removeEventListener("GameLogin", handleGameLogin);
    };
  }, [handleGameLogin])

  useEffect(()=>{
    window.addEventListener("NFTBurn", handleNFtBurn);
    return ()=> {
      window.removeEventListener("NFTBurn", handleNFtBurn);
    };
  }, [handleNFtBurn])

  useEffect(()=>{
    window.addEventListener("NFTList", handleGetNfts);
    return ()=> {
      window.removeEventListener("NFTList", handleGetNfts);
    };
  }, [handleGetNfts])

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
    <link rel="preload" href={GAME_WASM_PATH} as="fetch" type="application/wasm"></link>
    <link rel="preload" href={GAME_LOADER_PATH} as="script"></link>
    <link rel="preload" href={GAME_DATA_PATH} as="fetch" type="application/wasm"></link>
    <link rel="preload" href={GAME_FRAMEWORK_PATH} as="fetch" type="application/wasm"></link>

    <div className="min-h-screen flex flex-col bg-gradient-to-r from-cyan-950 from-10% via-zinc-950 via-50% to-fuchsia-950">
    {/* <div className="min-h-screen flex flex-col  bg-cover bg-center" style={{ backgroundImage: `url('./bg.svg')` }}> */}
      <div id="#unity-container" className="fixed inset-0 flex flex-col justify-center items-center" style={{display: activeAccount == null ? 'none' : 'flex'}}>
        <canvas id="unity-canvas" className="h-full max-w-full justify-center border items-center aspect-[720/1280] bg-zinc-400"></canvas>
        <div id="game-loader" className="h-full max-w-full justify-center items-center aspect-[720/1280] absolute top-0" style={{backgroundImage: "url('./loading-bg.jpg')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'top', display: progress >= 100 ? 'none' : 'flex'}}>
          <div id="unity-progress-bar-empty" className="w-4/5 bg-neutral-500 rounded-full h-4 absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div id="unity-progress-bar-full" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-4 rounded-full" style={{width: progress + "%"}}></div>
          </div>
        </div>
      </div>
      <div id="index" style={{display: activeAccount != null ? 'none' : 'block'}}>
        <nav className="bg-gray-800 px-4 h-16 w-full"> {/* 高度设置为4em，即16个单位 */}
          <div className="container mx-auto flex items-center justify-start h-full flex">
            <img src="./logo.png" alt="logo" className="h-8 mr-16" /> {/* 修改为 mr-16 以实现4em的间距 */}
            <ul className="flex items-center space-x-8 justify-start h-full">
              <li><a href="#" className="text-white hover:text-gray-300 active:text-blue-500">HOME</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 active:text-blue-500">SHOP</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 active:text-blue-500">EVENT</a></li>
            </ul>
          </div>
        </nav>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4 max-w-5xl">
          <img src="./rr.svg" alt="rr" className="h-auto absolute" />
          <div className="relative sm:w-3/5 text-center sm:ml-auto rounded-lg pt-60 sm:pl-16 sm:pt-2">
            {/* <div className="relative justify-center w-full item-center" style={{backgroundImage: "url('./beijingkuang.png')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', paddingBottom: '33.33%'}}>
              <div className="absolute inset-0 block items-center justify-center text-slate-200">
                <p className="justify-center text-center text-xl sm:text-2xl" style={{ marginTop:"0.15em"}}>
                  USER 
                </p>
                <p className="justify-center text-center text-2xl sm:text-4xl mt-7"id="user-total">
                {userTotal !== null ? userTotal : '加载中...'} 
                </p>
              </div>
            </div> */}
            <h1 className="text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-gray-200 text-center" style={{ marginTop: '1em' }}>
              Game Is Live!<p/>
              <p>Download And Play Now!</p>
              <a href="#" className="flex justify-center mx-auto mt-8" style={{ backgroundImage: "url('./anniu.png')", width: '317px', height: '80px'}} onClick={playGame}>
              </a>
            </h1> 
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default HomePage;
