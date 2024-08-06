import React from "react";
import Back from '../assets/images/cardback.png';
import Ace from '../assets/images/ace.png';
import Two from '../assets/images/two.png';
import Three from '../assets/images/three.png';
import Four from '../assets/images/four.png';
import Five from '../assets/images/five.png';
import Six from '../assets/images/six.png';
import Seven from '../assets/images/seven.png';
import Eight from '../assets/images/eight.png';
import Nine from '../assets/images/nine.png';
import Ten from '../assets/images/ten.png';
import King from '../assets/images/king.png';
import Queen from '../assets/images/queen.png';
import Jack from '../assets/images/jack.png';
import Favicon from '../assets/images/favicon.png';

const cards = [Ace, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, King, Queen, Jack];

function Module1() {
    const randomCard = () => cards[Math.floor(Math.random() * cards.length)];

    return (
        <>
        <div className="m-auto flex">
            <div className="flex flex-col justify-center mt-3">
                <div className="relative mb-2">
                    <img alt="error_back" className="cursor-pointer w-[68px] h-24 m-0 border-4 border-white rounded-lg transform transition-transform duration-300 hover:scale-95" src={Back} />
                </div>
                <div className="inline">
                    <h3 className="text-blue-400 font-bold">Moves: </h3>
                </div>
                <div className="inline mt-3">
                    <h3 className="text-blue-400 font-bold">Deals Left: </h3>
                </div>
                <button className="mt-2 py-3 px-4 border-[1px] w-[70px] rounded-md border-blue-200 text-red-800">DEAL</button>
                <button className="mt-2 py-[10px] px-3 w-[74px] rounded-md bg-blue-600 text-white font-semibold">Reset</button>
                <button className="mt-2 py-[10px] px-3 w-[74px] rounded-md bg-blue-600 text-white font-semibold">Undo</button>
                <div className="bg-white w-20 h-[98px] rounded-lg mt-4 relative">
                    <p className="absolute text-xs text-gray-800 mt-10 ml-[6px]">Foundation</p>
                </div>
                <div className="inline">
                    <h3 className="text-blue-400 font-semibold text-xs mt-3">Foundation Filled: </h3>
                </div>
            </div>
            <div className="flex ml-[30px]">
                <div className="relative mt-3 flex space-x-4">
                    {[...Array(10)].map((_, sectionIndex) => (
                        <div key={sectionIndex} className="relative">
                            <div className="relative w-[78px] h-[100px] border-4 border-[#337084] rounded-lg"></div>
                            <div className="absolute top-1 left-[4.5px] w-[78px] h-[200px]">
                                {[...Array(4)].map((_, index) => (
                                    <div key={index} className="absolute w-[68px] h-[100px]" style={{ top: `${index * 20}px`, zIndex: index }}>
                                        <img src={Back} alt="error_back" className='w-[68px] h-[100px]' />
                                    </div>
                                ))}
                                <div className="absolute w-[64px] h-[100px]" style={{ top: '80px', zIndex: 4 }}>
                                    <img src={randomCard()} alt="error_front" className="w-[64px] h-[100px] object-scale-down" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <br></br>
            </div>
        </div>
        <div className="flex mr-4 mb-2 justify-end items-end -mt-[140px]">
            <div className="flex flex-col justify-center items-center bg-black w-[130px] h-[140px] border-4 border-[#337084] rounded-lg mx-2">
                <h1 className="text-white text-lg">dfd</h1>
                <button className="text-orange-700 italic text-lg mt-1">Pause</button>
            </div>
            <div className="w-[170px] h-[240px] bg-black rounded-lg ml-[390px]">
                <img src={Favicon} alt="error_favicon" className="w-full h-full object-contain" />
            </div>
        </div>
        </>
    );
}

export default Module1;