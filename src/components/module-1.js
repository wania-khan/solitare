import React, { useState, useEffect } from "react";
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
import Congrats from '../assets/images/congrats.png';

const cardImages = {
    Ace, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, King, Queen, Jack
};

const cardValues = {
    Ace: 1, Two: 2, Three: 3, Four: 4, Five: 5, Six: 6, Seven: 7, Eight: 8, Nine: 9, Ten: 10,
    Jack: 11, Queen: 12, King: 13
};

const generateDeck = () => {
    const deck = [];
    for (const name of Object.keys(cardImages)) {
        for (let i = 0; i < 8; i++) { 
            deck.push({ name, value: cardValues[name] });
        }
    }
    return deck.sort(() => Math.random() - 0.5);
};

const Card = ({ card, index, stackIndex, onDragStart }) => (
    <img
        src={card.name === "Back" ? Back : cardImages[card.name]}
        alt={card.name}
        className="w-[68px] h-[100px] object-cover"
        draggable={card.name !== "Back"}
        onDragStart={(e) => onDragStart(e, { stackIndex, cardIndex: index })}
        onError={(e) => e.target.src = Back}
    />
);

const CardStack = ({ stack, stackIndex, onDrop, onDragOver, onDragStart }) => (
    <div
        className="relative w-[74px] h-[108px] border-4 border-[#337084] rounded-lg"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, stackIndex)}
    >
        {stack.map((card, index) => (
            <div
                key={index}
                className="absolute"
                style={{ top: `${index * 20}px`, zIndex: index }}
            >
                <Card
                    card={card}
                    index={index}
                    stackIndex={stackIndex}
                    onDragStart={onDragStart}
                />
            </div>
        ))}
    </div>
);

const Module1 = () => {
    const [deck, setDeck] = useState(generateDeck());
    const [cardStacks, setCardStacks] = useState([]);
    const [draggedCard, setDraggedCard] = useState(null);
    const [moves, setMoves] = useState(0);
    const [deals, setDeals] = useState(5);
    const [foundations, setFoundations] = useState(0);
    const [dealDeck, setDealDeck] = useState([]);
    const [cardsRemaining, setCardsRemaining] = useState(
        Object.keys(cardImages).reduce((acc, name) => {
            acc[name] = 8;
            return acc;
        }, {})
    );
    const [completedFoundations, setCompletedFoundations] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [history, setHistory] = useState([]);
    const [showRules, setShowRules] = useState(true);
    const [difficulty, setDifficulty] = useState(null);
    const [timer, setTimer] = useState(15 * 60); // 15 minutes in seconds
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (difficulty) {
            initializeGame(difficulty);
        }
    }, [difficulty]);

    useEffect(() => {
        if (timer === 0) setGameOver(true);
    }, [timer]);

    useEffect(() => {
        let interval;
        if (!isPaused && !gameOver && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isPaused, gameOver]);

    const initializeGame = (selectedDifficulty) => {
        const newDeck = generateDeck();
        const initialStacks = Array(10)
            .fill(null)
            .map((_, i) => {
                const stack = Array(i < 4 ? 5 : 4).fill({ name: "Back" });
                const card = newDeck.pop();
                setCardsRemaining((prev) => ({
                    ...prev,
                    [card.name]: prev[card.name] - 1,
                }));
                stack.push(card);
                return stack;
            });

        const foundationSlots = selectedDifficulty === "Easy" ? 1 : selectedDifficulty === "Medium" ? 2 : 3;

        const newDealDeck = newDeck.slice(0, 50);
        setDealDeck(newDealDeck);
        setDeck(newDeck.slice(50));

        setCardStacks(initialStacks);
        setMoves(0);
        setDeals(5);
        setFoundations(0);
        setCompletedFoundations(Array(foundationSlots).fill(null));
        setGameOver(false);
        setHistory([]);
        setTimer(15 * 60); // Reset the timer
        setIsPaused(false);
        setShowRules(false);
    };

    const saveHistory = () => {
        setHistory(prev => [...prev, { cardStacks, moves, deals, dealDeck, completedFoundations, foundations }]);
    };

    const handleDragStart = (e, { stackIndex, cardIndex }) => {
        const selectedStack = cardStacks[stackIndex];
        const selectedCards = selectedStack.slice(cardIndex);
        const isValidSequence = selectedCards.every((card, index) => {
            if (index === 0) return true;
            return card.value === selectedCards[index - 1].value - 1;
        });

        if (isValidSequence) {
            setDraggedCard({ stackIndex, cardIndex });
        } else {
            e.preventDefault();
        }
    };

    const handleDrop = (e, toStackIndex) => {
        e.preventDefault();
        const fromStackIndex = draggedCard.stackIndex;
        const fromCardIndex = draggedCard.cardIndex;
        const draggedCards = cardStacks[fromStackIndex].slice(fromCardIndex);
        const toStack = cardStacks[toStackIndex];
    
        if (toStack.length === 0 || toStack[toStack.length - 1].name === "Back" || draggedCards[0].value === toStack[toStack.length - 1].value - 1) {
            saveHistory();
            const newStacks = [...cardStacks];
            newStacks[fromStackIndex] = cardStacks[fromStackIndex].slice(0, fromCardIndex);
            newStacks[toStackIndex] = [...toStack, ...draggedCards];
    
            if (newStacks[fromStackIndex].length && newStacks[fromStackIndex][newStacks[fromStackIndex].length - 1].name === "Back") {
                const card = deck.pop();
                setCardsRemaining((prev) => ({
                    ...prev,
                    [card.name]: prev[card.name] - 1,
                }));
                newStacks[fromStackIndex][newStacks[fromStackIndex].length - 1] = card;
            }
    
            const completedSuit = checkForCompletedSuit(newStacks[toStackIndex]);
            if (completedSuit) {
                newStacks[toStackIndex] = newStacks[toStackIndex].slice(0, newStacks[toStackIndex].length - 13);
                setFoundations(prev => prev + 1);
                setCompletedFoundations(prev => {
                    const updated = [...prev];
                    updated[foundations] = Ace;
                    return updated;
                });
    
                // Update to check for game completion
                const totalFoundationsNeeded = difficulty === "Easy" ? 1 : difficulty === "Medium" ? 2 : 3;
                if (foundations + 1 >= totalFoundationsNeeded) {
                    setGameOver(true);
                }
            }
    
            setCardStacks(newStacks);
            setMoves(prev => prev + 1);
            setDraggedCard(null);
        }
    };    

    const dealCards = () => {
        if (deals > 0 && dealDeck.length >= 10) {
            saveHistory();
            const newStacks = [...cardStacks];
            newStacks.forEach((stack) => {
                const card = dealDeck.pop();
                setCardsRemaining((prev) => ({
                    ...prev,
                    [card.name]: prev[card.name] - 1,
                }));
                stack.push(card);
            });
            setCardStacks(newStacks);
            setDealDeck([...dealDeck]);
            setDeals(prev => prev - 1);
        }
    };

    const checkForCompletedSuit = (stack) => {
        if (stack.length < 13) return false;
        const last13 = stack.slice(-13);
        return last13.every((card, i) => card.value === 13 - i);
    };

    const undoMove = () => {
        if (history.length > 0) {
            const lastState = history.pop();
            setCardStacks(lastState.cardStacks);
            setMoves(lastState.moves);
            setDeals(lastState.deals);
            setDealDeck(lastState.dealDeck);
            setCompletedFoundations(lastState.completedFoundations);
            setFoundations(lastState.foundations);
            setHistory(history);
        }
    };

    const handlePlayAgain = () => {
        setGameOver(false);
        setShowRules(true);
        setDifficulty(null);
    };

    const handlePauseResume = () => {
        setIsPaused(prev => !prev);
    };

    const formatTime = (time) => {
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <>
            {showRules ? (
                <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-black bg-opacity-70 z-50 p-4">
                    <div className="relative p-4 max-h-screen w-[400px] bg-black overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">Spider Solitaire Rules</h2>
                        <ul className="text-[#38bdf8] mb-4">
                            <li><strong>Objective:</strong> Arrange all cards of each suit in descending order from King to Ace to clear them from the tableau.</li>
                            <li><strong>Setup:</strong> Two decks of cards are dealt into 10 columns. Each column contains a mix of face-up and face-down cards.</li>
                            <li><strong>Foundation:</strong> Empty foundation piles at the left side. Complete descending sequences from King to Ace are moved to these piles.</li>
                            <li><strong>Gameplay:</strong>
                                <ul className="ml-4 list-disc">
                                    <li>Move cards within the tableau to create descending sequences of cards of the same suit.</li>
                                    <li>Sequences can be moved as a unit if they are of the same suit.</li>
                                    <li>Any card or sequence can be moved to an empty column.</li>
                                    <li>Deal new cards from the stock pile to the tableau when stuck.</li>
                                </ul>
                            </li>
                            <li><strong>Winning:</strong> Fill all foundation piles with cards of the same suit, arranged from King to Ace.</li>
                        </ul>
                        <div className="flex justify-end">
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4" onClick={() => setShowRules(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            ) : difficulty === null ? (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-80 z-50 p-4">
                    <div className="absolute top-[200px] left-[500px] right-0 bottom-0 bg-black h-[260px] w-[280px] rounded-lg flex flex-col justify-center items-center">
                        <h2 className="text-2xl text-white font-bold mb-4">Select Difficulty</h2>
                        <button className="bg-blue-700 text-white py-2 px-4 rounded-lg mb-2" onClick={() => setDifficulty("Easy")}>
                            Easy
                        </button>
                        <button className="bg-green-600 text-white py-2 px-4 rounded-lg mb-2" onClick={() => setDifficulty("Medium")}>
                            Medium
                        </button>
                        <button className="bg-red-600 text-white py-2 px-4 rounded-lg mb-2" onClick={() => setDifficulty("Hard")}>
                            Hard
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="m-auto flex">
                        <div className="ml-20 flex flex-col justify-center mt-3">
                            <div className="relative mb-2">
                                <img
                                    alt="deal"
                                    className={`cursor-pointer w-[68px] h-24 m-0 border-4 border-white rounded-lg transform transition-transform duration-300 ${deals > 0 ? "hover:scale-95" : "opacity-50 cursor-not-allowed"}`}
                                    src={Back}
                                    onClick={deals > 0 ? dealCards : null}
                                />
                            </div>
                            <div className="inline">
                                <h3 className="text-blue-400 font-bold">
                                    Moves:<span className="text-red-700" id="moves">&nbsp;{moves}</span>
                                </h3>
                            </div>
                            <div className="inline mt-3">
                                <h3 className="text-blue-400 font-bold">
                                    Deals Left:<span className="text-red-700" id="deals">&nbsp;{deals}</span>
                                </h3>
                            </div>
                            <button
                                className={`mt-2 py-3 px-4 border-[1px] w-[70px] rounded-md border-blue-200 text-red-800 ${deals > 0 ? "" : "opacity-50 cursor-not-allowed"}`}
                                onClick={deals > 0 ? dealCards : null}
                            >
                                Deal
                            </button>
                            <button className="mt-2 py-[10px] px-3 w-[74px] rounded-md bg-blue-600 text-white font-semibold" onClick={() => initializeGame(difficulty)}>
                                Reset
                            </button>
                            <button className="mt-2 py-[10px] px-3 w-[74px] rounded-md bg-blue-600 text-white font-semibold" onClick={undoMove}>
                                Undo
                            </button>
                            <div className="flex mt-4 space-x-4">
                                {completedFoundations.map((card, index) => (
                                    <div key={index} className="bg-white w-20 h-[100px] rounded-lg relative">
                                        {card && (
                                            <img
                                                src={card}
                                                alt={`foundation-${index}`}
                                                className="w-20 h-[98px] object-cover"
                                            />
                                        )}
                                        <p className="absolute text-xs text-gray-800 mt-10 ml-[6px]">Foundation</p>
                                    </div>
                                ))}
                            </div>
                            <div className="inline">
                                <h3 className="text-blue-400 font-semibold text-xs mt-3">
                                    Foundation Filled:<span id="filled">&nbsp;{foundations}</span>
                                </h3>
                            </div>
                        </div>
                        <div className="flex ml-[30px]">
                            <div className="relative mt-3 flex space-x-4">
                                {cardStacks.map((stack, index) => (
                                    <CardStack
                                        key={index}
                                        stack={stack}
                                        stackIndex={index}
                                        onDragStart={handleDragStart}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDrop}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex mb-2 justify-between items-end -mt-36">
                        <div></div>
                        <div className="flex flex-col justify-center items-center bg-black w-[130px] h-[140px] border-4 border-[#337084] rounded-lg mx-2">
                            <h1 className="text-white text-lg" id="timer">{formatTime(timer)}</h1>
                            <button className="text-orange-700 italic text-lg mt-1" onClick={handlePauseResume}>{isPaused ? "Resume" : "Pause"}</button>
                        </div>
                        <div className="w-[170px] h-[240px] bg-black rounded-lg mr-3">
                            <img src={Favicon} alt="error_favicon" className="w-full h-full object-contain" />
                        </div>
                    </div>
                    {gameOver && (
                        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50">
                            <img src={Congrats} alt="Congrats" className="w-[780px] h-[300px]" />
                            <div className="flex flex-col -mt-6">
                                <h2 className="text-4xl font-bold text-black">You Won!</h2>
                                <p className="text-lg text-black mt-4 font-bold">Total Moves: <span className="text-lg text-red-700">&nbsp;{moves}</span></p>
                                <button 
                                    className="mt-4 py-2 px-6 bg-blue-600 text-white text-xl rounded-lg" 
                                    onClick={handlePlayAgain}
                                >
                                    Play Again
                                </button>
                            </div>
                        </div>
                    )}
                    {isPaused && (
                        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-black bg-opacity-80 z-50">
                            <h1 className="text-white text-4xl font-bold">Game Paused</h1>
                            <button 
                                className="mt-8 py-2 px-6 text-orange-700 italic text-xl rounded-lg" 
                                onClick={handlePauseResume}
                            >
                                Resume
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Module1;