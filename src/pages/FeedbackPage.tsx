import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { useInterviewStore } from "../store/interviewStore";
import FeedbackCard from "../components/FeedbackCard";
import Button from "../components/Button";

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { feedback, messages, resetInterview } = useInterviewStore();

  React.useEffect(() => {
    if (!feedback) {
      navigate("/");
    }
  }, [feedback, navigate]);

  const handleStartNew = () => {
    resetInterview();
    navigate("/upload");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="ml-1">Home</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold text-slate-800 mb-3">
              Interview Complete
            </h1>
            <p className="text-slate-600 max-w-lg mx-auto">
              Here's your personalized feedback based on your interview
              responses.
            </p>
          </motion.div>

          {feedback && <FeedbackCard feedback={feedback} />}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Button onClick={handleStartNew} icon={<RefreshCw size={18} />}>
              Start a New Interview
            </Button>
          </motion.div>

          {messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-12 bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Interview Transcript
              </h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className="pb-3 border-b border-slate-100 last:border-b-0"
                  >
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      {message.role === "assistant" ? "Interviewer" : "You"}:
                    </p>
                    <p className="text-slate-600 whitespace-pre-wrap text-sm">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FeedbackPage;
