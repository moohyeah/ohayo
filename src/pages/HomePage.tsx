import { useNavigate } from "react-router-dom";
import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { useState, useEffect, useCallback } from 'react';

function useExternalScripts({ url } : {url : string}){
  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");

    script.setAttribute("src", url);
    head?.appendChild(script);

    return () => {
      head?.removeChild(script);
    };
  }, [url]);
};

function Unity() {
  return (
    <>
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
    </>
  );
}

function HomePage() {
  const navigate = useNavigate();

  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();

  useEffect(() => {
    if (!activeAccount) navigate("/");
    else useExternalScripts({url : "/Build/init.js" });
  }, [activeAccount, navigate]);

  const handleGameLogin = useCallback(()=>{
    const account = activeAccount?.accountAddress.toString();
    console.log("======account" + account);
    (window as any).unityInstance.SendMessage("MainController", "OnPlatformLoginMsg", JSON.stringify({account:account, token:account}))
  }, []);

  const handleGameLogout = useCallback(()=>{
    disconnectKeylessAccount()
  }, []);

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
                        
  return (
    <>
    <Unity></Unity>
    </>
  );
}

export default HomePage;
