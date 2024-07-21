import React from "react";

const SideBar = () => {
  return (
    <div>
      <div className="flex flex-col py-8 pl-6 pr-2 pt-2 w-64 h-full bg-gray-50 flex-shrink-0 ">
        <div className="flex flex-row items-center justify-center h-12 w-full ">
          <div className="mr-10 font-bold text-2xl">Asssistant GPT</div>
        </div>

        <div className="flex flex-col mt-8">
          <div className="flex flex-col space-y-1 mt-4 -mx-2 h-full overflow-y-auto">
            <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
              <div className="ml-2 text-sm font-semibold">Henry Boyd</div>
            </button>
            <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
              <div className="ml-2 text-sm font-semibold">Marta Curtis</div>
            </button>
            <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
              <div className="ml-2 text-sm font-semibold">Philip Tucker</div>
            </button>
            <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
              <div className="ml-2 text-sm font-semibold">Christine Reid</div>
            </button>
            <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
              <div className="ml-2 text-sm font-semibold">Jerry Guzman</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
