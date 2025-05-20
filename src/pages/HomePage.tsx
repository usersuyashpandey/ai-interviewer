import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Users, MessageCircle, Award } from "lucide-react";
import Button from "../components/Button";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users size={24} className="text-blue-500" />,
      title: "AI-Powered Interviews",
      description:
        "Practice with our intelligent AI interviewer that adapts questions based on your resume and job description.",
    },
    {
      icon: <Briefcase size={24} className="text-teal-500" />,
      title: "Job-Specific Questions",
      description:
        "Get asked relevant questions tailored to the specific job youre applying for.",
    },
    {
      icon: <MessageCircle size={24} className="text-orange-500" />,
      title: "Real-time Conversation",
      description:
        "Experience a natural interview flow with follow-up questions based on your responses.",
    },
    {
      icon: <Award size={24} className="text-purple-500" />,
      title: "Comprehensive Feedback",
      description:
        "Receive detailed feedback on your performance to help you improve for real interviews.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-slate-800">
              AI Interviewer
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Prepare for Your Next Interview
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Upload your resume, provide a job description, and practice with
              our AI interviewer to receive personalized feedback.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/upload")}
              className="w-full sm:w-auto"
            >
              Start Your Interview
            </Button>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-slate-100 rounded-lg mr-3">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {feature.title}
                </h3>
              </div>
              <p className="text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </section>

        <section className="mt-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center"
          >
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              Ready to improve your interview skills?
            </h3>
            <p className="text-blue-700 mb-4">
              Start practicing now and receive professional feedback to help you
              land your dream job.
            </p>
            <Button onClick={() => navigate("/upload")}>Begin Interview</Button>
          </motion.div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-slate-200">
        <div className="text-center text-slate-500 text-sm">
          <p>© 2025 AI Interviewer. All rights reserved.</p>
          <p className="mt-1">
            This application is for practice purposes only and is not a
            substitute for professional career advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
