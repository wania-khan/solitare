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
        for (let i = 0; i < 8; i++) { // 8 copies of each card (for four decks of one suit)
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
            acc[name] = 8; // 8 copies of each card initially (for four decks)
            return acc;
        }, {})
    );
    const [completedFoundations, setCompletedFoundations] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [history, setHistory] = useState([]); // Track history for undo functionality

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
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

        // Prepare deal deck with 50 cards
        const newDealDeck = newDeck.slice(0, 50);
        setDealDeck(newDealDeck);
        setDeck(newDeck.slice(50)); // Remove 50 cards from the main deck

        setCardStacks(initialStacks);
        setMoves(0);
        setDeals(5);
        setFoundations(0);
        setCompletedFoundations([]);
        setGameOver(false);
        setHistory([]); // Reset history for undo
    };

    const saveHistory = () => {
        setHistory(prev => [...prev, { cardStacks, moves }]);
    };

    const handleDragStart = (e, { stackIndex, cardIndex }) => {
        setDraggedCard({ stackIndex, cardIndex });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, toStackIndex) => {
        e.preventDefault();
        const fromStackIndex = draggedCard.stackIndex;
        const fromCardIndex = draggedCard.cardIndex;
        const draggedCards = cardStacks[fromStackIndex].slice(fromCardIndex);
        const toStack = cardStacks[toStackIndex];

        // Check if the move is valid for a single card or a stack of cards
        if (
            toStack.length === 0 || // Allow move if the target stack is empty
            toStack[toStack.length - 1].name === "Back" ||
            (draggedCards[0].value === toStack[toStack.length - 1].value - 1)
        ) {
            saveHistory(); // Save the current state before making a move
            const newStacks = [...cardStacks];
            newStacks[fromStackIndex] = cardStacks[fromStackIndex].slice(0, fromCardIndex);
            newStacks[toStackIndex] = [...toStack, ...draggedCards];

            // Reveal the card beneath if it exists
            if (
                newStacks[fromStackIndex].length &&
                newStacks[fromStackIndex][newStacks[fromStackIndex].length - 1].name === "Back"
            ) {
                const card = deck.pop();
                setCardsRemaining((prev) => ({
                    ...prev,
                    [card.name]: prev[card.name] - 1,
                }));
                newStacks[fromStackIndex][newStacks[fromStackIndex].length - 1] = card;
            }

            setCardStacks(newStacks);
            setMoves(moves + 1);
            setDraggedCard(null);

            // Check if a suit is completed
            const completedSuit = checkForCompletedSuit(newStacks[toStackIndex]);
            if (completedSuit) {
                newStacks[toStackIndex] = newStacks[toStackIndex].slice(
                    0,
                    newStacks[toStackIndex].length - 13
                );
                setFoundations(foundations + 1);
                setCompletedFoundations([...completedFoundations, King]); // Use the King card
                setCardStacks(newStacks);

                // Check if the game is over
                if (foundations + 1 >= 1) { // 1 or more suits completed
                    setGameOver(true);
                }
            }
        }
    };

    const dealCards = () => {
        if (deals > 0 && dealDeck.length >= 10) {
            saveHistory(); // Save the current state before dealing new cards
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
            setDealDeck([...dealDeck]); // Update the dealDeck with remaining cards
            setDeals(deals - 1);
        }
    };

    const checkForCompletedSuit = (stack) => {
        if (stack.length < 13) return false;
        const last13 = stack.slice(-13);
        return last13.every((card, i) => card.value === 13 - i);
    };

    const undoMove = () => {
        if (history.length > 0) {
            const lastState = history.pop(); // Get the last state from history
            setCardStacks(lastState.cardStacks);
            setMoves(lastState.moves);
            setHistory(history); // Update history without the last state
        }
    };

    return (
        <>
            <div className="m-auto flex">
                <div className="flex flex-col justify-center mt-3">
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
                    <button className="mt-2 py-[10px] px-3 w-[74px] rounded-md bg-blue-600 text-white font-semibold" onClick={initializeGame}>
                        Reset
                    </button>
                    <button className="mt-2 py-[10px] px-3 w-[74px] rounded-md bg-blue-600 text-white font-semibold" onClick={undoMove}>
                        Undo
                    </button>
                    <div className="bg-white w-20 h-[100px] rounded-lg mt-4 relative">
                        {completedFoundations.map((card, index) => (
                            <img
                                key={index}
                                src={card}
                                alt={`foundation-${index}`}
                                className="w-20 h-[98px] object-cover"
                            />
                        ))}
                        <p className="absolute text-xs text-gray-800 mt-10 ml-[6px]">Foundation</p>
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
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex mb-2 justify-between items-end -mt-36">
                <div></div>
                <div className="flex flex-col justify-center items-center bg-black w-[130px] h-[140px] border-4 border-[#337084] rounded-lg mx-2">
                    <h1 className="text-white text-lg" id="timer"></h1>
                    <button className="text-orange-700 italic text-lg mt-1">Pause</button>
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
                    </div>
                </div>
            )}
        </>
    );
};

export default Module1;