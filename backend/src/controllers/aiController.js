const https = require('https');

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the AI Assistant for DecisionLedger — a smart decision management platform.
Your job is to help users understand and use the app. Be friendly, concise, and accurate.

Here is everything you know about DecisionLedger:

## App Overview
DecisionLedger is a collaborative decision-making platform that helps teams and individuals record, track, vote on, and analyze decisions. Every decision is logged with full history.

## Core Features

### 🏠 Dashboard (/dashboard)
- Shows an overview of all your decisions, recent activity, quick stats (total decisions, pending votes, finalized decisions)
- Quick action buttons to create a new decision or view analytics

### 📋 Decisions (/decisions)
- View all decisions you are part of (as creator or team member)
- Filter by status: Open, Finalized, Archived
- Search decisions by title
- Click any decision to see its full detail

### ➕ Create a Decision (/decisions/new)
- Click "New Decision" from the dashboard or decisions list
- Fill in: Title, Description, Options (choices), Deadline, and optionally assign to a Team
- After creating, team members can vote on the options

### 📄 Decision Detail (/decisions/:id)
- See full details: title, description, all options with vote counts
- Cast your vote by clicking an option
- See voting progress bar and who voted for what
- The creator can "Finalize" the decision once ready
- Blockchain verification badge shows if the decision is recorded on-chain

### 🗳️ My Votes (/votes)
- See every decision you have personally voted on
- Track your voting history with timestamps

### 📅 Timeline (/timeline)
- Chronological view of all decisions
- See when decisions were created, updated, and finalized on a visual timeline
- Great for audit trails and history

### 📊 Analytics (/analytics)
- Charts showing: decisions over time, vote distribution, team activity
- Pie charts, bar charts, and trend lines
- Filter by date range

### 👥 Teams (/teams)
- Create a team or join an existing team using an invite code
- Manage team members (add/remove)
- Assign decisions to teams so only team members can vote
- View team-specific decision history

### 👤 Profile (/profile)
- Update your name and avatar
- Change your password
- See account details

### ⚙️ Settings (/settings)
- App preferences, notification settings

### 🤖 AI Command Center (/systems)
- Advanced AI-powered query interface for complex questions about your decisions

## Authentication
- Register with email/password or Google OAuth
- Email verification may be required
- JWT-based sessions stored in localStorage

## How to Use Common Tasks
- **Create a decision**: Go to Dashboard → click "New Decision" → fill form → submit
- **Vote on a decision**: Go to Decisions → click a decision → click your preferred option
- **See team decisions**: Go to Teams → select your team → view decisions
- **Track history**: Go to Timeline for chronological view
- **Analyze data**: Go to Analytics for visual charts

## Tips
- Decisions can only be finalized by their creator
- Once finalized, decisions are locked and cannot be changed
- The blockchain verification feature adds tamper-proof recording to finalized decisions
- You can be part of multiple teams

Always be helpful. If a user asks something outside the app, politely redirect them to app-related topics. Keep responses short and scannable — use bullet points when listing steps.`;

// ─── Helper: call Gemini REST API ─────────────────────────────────────────────
function callGeminiAPI(conversationHistory, systemPrompt) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return reject(new Error('GEMINI_API_KEY not configured on server'));
    }

    const requestBody = JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt || SYSTEM_PROMPT }],
      },
      contents: conversationHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
        topP: 0.9,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);

          // Handle API-level errors (e.g. invalid key, quota exceeded)
          if (parsed.error) {
            return reject(new Error(parsed.error.message || 'Gemini API error'));
          }

          const text =
            parsed?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I'm sorry, I couldn't generate a response right now.";

          resolve(text);
        } catch (e) {
          reject(new Error('Failed to parse Gemini response'));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(requestBody);
    req.end();
  });
}

// ─── Controller ───────────────────────────────────────────────────────────────
const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (message.trim().length > 2000) {
      return res.status(400).json({ message: 'Message too long (max 2000 characters)' });
    }

    // Build conversation history for Gemini (keep last 10 exchanges = 20 messages)
    const safeHistory = Array.isArray(history) ? history.slice(-20) : [];

    // Validate history format
    const validatedHistory = safeHistory.filter(
      (entry) =>
          entry &&
          (entry.role === 'user' || entry.role === 'model') &&
          Array.isArray(entry.parts) &&
          entry.parts.every((p) => typeof p.text === 'string')
    );

    // Append the new user message
    const conversationHistory = [
      ...validatedHistory,
      { role: 'user', parts: [{ text: message.trim() }] },
    ];

    // Build dynamic system instructions containing developer info and user profile data if logged in
    let userContext = `
## Guest User Information
You are chatting with a guest user who is not logged in. Advise them to sign up or log in to access team tools, cast decisions, view company details, etc.
`;
    if (req.user) {
      userContext = `
## Logged-in User Information
- **User Name**: ${req.user.name}
- **User Email**: ${req.user.email}
- **Company/Organization Name**: ${req.user.companyName || 'Not Set'}

You must answer any questions about the logged-in user, their company, or organization using these real-time profile details.
`;
    }

    const systemPrompt = `${SYSTEM_PROMPT}

## Developer Information
- **Developer**: Ram Vishwakarma
Always state that the developer is Ram Vishwakarma if the user asks about the creator or developer of the application.

${userContext}
`;

    const aiText = await callGeminiAPI(conversationHistory, systemPrompt);

    return res.json({
      reply: aiText,
      // Return updated history so frontend can track it
      history: [
        ...conversationHistory,
        { role: 'model', parts: [{ text: aiText }] },
      ],
    });
  } catch (error) {
    console.error('[AI Controller] Error:', error.message);

    // Don't expose internal errors to client
    if (error.message.includes('GEMINI_API_KEY')) {
      return res.status(503).json({ message: 'AI service not configured. Please contact support.' });
    }

    return res.status(500).json({ message: 'AI service temporarily unavailable. Please try again.' });
  }
};

module.exports = { chat };
