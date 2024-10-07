import { useNavigate } from "react-router-dom";
import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { useEffect, useCallback } from 'react';
import { adminAdress } from "../core/constants";
import { GOOGLE_CLIENT_ID } from "../core/constants";
import useEphemeralKeyPair from "../core/useEphemeralKeyPair";

function Unity() {
  return (
    <>
      <div id="game-container" style={{ position: 'fixed', top: '-100em', left: '50%', transform: 'translateX(-50%)' }}>
        <canvas id="unity-canvas"></canvas>
        <div id="unity-loading-bar">
          <div id="unity-logo"></div>
          <div id="unity-progress-bar-empty">
            <div id="unity-progress-bar-full"></div>
          </div>
        </div>
        <div id="unity-warning"> </div>
        <div id="unity-footer" style= {{display : "none"}}>
          <div id="unity-webgl-logo"></div>
          <div id="unity-fullscreen-button"></div>
          <div id="unity-build-title">ZKFairy</div>
        </div>
      </div>
    </>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const ephemeralKeyPair = useEphemeralKeyPair();
  const baseUrl = import.meta.env.VITE_BASE_URL || '/';


  const { activeAccount, disconnectKeylessAccount, transferNft, getNfts } = useKeylessAccounts();

  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");

    script.setAttribute("src", "./Build/init.js");
    head?.appendChild(script);

    return () => {
      head?.removeChild(script);
    };
  }, [activeAccount, navigate]);

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
    disconnectKeylessAccount()
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
                        
  return (
    <>
    <div className="min-h-screen flex flex-col  bg-cover bg-center" style={{ backgroundImage: `url('./bg.svg')` }}>
      <Unity></Unity>
      <div id="index">
        <nav className="bg-gray-800 px-4 h-16"> {/* 高度设置为4em，即16个单位 */}
          <div className="container mx-auto flex items-center justify-start h-full">
            <img src="./logo.png" alt="logo" className="h-8 mr-16" /> {/* 修改为 mr-16 以实现4em的间距 */}
            <ul className="flex items-center space-x-8 justify-start h-full">
              <li><a href="#" className="text-white hover:text-gray-300 active:text-blue-500">HOME</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 active:text-blue-500">SHOP</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 active:text-blue-500">EVENT</a></li>
            </ul>
          </div>
        </nav>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <img src="./rr.svg" alt="rr" className="h-auto absolute" />
          <div className="grid sm:grid-cols-3 gap-4 relative">
            <div className="sm:col-span-1">
            </div>
            <div className="sm:col-span-2">
              <div className="justify-center" style={{ width: '35em', height:'12em', backgroundImage: "url('./beijingkuang.png')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', marginLeft: '3em' }}>
                <p className="justify-center" style={{ color: "aliceblue", textAlign: "center", fontSize: "1.5em"}}>
                USER 
                </p>
                <p className="justify-center" style={{ color: "aliceblue", textAlign: "center", fontSize: "2.5em"}}>
                800000 
                </p>
                <div className="progress-bar" style={{ width: '80%', backgroundColor: '#e0e0e0', borderRadius: '5px', overflow: 'hidden', margin: '1em auto' }}>
                  <div className="progress" style={{ width: '80%', height: '13px', backgroundColor: '#76c7c0', transition: 'width 0.5s ease' }}></div>
                </div>
              </div>
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-gray-200 text-center" style={{ marginTop: '1em' }}>
                Game Is Live!<p/>
                <p>Download And Play Now!</p>
                <a href="#" className="flex justify-center mx-auto" style={{ backgroundImage: "url('./anniu.png')", width: '317px', height: '80px', backgroundSize: 'cover', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.3em' }} onClick={playGame}>
                </a>
              </h1>  
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default HomePage;
