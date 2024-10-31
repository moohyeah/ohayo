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
  const [account, setAccount] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [records, setRecords] = useState([]);

  const loginAccount = async (params: any)=> {
    const response = await postJson("/api/login", params);
    return response;
  }

  const showModal = async ()=> {
    setIsOpen(true)
  }

  const logoutAccount = async ()=> {
    const response = await postJson("/api/logout", null);
    setAccount(null);
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
          <a onClick={showModal} className="absolute top-10 left-5"><img src="./rec.png" className=" w-16"/></a>
          <div className="flex flex-col absolute top-12 right-5 bg-buttonBg border-primary rounded-xl text-white border">
            {account ? (
                <button className="custom-border-stretch text-slate-950" id="logout" onClick={logoutAccount}>LOGOUT</button>
              ) : (
                <button className="custom-border-stretch text-slate-950 font-bold" onClick={toLogin}>LOGIN</button>
            )}
          </div>
          <div className="flex flex-col absolute top-32 h-40 items-center justify-center w-full">
            {account ? (
              <div className="justify-center items-center p-2 w-40 flex flex-wrap">
                <img src='./profile.png' alt="avatar" className="w-20 h-20" />
                <span className="mt-4 text-slate-950 font-bold text-center w-full text-xl">{account.nick}</span><br/>
                <span className="mt-4 text-slate-950 font-bold text-center w-full text-xl">SWP: {account.score}</span>
              </div>
            ) : (
              <img src="./profile.png" alt="default profile" className="w-20 h-20" />
            )}
          </div>
        </div>
        {/* 弹窗 */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={()=> setIsOpen(false)}>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-11/12">
              <h2 className="text-xl font-bold mb-4 text-center">Records</h2>
              {records.length > 0 ? (
                <table className="w-full" id="rec-tabl">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Icon</th>
                      <th className="py-2">Name</th>
                      <th className="py-2">Num</th>
                    </tr>
                  </thead>
                  <tbody>
                  {records.map((record : any) => (
                    <tr className="border-b">
                      <td className="py-2 text-center"><img src={record.icon} className="w-8 h-8 inline-block"/></td>
                      <td className="py-2 text-center">{record.name}</td>
                      <td className="py-2 text-center">{record.num}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-4 text-center text-gray-500">暂无兑换记录</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;
