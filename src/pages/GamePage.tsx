import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { useEffect, useCallback, useState, useRef } from 'react';
import { adminAdress } from "../core/constants";
import { useNavigate } from "react-router-dom";

// import useEphemeralKeyPair from "../core/useEphemeralKeyPair";
// import {googleLogin} from '../core/utils';
import { GAME_WASM_PATH, GAME_LOADER_PATH, GAME_DATA_PATH,
    GAME_FRAMEWORK_PATH} from "../core/constants";
import { KeylessAccount } from "@aptos-labs/ts-sdk";


function GamePage() {
//   const ephemeralKeyPair = useEphemeralKeyPair();
  const isLoading = useRef(false);
  const keyLessAccount = useKeylessAccounts();
  const {disconnectKeylessAccount, transferNft, getNfts, transferCoin, getBalance, switchKeylessAccount} = keyLessAccount;
  const [progress, setProgress] = useState<number>(0);
  const [gameInited, setGameInited] = useState<boolean>(false);
  const [activeAccount, setActiveAccount] = useState<KeylessAccount | undefined >(keyLessAccount.activeAccount);
  const navigate = useNavigate();
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

  useEffect(() => {
    if (activeAccount == null) {
      if (isLoading.current) return;
      isLoading.current = true;
      if (keyLessAccount.accounts && keyLessAccount.accounts.length > 0) {
        (async () => {
          try {
            const newActiveAccount = await switchKeylessAccount(keyLessAccount.accounts[0].idToken.raw);
            if (newActiveAccount) {
                setActiveAccount(newActiveAccount);
            } else {
                navigate("/");
            }
          } catch (error) {
            console.error(error);
          }
        })();
      }
      return;
    }
  }, [keyLessAccount, isLoading, setProgress, setGameInited]);

  useEffect(()=> {

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
  }, []);

  const SendBlockChainMsgToGame = useCallback((data: any) => {
    (window as any).unityInstance.SendMessage("MainController", "OnBlockChainMsg", JSON.stringify(data));
  }, []);

  const handleGameLogin = useCallback(async ()=>{
    const account = activeAccount?.accountAddress?.toString();
    if (account) {
      const nick = `${account.slice(0, 4)}...${account.slice(-6)}`;
      const ref_user = sessionStorage.getItem("ref_user");
      let msg = {account, token: account, nick, ref_user};
      if (msg.ref_user == null) {
        msg.ref_user="";
      }
      console.log("=======login?", msg);
      (window as any).unityInstance.SendMessage("MainController", "OnPlatformLoginMsg", JSON.stringify(msg));
    } else {
      console.warn("账户未定义，无法登录");
    }
  }, [activeAccount]);

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

  return (
    <>
    <div className="min-h-screen flex flex-col bg-slate-900">
      <div id="#unity-container" className="fixed inset-0 flex flex-col justify-center items-center" style={{display: activeAccount == null ? 'none' : 'flex'}}>
        <canvas id="unity-canvas" className="h-full max-w-full justify-center border items-center aspect-[720/1280] bg-zinc-400"></canvas>
        <div id="game-loader" className="h-full max-w-full justify-center items-center aspect-[720/1280] absolute top-0" style={{backgroundImage: "url('./loading-bg.jpg')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'top', display: gameInited ? 'none' : 'flex'}}>
          <div id="unity-progress-bar-empty" className="w-4/5 bg-neutral-500 rounded-full h-4 absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div id="unity-progress-bar-full" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-4 rounded-full" style={{width: progress + "%"}}></div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default GamePage;
