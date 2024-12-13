import { ethers } from "ethers";

let walletConnected = false;
let switchedToBSC = false;
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
        walletConnected = true;
        // requestPermissionsParams();
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
        await (window as any).deboxWallet
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
  // export async function paymentVBox(receiver_address : string, amount : number, donation_amount : number, note : string) {
  //   console.log("testSDK run debox_paymentVBox", receiver_address, amount, donation_amount, note);
  
  //   if (typeof (window as any).deboxWallet !== "undefined") {
  //       if (!walletConnected) {
  //           await connectWallet();
  //       }
  //     if (!receiver_address) {
  //       return;
  //     }
  //     try {
  //       const param = {
  //           receiver_address,
  //           amount : amount.toString(),
  //           note,
  //           donation_amount: donation_amount.toString(),
  //           nonce: new Date().valueOf(),// int 可选
  //       }
  //       console.log("debox_paymentVBox param", param);
  //       const response = await (window as any).deboxWallet.request({
  //         method: "debox_paymentVBox",
  //         params: [
  //           param,
  //         ],
  //       });
  //       console.log("debox_paymentVBox", response, typeof response);
  //       return response;
  //     } catch (error: unknown) {
  //       if (error instanceof Error) {
  //         console.log("paymentVBox err!!");
  //         console.error(error);
  //       }
  //     }
  //   } else {
  //   }
  // }
  

  const BNBChainId = "0x38"; // 0xA is the hexadecimal representation of 10, Optimism chain ID
  const BNBParams = {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18
    },
    blockExplorerUrls: ['https://bscscan.com']
  };
  async function switchToBSC() {
    try {
      // Check if the Ethereum provider (MetaMask) is available
      if ((window as any).deboxWallet) {
        // Request to switch to the Optimism chain
        await (window as any).deboxWallet.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BNBChainId }],
        });
        console.log("Successfully switched to BSC!");
        switchedToBSC = true;
      } else {
        alert("Ethereum provider (MetaMask) is not available.");
      }
    } catch (error : any) {
      // If the chain is not available in MetaMask, prompt the user to add it
      if (error.code === 4902) {
        try {
          await (window as any).deboxWallet.request({
            method: "wallet_addEthereumChain",
            params: [BNBParams],
          });
          console.log("BSC chain added and switched successfully!");
          switchedToBSC = true;
        } catch (addError) {
          console.error("Error adding BSC chain:", addError);
        }
      } else {
        console.error("Error switching to BSC chain:", error);
      }
    }
  }

const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // BSC上的USDT地址
const erc20Abi = [
    {
        "constant": false,
        "inputs": [
            { "name": "_spender", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "name": "", "type": "bool" }],
        "type": "function"
    },
    {
      "constant": true,
      "inputs": [{ "name": "owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [{"name": "", "type": "uint8"}],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
];

// 合约地址和 ABI
const contractAddress = "0x2eCDf7198Db3e5FD19Fb1ed9B09C54B26aB13C70"; // zs: 0x4623CD0ED546e047111a39697f80166c311E21Be cs: 0x11dEb3396a6A01A2853Aff40833835C22743760A
const contractABI = [
    {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "playGameAndShareAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    },
];

// 通过 Ethers.js 调用智能合约方法
export async function callContractMethod(amount: number) {
    try {
        // 检查 MetaMask 或其他以太坊钱包是否已连接
        if (typeof (window as any).deboxWallet === "undefined") {
            alert("MetaMask is not installed!");
            return;
        }

        if (!walletConnected) {
            await connectWallet();
        }
        if (!switchedToBSC) {
            await switchToBSC();
        }

        (window as any).ethersProvider = new ethers.providers.Web3Provider((window as any).deboxWallet);
        const signer =  (window as any).ethersProvider.getSigner();

        // 创建合约实例
        const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );
        const usdtContract = new ethers.Contract(usdtAddress, erc20Abi, signer);

        const usdt = ethers.utils.parseUnits((amount).toString(), 18); // 0.001 USDT

        const myAddress = await signer.getAddress()
        const balance = await usdtContract.balanceOf(myAddress);
        const decimals = await usdtContract.decimals();
        const formattedBalance = ethers.utils.formatUnits(balance, decimals);

        if (parseFloat(formattedBalance) < amount) {
          return -1;
        }

        try {

          // 首先授权目标合约可以使用用户的 USDT
          console.log("等待授权交易确认中...");
          const approveTx = await usdtContract.approve(contractAddress, usdt);
          await approveTx.wait();
          console.log("授权完成！");

          const tx = await contract.playGameAndShareAll(usdtAddress, usdt);
          console.log("TX: ", tx);
          // 等待交易被矿工确认
          await tx.wait();
          return tx?.hash;
        } catch (error) {
            console.error("error", error);
        }
    } catch (error) {
        console.error("Error calling contract method:", error);
    }
}