import React from "react";
import Back from '../assets/images/cardback.png';
function Module1(){
    return(
        <>
        <div className="m-auto">
        <div className="flex flex-col justify-center mt-3">
        <div className="relative mb-2">
        <div className=""></div>
        <img alt="error_back" className="cursor-pointer w-[68px] h-24 m-0 border-4 border-white rounded-lg transform transition-transform duration-300 hover:scale-95" src={Back}/> 
        </div>
        <div className="inline">
        <h3 className="text-blue-400 font-bold">Moves: </h3>
        </div>
        <div className="inline mt-3">
        <h3 className="text-blue-400 font-bold">Deals Left: </h3>
        </div>
        <button className="mt-2 py-3 px-4 border-[1px] w-[68px] rounded-md border-blue-200 text-red-800">DEAL</button>
        <button className="mt-2 py-[10px] px-3 w-[74px] rounded-md bg-blue-600 text-white font-semibold">Reset</button>
        <button className="mt-2 py-[10px] px-3 w-[74px] rounded-md bg-blue-600 text-white font-semibold">Undo</button>
        <div className="bg-white w-20 h-[98px] rounded-lg mt-4 relative">
         <p className="absolute text-xs text-gray-800 mt-10 ml-[6px]">Foundation</p>
        </div>
        <div className="inline">
        <h3 className="text-blue-400 font-semibold text-xs mt-3">Foundation Filled: </h3>
        </div>
        </div>
        </div>
        </>
    );
}

export default Module1;