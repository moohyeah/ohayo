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

function formatTimestampToDateTime(timestamp: number) {
  const date = new Date(timestamp);

  // 格式化 MM-dd HH:mm
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${month}-${day} ${hours}:${minutes}`;
}

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
    const response = await fetch("/api/records");
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setRecords(data.list);
    setIsOpen(true);
  }

  const logoutAccount = async ()=> {
    const response = await postJson("/api/logout", null);
    setAccount(null);
    return response;
  }

  const params = getQueryParams();
  function removeParameterFromCurrentURL() {
    const url = new URL(window.location.href);
    url.search = "";
    // 更新地址栏的 URL
    window.history.replaceState({}, document.title, url.toString());
  }
  
  // 示例
  removeParameterFromCurrentURL();
  
  useEffect(() => {
    const fetchUser = async () => {
      if (params.code != null && params.user_id != null) {
        const data = await loginAccount(params);
        setAccount(data.user);
        console.log(data.use);
      } else {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (data.user) {
          setAccount(data.user);
          console.log(data.use);
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
          <a onClick={showModal} className="absolute top-6 left-5"><img src="./rec.png" className=" w-16"/></a>
          <div className="flex flex-col absolute top-8 right-5 bg-buttonBg border-primary rounded-xl text-white border">
            {account ? (
                <button className="custom-border-stretch text-slate-950" id="logout" onClick={logoutAccount}>LOGOUT</button>
              ) : (
                <button className="custom-border-stretch text-slate-950 font-bold" onClick={toLogin}>LOGIN</button>
            )}
          </div>
          <div className="flex flex-col absolute top-20 h-40 items-center justify-center w-full">
            {account ? (
              <div className="justify-center items-center p-2 w-40 flex flex-wrap">
                <img src={`/api/image-proxy?url=${account.avatar}`} alt="avatar" className="w-20 h-20 rounded-full" />
                <span className="mt-2 text-slate-950 font-bold text-center w-full text-xl">{account.nick}</span><br/>
                <span className="mt-2 text-slate-950 font-bold text-center w-full text-xl">SWP: {account.score}</span>
                <span className="mt-2 text-slate-950 font-bold text-center w-full text-xl">Life: {account.life}</span>
              </div>
            ) : (
              <img src="./profile.png" alt="default profile" className="w-20 h-20" />
            )}
          </div>
          <div className="flex flex-col absolute bottom-8 self-center items-center justify-center w-full">
            {account ? (
              <a href="./game" className="items-center justify-center"><img src="./play.png" className=" w-32"/></a>
            ) : (
              <button onClick={toLogin} className="items-center justify-center"><img src="./play.png" className=" w-32"/></button>
            )}
          </div>
        </div>
        {/* 弹窗 */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={()=> setIsOpen(false)}>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-11/12 overflow-y-auto max-h-96 ">
              <h2 className="text-xl font-bold mb-4 text-center">Records</h2>
              {records.length > 0 ? (
                <table className="w-full" id="rec-tabl">
                  <tbody>
                  {records.map((record : any) => (
                    <tr className="border-b">
                      <td className="py-2 text-center">{formatTimestampToDateTime(record.create_time)}</td>
                      <td className="py-2 text-center">{record.item_name || 'vBOX'}</td>
                      <td className="py-2 text-center">{record.item_num / 10}</td>
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
