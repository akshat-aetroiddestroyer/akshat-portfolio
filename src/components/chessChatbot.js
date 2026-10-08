// Contextual Portfolio Chatbot for Akshat Balothiya
import { config } from '../config/config';

export const INITIAL_CHAT_MESSAGES = [
  {
    role: 'assistant',
    content: `Hello there! I am ${config.developer.fullName}'s portfolio AI assistant 👋 Ask me anything about my projects, AI/ML background, or let's play some chess!`
  }
];

export const QUICK_PROMPTS = [
  'What are your top projects?',
  'Tell me about your AI / ML background',
  'How strong is your chess AI?',
  'How can I get in touch?'
];

export async function getAssistantReply(userMessage, chatHistory = [], chessGameState = null) {
  const query = userMessage.trim().toLowerCase();

  // Try server API first if running with a backend endpoint
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are the portfolio persona for Akshat Balothiya, an AI/ML Engineer and Python Developer. Speak warmly, technically and concisely.`
          },
          ...chatHistory,
          { role: 'user', content: userMessage }
        ]
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.choices && data.choices[0]?.message?.content) {
        return data.choices[0].message.content;
      }
    }
  } catch (e) {
    // Fallback to local intelligent persona
  }

  // Simulated realistic response delay
  await new Promise((r) => setTimeout(r, 400));

  // Intelligent local portfolio persona responses
  if (query.includes('project') || query.includes('work') || query.includes('portfolio') || query.includes('build')) {
    return (
      `Here are some of my highlighted projects:\n\n` +
      `• **CryptoTrace**: Real-time cryptocurrency tracking platform with Groq LLaMA-3.3, Whisper voice input, Graph ML & anomaly detection.\n` +
      `• **Rurual Hart**: Cultural artisan e-commerce marketplace connecting rural craftspeople with global buyers (React Native).\n` +
      `• **NWP**: Precision weather downscaling platform translating satellite & climate models into Panchayat-level agricultural insights.\n` +
      `• **Bingebolt**: Cinematic movie discovery application powered by TMDB API.\n\n` +
      `You can check out the repositories directly on my GitHub (@${config.social.github})!`
    );
  }

  if (query.includes('ai') || query.includes('ml') || query.includes('machine learning') || query.includes('skill') || query.includes('tech stack') || query.includes('python')) {
    return (
      `My technical focus centers on **AI/ML & Python software development**:\n\n` +
      `• **Core**: Python, C++, JavaScript / TypeScript, SQL\n` +
      `• **AI & ML**: PyTorch, TensorFlow, Scikit-Learn, Groq LLaMA, Whisper, Graph Neural Networks, Computer Vision\n` +
      `• **Web & 3D**: React, Three.js, GSAP, FastAPI, Node.js\n` +
      `• **Focus Areas**: Generative AI, intelligent automation, predictive modeling, and hackathons prototyping.`
    );
  }

  if (query.includes('chess') || query.includes('elo') || query.includes('engine') || query.includes('game') || query.includes('bot') || query.includes('rating')) {
    let gameStateSnippet = '';
    if (chessGameState) {
      if (chessGameState.isGameOver) {
        gameStateSnippet = ` The current game just finished: ${chessGameState.status}!`;
      } else {
        gameStateSnippet = ` We're currently playing right now — ${chessGameState.status}!`;
      }
    }
    return (
      `You are challenging my AI chess engine rated at **ELO 3640**! ♟️${gameStateSnippet}\n\n` +
      `It features alpha-beta minimax search, positional piece-square evaluation tables, and Stockfish UCI integration. Good luck with your moves!`
    );
  }

  if (query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('hire') || query.includes('touch') || query.includes('message')) {
    return (
      `I'd love to connect! You can reach me via:\n\n` +
      `• **Email**: [${config.social.email}](mailto:${config.social.email})\n` +
      `• **GitHub**: [github.com/${config.social.github}](https://github.com/${config.social.github})\n` +
      `• **Location**: ${config.social.location}\n\n` +
      `Feel free to send me a message anytime!`
    );
  }

  if (query.includes('resume') || query.includes('cv')) {
    return (
      `You can download my full resume directly by clicking the **RESUME** button on the bottom right or heading to \`/resume.pdf\`. It details my academic milestones, hackathons, and technical projects!`
    );
  }

  if (query.includes('who are you') || query.includes('about') || query.includes('background') || query.includes('education') || query.includes('bio')) {
    return (
      `I'm **${config.developer.fullName}**, a B.Tech Engineering student specializing in **Artificial Intelligence and Machine Learning**.\n\n` +
      `I'm passionate about translating machine learning research into fast, scalable real-world applications. When I'm not training models or competing in hackathons, I enjoy building interactive 3D web experiences and playing chess!`
    );
  }

  if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('sup')) {
    return `Hey there! Great to meet you 👋 How are you finding the portfolio? Feel free to ask me anything or make your next move on the chess board!`;
  }

  if (query.includes('good') || query.includes('cool') || query.includes('awesome') || query.includes('nice') || query.includes('great')) {
    return `Thank you so much! I really appreciate the feedback. Let me know if you want to explore any specific projects or challenge the AI to another round of chess! ♟️`;
  }

  // Default thoughtful response
  return (
    `Thanks for reaching out! I'm ${config.developer.fullName}'s portfolio assistant. ` +
    `Feel free to ask about my AI/ML background, projects like CryptoTrace or NWP, my resume, or make your next move against the chess engine! 🚀`
  );
}
