import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Upload } from "lucide-react";
import { useInterviewStore } from "../store/interviewStore";
import FileUpload from "../components/FileUpload";
import TextArea from "../components/TextArea";
import Button from "../components/Button";

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    resumeFile,
    jobDescriptionText,
    errors,
    status,
    setResumeFile,
    setJobDescriptionText,
    startInterview,
  } = useInterviewStore();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await startInterview();
    setIsLoading(false);

    if (success) {
      navigate("/interview");
    }
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
            <span className="ml-1">Back</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Let's Set Up Your Interview
            </h1>
            <p className="text-slate-600">
              Upload your resume and enter the job description to start your
              personalized interview.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FileUpload
              label="Upload Your Resume"
              onFileChange={setResumeFile}
              value={resumeFile}
              error={errors.resume}
            />

            <TextArea
              label="Enter Job Description"
              placeholder="Paste the full job description here..."
              value={jobDescriptionText}
              onChange={(e) => setJobDescriptionText(e.target.value)}
              error={errors.jobDescription}
              className="min-h-[200px]"
            />

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading || status === "starting"}
                icon={<Upload size={18} />}
              >
                Start Interview
              </Button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4"
        >
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Tips for better results:
          </h3>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>
              Upload a current, detailed resume in PDF, DOC, or TXT format
            </li>
            <li>
              Include the complete job description with responsibilities and
              requirements
            </li>
            <li>
              The more detailed the information, the more tailored your
              interview will be
            </li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
};

export default UploadPage;
