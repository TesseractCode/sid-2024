"use client";

import { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { getAnswer } from "./chat_response";

type Message = {
    type: "user" | "bot";
    text: string;
};

function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(false); // New state for loading

    const sendMessage = async () => {
        if (inputMessage.trim() !== "") {
            const userMessage: Message = { type: "user", text: inputMessage };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setInputMessage("");
            setLoading(true); // Start loading when bot response is pending

            try {
                const botResponseText = await getAnswer(inputMessage);
                const botResponse: Message = { type: "bot", text: botResponseText };
                setMessages((prevMessages) => [...prevMessages, botResponse]);
            } catch (error) {
                console.error('Error fetching bot response:', error);
                const errorMessage: Message = { type: "bot", text: "Sorry, I couldn't get an answer at the moment." };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
            } finally {
                setLoading(false); // Stop loading when bot response is complete
            }
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="chatbot-page flex flex-col justify-between h-screen w-full p-4">
            <div className="chat-container w-full max-w-2xl mx-auto bg-transparent mt-10">
                <div className="chat-box p-4 h-96 overflow-y-auto bg-transparent rounded-lg shadow-md backdrop-blur-md custom-scrollbar">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500">
                            Start the conversation...
                        </div>
                    )}
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`my-2 p-2 max-w-sm break-words rounded-2xl ${
                                message.type === "user"
                                    ? "bg-slate-700 text-white text-right ml-auto"
                                    : "bg-gray-300 text-black text-left mr-auto"
                            }`}
                        >
                            {message.text}
                        </div>
                    ))}
                    {loading && (
                        <div className="bot-typing my-2 p-2 max-w-sm bg-gray-300 text-black text-left mr-auto rounded-2xl flex items-center">
                            <div className="typing-indicator">
                                <span className="dot">.</span>
                                <span className="dot">.</span>
                                <span className="dot">.</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="input-container flex p-4 bg-transparent border-t mt-4">
                    <input
                        type="text"
                        className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none shadow-md text-black"
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        className="ml-2 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-md flex items-center justify-center"
                        onClick={sendMessage}
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </div>

            <footer className="w-full py-4 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} TesseractCode. All Rights Reserved.
            </footer>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.7);
                }
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(48, 48, 72, 0.5) transparent;
                }
                .custom-scrollbar:hover {
                    scrollbar-color: rgba(48, 48, 72, 0.7) transparent;
                }
                /* Typing animation */
                .typing-indicator .dot {
                    display: inline-block;
                    margin-right: 3px;
                    font-size: 24px;
                    line-height: 1;
                    animation: blink 1s infinite alternate;
                }
                .typing-indicator .dot:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .typing-indicator .dot:nth-child(3) {
                    animation-delay: 0.4s;
                }
                @keyframes blink {
                    0% {
                        opacity: 0.3;
                    }
                    100% {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}

export default ChatbotPage;
