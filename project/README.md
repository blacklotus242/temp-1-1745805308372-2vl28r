# Full-Stack SaaS Platform (Bolt Ready)

This project was built as a full-stack SaaS starter platform.  
It includes:

## Core Features
- User Registration / Login / Forgot Password
- Admin vs User Role-Based Access Control
- OpenAI Chatbot UI
- Notification Center (Toast Messages)
- Stripe Payment Integration (Simulated)
- Google Calendar Integration (Simulated)
- Asana Task Sync (Simulated)
- Gmail Automation (Simulated)
- Personal Profile Management (Custom Settings)

## Setup Instructions
1. Create a `.env` file with your API keys:
```
VITE_OPENAI_API_KEY=your-openai-api-key-here
VITE_GOOGLE_API_KEY=your-google-api-key
VITE_ASANA_API_TOKEN=your-asana-api-token
VITE_GMAIL_API_KEY=your-gmail-api-key
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Notes
- API integrations are currently **simulated** with console logs. Replace them with real API calls to make it production-ready.
- Stripe Checkout flow is simulated. You can replace it with a real Stripe setup easily.

---

Built for Bolt deployment. 🚀