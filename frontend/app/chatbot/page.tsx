"use client";  // Ensure the component is a Client Component

import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";  // Import FontAwesome paper plane icon
import { getAnswer } from "./chat_response"; // Import the getAnswer function

// Define a type for messages
type Message = {
    type: "user" | "bot";
    text: string;
};

function ChatbotPage() {
    // State to manage the chat messages with explicit type
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");

    // Handler to send a message
    const sendMessage = async () => {
        if (inputMessage.trim() !== "") {
            // Append user message to the chat
            const userMessage: Message = { type: "user", text: inputMessage };
            setMessages((prevMessages) => [...prevMessages, userMessage]);

            // Clear input field
            setInputMessage("");

            // Fetch the bot's response using getAnswer
            try {
                const botResponseText = await getAnswer(inputMessage);
                const botResponse: Message = { type: "bot", text: botResponseText };
                setMessages((prevMessages) => [...prevMessages, botResponse]);
            } catch (error) {
                // Handle error (optional)
                console.error('Error fetching bot response:', error);
                const errorMessage: Message = { type: "bot", text: "Sorry, I couldn't get an answer at the moment." };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
            }
        }
    };

    // Handler for pressing enter key
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
                /* Custom Scrollbar Styles */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px; /* Adjust width */
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent; /* Transparent track */
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.5); /* Semi-transparent thumb */
                    border-radius: 10px; /* Rounded edges */
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.7); /* Darker on hover */
                }

                .custom-scrollbar {
                    scrollbar-width: thin; /* Firefox */
                    scrollbar-color: rgba(48, 48, 72, 0.5) transparent; /* Firefox */
                }

                .custom-scrollbar:hover {
                    scrollbar-color: rgba(48, 48, 72, 0.7) transparent; /* Darker on hover for Firefox */
                }
            `}</style>
        </div>
    );
}

export default ChatbotPage;
