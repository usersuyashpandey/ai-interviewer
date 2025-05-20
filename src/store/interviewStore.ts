import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { extractTextFromFile, generateId } from "../lib/utils";
import {
  generateInitialQuestion,
  generateFollowUpQuestion,
  generateInterviewFeedback,
} from "../lib/openai";

interface InterviewState {
  interviewId: string | null;
  resumeFile: File | null;
  resumeText: string;
  jobDescriptionText: string;
  messages: { role: "assistant" | "user"; content: string }[];
  status:
    | "idle"
    | "uploading"
    | "starting"
    | "in_progress"
    | "ending"
    | "completed";
  feedback: string | null;

  errors: {
    resume?: string;
    jobDescription?: string;
  };

  setResumeFile: (file: File | null) => void;
  setJobDescriptionText: (text: string) => void;
  validateForm: () => boolean;
  startInterview: () => Promise<boolean>;
  sendMessage: (content: string) => Promise<void>;
  endInterview: () => Promise<void>;
  resetInterview: () => void;
}

const sanitizeText = (text: string): string => {
  return text.replace(/\u0000/g, "").replace(/[\uFFFD\uFFFE\uFFFF]/g, "");
};

export const useInterviewStore = create<InterviewState>((set, get) => ({
  interviewId: null,
  resumeFile: null,
  resumeText: "",
  jobDescriptionText: "",
  messages: [],
  status: "idle",
  feedback: null,
  errors: {},

  setResumeFile: async (file) => {
    set({ resumeFile: file, errors: { ...get().errors, resume: undefined } });

    if (file) {
      try {
        const text = await extractTextFromFile(file);
        set({ resumeText: sanitizeText(text) });
      } catch (error) {
        console.error("Error extracting text from resume:", error);
        set({
          errors: {
            ...get().errors,
            resume:
              "Could not read file contents. Please try a different file.",
          },
        });
      }
    } else {
      set({ resumeText: "" });
    }
  },

  setJobDescriptionText: (text) => {
    set({
      jobDescriptionText: sanitizeText(text),
      errors: { ...get().errors, jobDescription: undefined },
    });
  },

  validateForm: () => {
    const { resumeText, jobDescriptionText } = get();
    const errors: { resume?: string; jobDescription?: string } = {};

    if (!resumeText) {
      errors.resume = "Please upload your resume";
    }

    if (!jobDescriptionText) {
      errors.jobDescription = "Please enter the job description";
    }

    set({ errors });
    return Object.keys(errors).length === 0;
  },

  startInterview: async () => {
    const { resumeText, jobDescriptionText, validateForm } = get();

    if (!validateForm()) {
      return false;
    }

    try {
      set({ status: "starting" });

      const firstQuestion = await generateInitialQuestion(
        resumeText,
        jobDescriptionText
      );

      const interviewId = generateId();

      const { error: saveError } = await supabase.from("interviews").insert({
        id: interviewId,
        title: "Interview Session",
        content: "Interview in progress",
        resume_text: sanitizeText(resumeText),
        job_description: sanitizeText(jobDescriptionText),
        status: "in_progress",
      });

      if (saveError) {
        throw new Error(`Failed to save interview: ${saveError.message}`);
      }

      const { error: messageError } = await supabase.from("messages").insert({
        interview_id: interviewId,
        role: "assistant",
        content: firstQuestion,
      });

      if (messageError) {
        throw new Error(`Failed to save message: ${messageError.message}`);
      }

      set({
        interviewId,
        messages: [{ role: "assistant", content: firstQuestion }],
        status: "in_progress",
      });

      return true;
    } catch (error) {
      console.error("Error starting interview:", error);
      set({ status: "idle" });
      return false;
    }
  },

  sendMessage: async (content) => {
    const {
      interviewId,
      messages,
      resumeText,
      jobDescriptionText,
      endInterview,
    } = get();

    if (!interviewId) return;

    const assistantQuestionsCount = messages.filter(
      (msg) => msg.role === "assistant"
    ).length;

    if (assistantQuestionsCount >= 10) {
      await endInterview();
      return;
    }

    const updatedMessages = [...messages, { role: "user" as "user", content }];

    set({ messages: updatedMessages });

    try {
      await supabase.from("messages").insert({
        interview_id: interviewId,
        role: "user",
        content: sanitizeText(content),
      });

      const aiResponse = await generateFollowUpQuestion(
        resumeText,
        jobDescriptionText,
        updatedMessages
      );

      const finalMessages: { role: "assistant" | "user"; content: string }[] = [
        ...updatedMessages,
        { role: "assistant" as "assistant", content: aiResponse },
      ];

      set({ messages: finalMessages });

      await supabase.from("messages").insert({
        interview_id: interviewId,
        role: "assistant",
        content: sanitizeText(aiResponse),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  endInterview: async () => {
    const { interviewId, messages, resumeText, jobDescriptionText } = get();

    if (!interviewId) return;

    try {
      set({ status: "ending" });

      const feedbackContent = await generateInterviewFeedback(
        // resumeText,
        // jobDescriptionText,
        messages
      );

      await supabase
        .from("interviews")
        .update({
          status: "completed",
          feedback: sanitizeText(feedbackContent),
        })
        .eq("id", interviewId);

      set({
        status: "completed",
        feedback: feedbackContent,
      });
    } catch (error) {
      console.error("Error ending interview:", error);
      set({ status: "in_progress" });
    }
  },

  resetInterview: () => {
    set({
      interviewId: null,
      resumeFile: null,
      resumeText: "",
      jobDescriptionText: "",
      messages: [],
      status: "idle",
      feedback: null,
      errors: {},
    });
  },
}));
