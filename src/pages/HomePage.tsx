import { useNavigate } from "react-router-dom";
import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { useEffect, useCallback } from 'react';
import { adminAdress } from "../core/constants";

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

  const { activeAccount, disconnectKeylessAccount, transferNft, getNfts } = useKeylessAccounts();

  useEffect(() => {
    if (!activeAccount) navigate("/");
    else {
      const head = document.querySelector("head");
      const script = document.createElement("script");

      script.setAttribute("src", "./Build/init.js");
      head?.appendChild(script);

      return () => {
        head?.removeChild(script);
      };
    }
  }, [activeAccount, navigate]);

  const handleGameLogin = useCallback(()=>{
    const account = activeAccount?.accountAddress.toString();
    (window as any).unityInstance.SendMessage("MainController", "OnPlatformLoginMsg", JSON.stringify({account:account, token:account}))
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
    <Unity></Unity>
    </>
  );
}

export default HomePage;
