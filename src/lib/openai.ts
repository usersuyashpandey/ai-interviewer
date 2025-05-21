import { TextGeneration } from "deepinfra";
import { formatHistory, handleGenerationError, sanitizeInput } from "./utils";

const API_KEY = import.meta.env.VITE_DEEPINFRA_API_KEY;
const MODEL_URL =
  "https://api.deepinfra.com/v1/inference/meta-llama/Meta-Llama-3-8B-Instruct";

const client = new TextGeneration(
  MODEL_URL,
  import.meta.env.VITE_DEEPINFRA_API_KEY
);

export interface ConversationMessage {
  role: "assistant" | "user";
  content: string;
}

export async function generateInitialQuestion(
  resumeText: string,
  jobDescription: string
): Promise<string> {
  try {
    if (!API_KEY) throw new Error("API key not configured");

    const Lengthmax = 3000;
    const truncateText = (text: string, max: number) =>
      text.length > max ? text.slice(0, max) + "..." : text;

    const sanitizedResume = truncateText(sanitizeInput(resumeText), Lengthmax);
    const sanitizedJD = truncateText(sanitizeInput(jobDescription), Lengthmax);

    const prompt = `
You are an AI interviewer. Based on the candidate's resume and job description, generate ONE concise, professional interview question. 
**Output ONLY the question, and nothing else. Do NOT include any notes, explanations, or formatting.**

**Resume:**
${sanitizedResume}

**Job Description:**
${sanitizedJD}

Output only the question.
`;

    const estimateTokens = (text: string) => Math.ceil(text.length / 4);
    if (estimateTokens(prompt) > 8191) {
      throw new Error(
        "Input exceeds token limit. Please shorten the resume or job description."
      );
    }

    const body = { input: prompt };
    const output = await client.generate(body);
    const question = output.results[0]?.generated_text.trim();

    const cleanedQuestion = question
      ?.replace(/```[\s\S]*?```/g, "")
      .replace(/[-]+/g, "")
      .replace(/^\s*[-*]\s*/gm, "")
      .replace(/<\|.*?\|>/g, "")
      .trim();

    return cleanedQuestion || "Let's begin. Tell me about yourself.";
  } catch (error: any) {
    handleGenerationError(error);
    return "Let's begin. Tell me about yourself.";
  }
}

export async function generateFollowUpQuestion(
  resumeText: string,
  jobDescription: string,
  conversationHistory: ConversationMessage[]
): Promise<string> {
  try {
    const maxLength = 2500;
    const truncate = (text: string, max: number) =>
      text.length > max ? text.slice(0, max) + "..." : text;

    const sanitizedResume = truncate(sanitizeInput(resumeText), maxLength);
    const sanitizedJD = truncate(sanitizeInput(jobDescription), maxLength);

    const limitedHistory = conversationHistory.slice(-10);

    const historyStr = formatHistory(limitedHistory);

    const prompt = `<|begin_of_text|>
<|start_header_id|>system<|end_header_id|>
You are an AI interviewer conducting a job interview. Ask relevant follow-up questions based on:
- Candidate's resume
- Job description
- Previous responses
Ask one question at a time.
ONLY output the next question, and nothing else.<|eot_id|>
<|start_header_id|>user<|end_header_id|>
Resume: ${sanitizedResume}
Job Description: ${sanitizedJD}
Conversation History: ${historyStr}
Generate your next question:<|eot_id|>`;

    const estimateTokens = (text: string) => Math.ceil(text.length / 4);
    if (estimateTokens(prompt) > 8191) {
      throw new Error("Input exceeds token limit. Please shorten your input.");
    }

    const body = { input: prompt };
    const output = await client.generate(body);
    const question = output.results[0]?.generated_text.trim();
    const cleaned = question
      .replace(/```[\s\S]*?```/g, "")
      .replace(/Note:.*$/is, "")
      .replace(/<\|.*?\|>/g, "")
      .trim();

    const lines = cleaned
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const firstQuestionLine =
      lines.find((line) => line.length > 10 && /[?]$/.test(line)) || lines[0];

    return firstQuestionLine || "Could you elaborate on that experience?";
  } catch (error: any) {
    handleGenerationError(error);
    return "Could you tell me more about your experience?";
  }
}

export async function generateInterviewFeedback(
  conversationHistory: ConversationMessage[]
): Promise<string> {
  try {
    const filteredHistory = conversationHistory.filter(
      (msg) => msg.role === "user" && msg.content.trim().length > 10
    );
    if (filteredHistory.length === 0) {
      return "Not enough information was provided to generate feedback. Please answer the questions in detail.";
    }

    const limitedHistory = filteredHistory.slice(-20);
    const historyStr = formatHistory(limitedHistory);

    const prompt = `
You are an AI interviewer providing structured feedback based ONLY on the candidate's answers during the interview. 
Do NOT use or reference the resume or job description. 
Format as:
1. Overall Assessment
2. Strengths
3. Areas for Improvement
4. Communication Skills
5. Next Steps

Candidate's Answers:
${historyStr}

Provide comprehensive feedback based only on the candidate's answers above.
`;

    const estimateTokens = (text: string) => Math.ceil(text.length / 4);
    if (estimateTokens(prompt) > 8191) {
      throw new Error("Input exceeds token limit. Please shorten your input.");
    }

    const body = { input: prompt };

    const output = await client.generate(body);
    const feedback = output.results[0]?.generated_text.trim();
    return (
      feedback || "Thank you for your time. We'll provide feedback shortly."
    );
  } catch (error: any) {
    handleGenerationError(error);
    return "Thank you for completing the interview. Feedback generation failed.";
  }
}
