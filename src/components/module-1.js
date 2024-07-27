import React from "react";
import Back from '../assets/images/cardback.png';
function Module1(){
    return(
        <>
        <div className="flex">
        <div className="relative mb-2">
        <div className=""></div>
        <img alt="error_back" className="cursor-pointer w-[68px] h-24 m-0 border-4 border-white rounded-lg transform transition-transform duration-300 hover:scale-95" src={Back}/> 
        </div>

        </div>
        </>
    );
}

export default Module1;