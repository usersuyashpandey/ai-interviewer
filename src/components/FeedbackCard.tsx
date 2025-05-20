import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  TrendingUp,
  Lightbulb,
  Briefcase,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

interface FeedbackCardProps {
  feedback: string;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  const sections = parseFeedbackSections(feedback);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b">
        Interview Feedback
      </h2>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <FeedbackSection
            key={index}
            title={section.title}
            content={section.content}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

interface FeedbackSection {
  title: string;
  content: string;
}

const parseFeedbackSections = (feedback: string): FeedbackSection[] => {
  const lines = feedback.split("\n");
  const sections: FeedbackSection[] = [];

  let currentTitle = "";
  let currentContent: string[] = [];

  lines.forEach((line) => {
    if (/^\d+\.\s+[A-Z]/.test(line) || /^[A-Za-z\s]+:$/.test(line)) {
      if (currentTitle && currentContent.length > 0) {
        sections.push({
          title: currentTitle,
          content: currentContent.join("\n"),
        });
      }

      currentTitle = line.replace(/^\d+\.\s+/, "").replace(/:$/, "");
      currentContent = [];
    } else if (line.trim() && currentTitle) {
      currentContent.push(line);
    }
  });

  if (currentTitle && currentContent.length > 0) {
    sections.push({
      title: currentTitle,
      content: currentContent.join("\n"),
    });
  }

  if (sections.length === 0 && feedback.trim()) {
    sections.push({
      title: "Overall Feedback",
      content: feedback,
    });
  }

  return sections;
};

interface FeedbackSectionProps {
  title: string;
  content: string;
  index: number;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  title,
  content,
  index,
}) => {
  const getIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("overall") || lowerTitle.includes("assessment"))
      return <Award className="h-5 w-5 text-orange-500" />;
    if (lowerTitle.includes("strength"))
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (lowerTitle.includes("improve"))
      return <Lightbulb className="h-5 w-5 text-blue-500" />;
    if (lowerTitle.includes("job") || lowerTitle.includes("fit"))
      return <Briefcase className="h-5 w-5 text-purple-500" />;
    if (lowerTitle.includes("communication"))
      return <MessageSquare className="h-5 w-5 text-teal-500" />;
    if (lowerTitle.includes("next") || lowerTitle.includes("steps"))
      return <ArrowRight className="h-5 w-5 text-red-500" />;

    const defaultIcons = [
      <Award className="h-5 w-5 text-orange-500" />,
      <TrendingUp className="h-5 w-5 text-green-500" />,
      <Lightbulb className="h-5 w-5 text-blue-500" />,
      <Briefcase className="h-5 w-5 text-purple-500" />,
      <MessageSquare className="h-5 w-5 text-teal-500" />,
      <ArrowRight className="h-5 w-5 text-red-500" />,
    ];

    return defaultIcons[index % defaultIcons.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-slate-50 rounded-md p-4"
    >
      <div className="flex items-center mb-2">
        <div className="mr-2">{getIcon(title)}</div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <p className="text-slate-600 whitespace-pre-wrap text-sm pl-7">
        {content}
      </p>
    </motion.div>
  );
};

export default FeedbackCard;
