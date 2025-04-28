// Simulated database (in-memory)
let users = [];
let chatMessages = [];
let tasks = [];

// Save a new user
export function saveUser(user) {
  users.push(user);
  console.log('User saved:', user);
}

// Save a chat message
export function saveChatMessage(message) {
  chatMessages.push(message);
  console.log('Chat message saved:', message);
}

// Save a task
export function saveTask(task) {
  tasks.push(task);
  console.log('Task saved:', task);
}

// Load chat history for a user
export function loadChatHistory(userId) {
  return chatMessages.filter(msg => msg.userId === userId);
}

// Load user tasks
export function loadTasks(userId) {
  return tasks.filter(task => task.userId === userId);
}