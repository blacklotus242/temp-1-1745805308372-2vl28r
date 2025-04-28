import { motion } from 'framer-motion';

export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div className={
        "max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg " + 
        (isUser 
          ? 'bg-indigo-600 dark:bg-indigo-700 text-white' 
          : 'bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-200')
      }>
        {content}
      </div>
    </motion.div>
  );
}