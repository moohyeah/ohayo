import { useState, useEffect} from "react";
import {
  GAME_WASM_PATH,
  GAME_LOADER_PATH,
  GAME_DATA_PATH,
  GAME_FRAMEWORK_PATH,
  postJson,
} from "../core/constants";

const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const queryParams: { [key: string]: string } = {};
  
  for (const [key, value] of params.entries()) {
    queryParams[key] = value;
  }
  
  return queryParams;
};

const toLogin = ()=> {
  window.location.href = "https://app.debox.pro/oauth/authorize/?app_id=ShATk8B1VYKHrzx3&grant_type=authorization_code&scope=payment&response_type=code&pay_info=loginTest&redirect_uri=https://skywarriors.pro/";
}

function HomePage() {
  const [account, setAccount] = useState<any>(0);

  const loginAccount = async (params: any)=> {
    const response = await postJson("/api/login", params);
    return response;
  }

  const params = getQueryParams();
  
  useEffect(() => {
    const fetchUser = async () => {
      if (params.code != null && params.user_id != null) {
        const data = await loginAccount(params);
        setAccount(data.user);
      } else {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (data.user) {
          setAccount(data.user);
        }
      }
    };

    fetchUser(); 
  }, []);  

  return (
    <>
      <link
        rel="preload"
        href={GAME_WASM_PATH}
        type="application/wasm"
        as="fetch"
      ></link>
      <link
        rel="preload"
        href={GAME_LOADER_PATH}
        type="text/javascript"
        as="script"
      ></link>
      <link
        rel="preload"
        href={GAME_DATA_PATH}
        type="application/wasm"
        as="fetch"
      ></link>
      <link
        rel="preload"
        href={GAME_FRAMEWORK_PATH}
        type="application/wasm"
        as="fetch"
      ></link>

      <div className="min-h-screen flex flex-col bg-customGray justify-center items-center relative">
        <div className="h-full max-w-full justify-center items-center aspect-[720/1280] absolute top-0" style={{backgroundImage: "url('./bg.png')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'top'}}>
          <a href="javascript:void(0);" className="absolute top-10 left-5"><img src="./rec.png" className=" w-16"/></a>
          <div className="flex flex-col absolute top-12 right-5 bg-buttonBg border-primary rounded-xl text-white border">
            {account ? (
                <button className="custom-border-stretch text-slate-950" id="logout">LOGOUT</button>
              ) : (
                <button className="custom-border-stretch text-slate-950 font-bold" onClick={toLogin}>LOGIN</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
