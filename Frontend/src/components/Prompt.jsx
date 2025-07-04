import { ArrowUp, Bot, Globe, Paperclip } from "lucide-react";
import logo from "../assets/logo.png";
import remarkGfm from "remark-gfm"
import React, { useEffect, useRef, useState } from "react";
import { tomorrow as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";


const Prompt = () => {
  const [inputValue, setInputValue] = useState("");
  const [Typemessage, setTypeMessage] = useState("");

  const [prompt, setprompt] = useState([]); // fixed

  const [loading, setloading] = useState(false);

  const promtEndRef = useRef();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const storedPromt = localStorage.getItem(`promtHistory_${user._id}`);
      if (storedPromt) {
        setprompt(JSON.parse(storedPromt));
      }
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem(`promtHistory_${user._id}`, JSON.stringify(prompt));
    }
  }, [prompt]);

  useEffect(() => {
    promtEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prompt, loading]);
  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setInputValue("");
    setTypeMessage(trimmed);
    setloading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/deepseakai/prompt",
        {
          content: trimmed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setprompt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
       console.error("API Error:", error);
      setprompt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: "❌ Something went wrong the AI response" },
      ]);
    } finally {
      setloading(false);
      setTypeMessage(null);
    }
  };

  const handlekeydown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="max-h-[100vh] flex flex-col items-center justify-between flex-1 w-full px-4 pb-4 md:pb-8">
      <div className="mt-8 md:mt-16 text-center">
        <div className="flex items-center justify-center gap-2">
          <img src={logo} alt="DeepSeek Logo" className="h-6 md:h-8" />
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            Hi, I'm DeepSeek.
          </h1>
        </div>
        <p className="text-gray-400 text-base md:text-sm mt-2">
          💬 How can I help you today?
        </p>
      </div>
      {/*Prompt */}

<div className="w-full max-w-4xl flex-1 overflow-y-auto mt-6 mb-4 space-y-4 max-h-[60vh] px-1 hide-scrollbar">
        {prompt.map((msg, index) => (
          <div
            key={index}
            className={`w-full flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" ? (
              // 🧠 Full-width assistant response
              <div className="w-full bg-[#232323] text-white rounded-xl px-4 py-3 text-sm whitespace-pre-wrap">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node , inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={codeTheme}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg mt-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-800 px-1 py-0.5 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ) : (
              // 👤 User message - 30% width at top-right
              <div className="w-[30%] bg-blue-600 text-white rounded-xl px-4 py-3 text-sm whitespace-pre-wrap self-start">
                {msg.content}
              </div>
            )}
          </div>
        ))}
                {/* Show user's prompt while loading */}
        {loading && Typemessage && (
          <div
            className="whitespace-pre-wrap px-4 py-3 rounded-2xl text-sm break-words
           bg-blue-600 text-white self-end ml-auto max-w-[40%]"
          >
            {Typemessage}
          </div>
        )}

        {/* 🤖 Typing Indicator */}
        {loading && (
          <div className="flex justify-start w-full">
            <div className="bg-[#2f2f2f] text-white px-4 py-3 rounded-xl text-sm animate-pulse">
              🤖Loading...
            </div>
          </div>
        )}

        <div ref={promtEndRef} />
      </div>

      {/*Input box*/}
      <div className="w-full max-w-4xl relative mt-auto">
        <div className="bg-[#2f2f2f] rounded-[2rem] px-4 md:px-6 py-6 md:py-8 shadow-md">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handlekeydown}
            placeholder="💬 Message DeepSeek"
            className="bg-transparent w-full text-white placeholder-gray-400 text-base md:text-lg outline-none"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
            {/* 🛠️ Functional Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button className="flex items-center gap-2 border border-gray-500 text-white text-sm md:text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition">
                <Bot className="w-4 h-4" />
                DeepThink (R1)
              </button>
              <button className="flex items-center gap-2 border border-gray-500 text-white text-sm md:text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition">
                <Globe className="w-4 h-4" />
                Search
              </button>
            </div>

            {/* ➤ Send Button */}
            <div className="flex items-center gap-2 ml-auto">
              <button className="text-gray-400 hover:text-white transition">
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                className="bg-gray-500 hover:bg-blue-600 p-2 rounded-full text-white transition"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
