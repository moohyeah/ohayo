import { ethers } from "ethers";

let walletConnected = false;

// test the availability of deboxWallet
if (typeof (window as any).deboxWallet !== "undefined") {
    (window as any).ethersProvider = new ethers.providers.Web3Provider((window as any).deboxWallet);
    console.log("deboxWallet is available");
  } else {
    console.error("deboxWallet is not installed!");
  }
  console.log("(window as any).ethersProvider ethers provider:", (window as any).ethersProvider);
  
  // eth_requestAccounts
  export async function connectWallet() {
    console.log("(window as any).deboxWallet", (window as any).deboxWallet);
    if (typeof (window as any).deboxWallet !== "undefined") {
      try {
        const accounts = await (window as any).deboxWallet.request({
          method: "eth_requestAccounts",
        });
  
        console.log("eth_requestAccounts: ", accounts, typeof accounts);
        requestPermissionsParams();
      } catch (error) {
        // Handle error (e.g., user denied account access)
      }
    } else {
      // If no wallet is installed
    }
  }
  
  // requestPermissionsParams
  export async function requestPermissionsParams() {
    console.log("testSDK run wallet_requestPermissions");
    if (typeof (window as any).deboxWallet !== "undefined") {
      try {
        const response = await (window as any).deboxWallet
          .request({
            method: "wallet_requestPermissions",
            params: [
              {
                eth_accounts: {
                  debox_getUserInfo: {},
                  debox_getVBoxBalance: {},
                },
              },
            ],
          });
        walletConnected = true;
          
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("requestPermissionsParams err!!");
          console.error(error);
        }
      }
    } else {
      // If no wallet is installed
    }
  }
  
  // debox_getUserInfo
  export  async function getUserInfo() {
    console.log("testSDK run debox_getUserInfo");
  
    (window as any).deboxWallet
      .request({
        method: "debox_getUserInfo",
        params: [],
      })
      .then((response : any) => {
        console.log("debox_getUserInfo", response, typeof response);
        if (response) {
        }
      })
      .catch((error : Error) => {
        console.error(error);
        alert(error.message);
      });
  }
  
  // debox_getVBoxBalance
  export async function getVBoxBalance() {
    console.log("testSDK run debox_getVBoxBalance");
    if (!walletConnected) {
        await connectWallet()
    }
    const response = await (window as any).deboxWallet
      .request({
        method: "debox_getVBoxBalance",
        params: [],
    })
    return response?.usable_balance
  }
  
  // debox_paymentVBox
  export async function paymentVBox(receiver_address : string, amount : number, donation_amount : number, note : string) {
    console.log("testSDK run debox_paymentVBox", receiver_address, amount, donation_amount, note);
  
    if (typeof (window as any).deboxWallet !== "undefined") {
        if (!walletConnected) {
            await connectWallet();
        }
      if (!receiver_address) {
        return;
      }
      try {
        const param = {
            receiver_address,
            amount,
            note,
            donation_amount,
        }
        console.log("debox_paymentVBox param", param);
        const response = await (window as any).deboxWallet.request({
          method: "debox_paymentVBox",
          params: [
            param,
          ],
        });
        console.log("debox_paymentVBox", response, typeof response);
        return response;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("paymentVBox err!!");
          console.error(error);
        }
      }
    } else {
    }
  }
  