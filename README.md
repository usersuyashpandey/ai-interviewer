# AI Interviewer

A mini version of an AI interviewer that conducts interviews based on a user's resume, responses, and job description, then generates feedback on their performance.

## Features

- Upload resume and job description
- Interactive chat interface with AI interviewer
- AI-generated questions based on resume and job description
- Comprehensive feedback after the interview
- Complete interview transcript storage

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Framer Motion
- AI: DeepInfra
- Database: Supabase
- State Management: Zustand

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```
4. Set up your Supabase database using the following SQL:

```sql
-- Create interviews table
CREATE TABLE interviews (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT NOT NULL,
  job_description TEXT NOT NULL,
  resume_text TEXT NOT NULL,
  status TEXT DEFAULT 'in_progress',
  feedback JSONB
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  interview_id UUID REFERENCES interviews(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Anyone can insert interviews" ON interviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update their own interviews" ON interviews FOR UPDATE USING (true);
CREATE POLICY "Anyone can select their own interviews" ON interviews FOR SELECT USING (true);

CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can select their own messages" ON messages FOR SELECT USING (true);
```

5. Run the development server: `npm run dev`

## Usage

1. Navigate to the homepage and click "Start Your Interview"
2. Upload your resume and paste the job description
3. Start the interview and respond to the AI interviewer's questions
4. When finished, click "End Interview" to receive feedback
5. Review your performance feedback and interview transcript
