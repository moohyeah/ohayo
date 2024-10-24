import { useState } from "react";

const Tabs = () => {
  // 定义当前激活的 tab，默认是第一个
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Tabs Header */}
      <div className="relative left-32 flex items-center border-gray-300">
        <button
          className={`tab-link px-4 py-2 ${
            activeTab === "tab1" ? "active-tab text-blue-500" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("tab1")}
        >
          Kagura
        </button>
        <span className="text-gray-300">|</span>
        <button
          className={`tab-link px-4 py-2 ${
            activeTab === "tab2" ? "active-tab text-blue-500" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("tab2")}
        >
          Luca
        </button>
        <span className="text-gray-300">|</span>
        <button
          className={`tab-link px-4 py-2 ${
            activeTab === "tab3" ? "active-tab text-blue-500" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("tab3")}
        >
          Mikoto
        </button>
      </div>

      <div className=" relative items-center justify-center flex mt-4">
        {activeTab === "tab1" && (
          <div id="tab1" className="tab-panel relative">
            <img src="./kagura.png" className="h-auto"></img>
            <div className="text-slate-800 absolute bottom-3 sm:bottom-6 w-1/2 left-4 h-18 text-xs sm:text-sm line-clamp-4">
            Kagura is a shrine maiden who dances to greet and send off gods at the Divine Dance Ceremonies. As a medium for the gods, she was raised in a place far from the crowd since childhood, so she has no idea how to socialize with others.
            </div>
          </div>
        )}
        {activeTab === "tab2" && (
          <div id="tab2" className="tab-panel relative">
            <img src="./luca.png" className="h-auto"></img>
            <div className="text-slate-800 absolute bottom-3 sm:bottom-6 w-1/2 left-4 h-18 text-xs sm:text-sm line-clamp-4">Born in a village far from the city, she grew up bathed in the love of her gentle parents. Since there are no children of her age in the countryside, she is not good at conversing with others. </div>
          </div>
        )}
        {activeTab === "tab3" && (
          <div id="tab3" className="tab-panel relative">
            <img src="./mikoto.png" className="h-auto"></img>
            <div className="text-slate-800 absolute bottom-3 sm:bottom-6 w-1/2 left-4 h-18 text-xs sm:text-sm line-clamp-4">Mikoto is a girl who acts as both priest and miko in a harvest shrine. The shrine attracts an endless stream of pilgrims with ever-growing offerings. Mikoto, therefore, gets quite busy, and she would sleep in the shrine whenever she gets time. </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
