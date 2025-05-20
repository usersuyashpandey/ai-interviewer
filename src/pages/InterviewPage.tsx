import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, FileCheck, Hourglass } from "lucide-react";
import { useInterviewStore } from "../store/interviewStore";
import ChatMessage from "../components/ChatMessage";
import Button from "../components/Button";

const InterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { interviewId, messages, status, sendMessage, endInterview } =
    useInterviewStore();

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [duration, setDuration] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interviewId && status === "idle") {
      navigate("/upload");
    }

    if (status === "completed") {
      navigate("/feedback");
    }
  }, [interviewId, status, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isInterviewOver = status === "completed";

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping || isInterviewOver) return;

    setInput("");
    setIsTyping(true);
    await sendMessage(input.trim());
    setIsTyping(false);
  };

  const handleEndInterview = async () => {
    await endInterview();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-slate-800">
              AI Interview
            </h1>
            <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center">
              <Hourglass size={14} className="mr-1" />
              <span>{formatDuration(duration)}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEndInterview}
            isLoading={status === "ending"}
            icon={<FileCheck size={18} />}
          >
            End Interview
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto pr-2 pb-4">
          {messages.length > 0 ? (
            <div className="space-y-2">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                  isLast={
                    index === messages.length - 1 &&
                    message.role === "assistant" &&
                    isTyping
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-400">Loading your interview...</p>
            </div>
          )}
          {isInterviewOver && (
            <div className="mt-6 text-center text-blue-700 font-semibold">
              The interview has ended. Thank you!
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 bg-white rounded-lg shadow-md"
        >
          <div className="flex items-end p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                isInterviewOver
                  ? "The interview is over."
                  : "Type your answer here..."
              }
              className="flex-1 resize-none border rounded-md p-3 min-h-[60px] max-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTyping || status === "ending" || isInterviewOver}
            />
            <Button
              type="button"
              className="ml-3"
              onClick={handleSendMessage}
              disabled={
                !input.trim() ||
                isTyping ||
                status === "ending" ||
                isInterviewOver
              }
              icon={<Send size={18} />}
            >
              Send
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default InterviewPage;
