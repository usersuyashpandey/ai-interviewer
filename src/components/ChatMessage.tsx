import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatMessageProps {
  message: {
    role: 'assistant' | 'user';
    content: string;
  };
  isLast?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast }) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex w-full my-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={cn(
        'flex max-w-[80%] md:max-w-[70%]',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}>
        <div className={cn(
          'flex items-center justify-center h-8 w-8 rounded-full shrink-0',
          isUser ? 'bg-blue-100 ml-3' : 'bg-teal-100 mr-3'
        )}>
          {isUser ? <User size={18} className="text-blue-600" /> : <Bot size={18} className="text-teal-600" />}
        </div>
        
        <div className={cn(
          'px-4 py-3 rounded-lg',
          isUser ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-800',
          isLast && !isUser && 'animate-pulse'
        )}>
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;