const getProvider = () => {
    if ('starkey' in window) {
      const provider = (window as any).starkey?.supra;
   
      if (provider) {
        return provider;
      }
    }
   
    window.open('https://starkey.app/', '_blank');
};

export const connect = async () => {
    const provider = getProvider(); // see "Detecting the Provider"
    try {
        const accounts = await provider.connect();
        return accounts?.length > 0;
        // 0x534583cd8cE0ac1af4Ce01Ae4f294d52b4Cd305F
    } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
        return false;
    }
};

export const getAccount = async () => {
    const provider = getProvider(); // see "Detecting the Provider"
    const accounts = await provider.account();
    // console.log("accounts", accounts)
    return accounts[0];
};

export const disconnect = async () => {
    const provider = getProvider(); // see "Detecting the Provider"
    await provider.disconnect();
};

export const transacte = async (amount: number) => {
    
    const provider = getProvider(); // see "Detecting the Provider"
    const balance = await provider.balance()
    if (balance.formattedBalance < amount) {
        return -1
    }
    const from_address = await getAccount();
    const transaction = {
        data: "",
        from: from_address,
        to: "0x91c314dfb9272ef5ab7923f39dae7448e39d4f1f722f795bc12184c538acc2f8",
        value: amount * Math.pow(10, balance.decimal),
    };
   
  const txHash = await provider.sendTransaction(transaction);
  console.log("txHash :: ", txHash);
  return txHash;
};