import { useEffect, useCallback, useState } from 'react';

import { GAME_WASM_PATH, GAME_LOADER_PATH, GAME_DATA_PATH, GAME_FRAMEWORK_PATH, postJson} from "../core/constants";

import {callContractMethod} from '../core/wallet'

function GamePage() {

  function showTips(msg:string) {
    const msgBox = document.getElementById('message-box');
    if(msgBox) msgBox.classList.remove('hidden');
    const msgContent = document.getElementById('message-content');
    if (msgContent) {
      msgContent.innerHTML = msg;
    }
  }

  const [account, setAccount] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0);
  const [gameInited, setGameInited] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/profile");
        if (!response.ok) {
          window.location.href = "/";
          return;
        }
        const data = await response.json();
        if (data.user) {
          setAccount(data.user);
          console.log(data.use);
        }
    };

    fetchUser(); 
  }, []);  

  useEffect(() => {
    var canvas = document.querySelector("#unity-canvas");
    var config = {
      dataUrl: GAME_DATA_PATH,
      frameworkUrl: GAME_FRAMEWORK_PATH,
      codeUrl: GAME_WASM_PATH,
      cacheControl: function(url: string) {
        // Caching enabled for .data and .bundle files. 
        // Revalidate if file is up to date before loading from cache
        if (url.match(/\.data/) || url.match(/\.unityweb/) || url.match(/\.ab/) || url.match(/\.gz/)) {
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
  }, [setProgress, setGameInited]);

  const handlePayOrder = useCallback(async (evt : any) => {
    const {amount, orderId} = evt.detail;
    
    const order_id = await callContractMethod(amount);
    if(order_id == -1){
      showTips("Insufficient balance!");
    }
    else if (order_id) {
      const response = await postJson("/api/check_order", {self_id: orderId, order_id : order_id});
      if (response.code == 1) {
        (window as any).unityInstance.SendMessage("HtmlReceiver", "OnPaySuccess");
      }
    }
  }, [account]);

  useEffect(()=>{
    window.addEventListener("PayOrder", handlePayOrder);
    return ()=> {
      window.removeEventListener("PayOrder", handlePayOrder);
    };
  }, [handlePayOrder]);

  return (
    <>
    <div className="min-h-screen flex flex-col bg-customGray">
      <div id="#unity-container" className="fixed inset-0 flex flex-col justify-center items-center">
        <canvas id="unity-canvas" className="h-full max-w-full justify-center border items-center aspect-[720/1280] bg-zinc-400"></canvas>
        <div id="game-loader" className="h-full max-w-full justify-center items-center aspect-[720/1280] absolute top-0 bg-zinc-400" style={{backgroundImage: "url('./bg.png')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', display: gameInited ? 'none' : 'flex'}}>
          <div id="unity-progress-bar-empty" className="w-4/5 bg-neutral-500 rounded-full h-4 absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div id="unity-progress-bar-full" className="bg-gray-950 h-4 rounded-full" style={{width: progress + "%"}}></div>
          </div>
        </div>
      </div>
      <div id="message-box" className="fixed inset-0 flex items-center justify-center hidden">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
          <div className="text-xl font-bold mb-4 text-center">Tips</div>
          <div id="message-content" className="text-gray-600 mb-6 text-center"></div>
          <div className="flex  items-center justify-center">
            <button 
              onClick={() => {
                const msgBox = document.getElementById('message-box');
                if(msgBox) msgBox.classList.add('hidden');
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default GamePage;
