# Akshat Balothiya — Developer Portfolio

A cinematic, scroll-driven personal portfolio built with **React + Vite**, featuring a real-time 3D avatar powered by **Three.js**, GSAP scroll animations, interactive chess, an AI chatbot, and full project showcases.

---

## 🚀 Live Demo

> _Deploy on Vercel or Netlify — see [Deployment](#deployment) below._

---

## ✨ Features

- 🎬 **Cinematic Loading → Hero entrance** — staged sequential animation after load
- 🤖 **3D Character** — real-time Three.js GLB model with mouse-tracked head movement
- 📜 **Scroll-driven scenes** — GSAP ScrollTrigger: About Me, What I Do, Experience, My Work, Projects, Tech Stack, Contact
- 🎮 **Interactive Chess** — fully playable chess game built into the portfolio
- 💬 **AI Chatbot** — conversational assistant integrated in the Play With Me section
- 🖼️ **Project Showcase** — horizontal pinned scroll with custom project images + parallax
- 🌌 **Dark cinematic UI** — glassmorphism, purple accent, smooth lenis scroll
- 📱 **Fully responsive** — mobile-first, adapts all animations for smaller screens

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| 3D | Three.js (GLB + Draco) |
| Animations | GSAP 3 + ScrollTrigger + Lenis |
| Routing | React Router DOM v6 |
| Chess | chess.js |
| Confetti | canvas-confetti |
| Styling | Vanilla CSS (custom design system) |
| Fonts | Google Fonts (Inter, Space Grotesk) |

---

## 📁 Project Structure

```
developer-portfolios-master/
├── public/
│   ├── images/projects/      # Project showcase images
│   ├── models/               # 3D GLB character model
│   ├── fonts/                # Custom fonts
│   ├── draco/                # Draco decoder for Three.js
│   ├── video/                # Background videos
│   └── resume.pdf            # Downloadable resume
├── src/
│   ├── components/
│   │   ├── Character3D.jsx   # Three.js 3D avatar + scroll animations
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── LoadingScreen.jsx # Loading progress animation
│   │   ├── InteractiveChess.jsx
│   │   ├── SocialRail.jsx    # Social links sidebar
│   │   ├── Cursor.jsx        # Custom cursor
│   │   └── TextSplitter.js   # GSAP text animation utility
│   ├── config/
│   │   └── config.js         # ⭐ All portfolio content lives here
│   ├── pages/
│   │   ├── Home.jsx          # Main scroll experience
│   │   └── MyWorks.jsx       # /myworks gallery page
│   └── styles/
│       ├── MainContainer.css
│       ├── MyWorks.css
│       └── ...
├── index.html
├── vite.config.js
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js **18+**
- npm or yarn

### Install & Run

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```



---

## ✏️ Customisation

All portfolio content is centralised in **[`src/config/config.js`](src/config/config.js)**:

```js
export const config = {
  name: "Akshat Balothiya",
  roles: ["AI ENGINEER", "PYTHON DEVELOPER"],
  experiences: [ ... ],
  projects: [ ... ],   // ← update titles, images, links here
  contact: { ... },
  skills: { ... }
};
```

### Adding your own project images
1. Drop your image into `public/images/projects/your-image.jpg`
2. In `config.js`, set `image: "/images/projects/your-image.jpg"`

---

## 🚢 Deployment

### Vercel (recommended)
```bash
npm i -g vercel
vercel
```
Set the **Output Directory** to `dist` and **Build Command** to `npm run build`.

### Netlify
Drag the `dist/` folder into Netlify Drop, or connect your GitHub repo with:
- Build command: `npm run build`
- Publish directory: `dist`

### GitHub Pages
```bash
npm run build
# then push the dist/ folder to gh-pages branch
```

---

## 📄 License

MIT © [Akshat Balothiya](https://github.com/akshat-aetroiddestroyer)

---

<p align="center">Built with ❤️ by Akshat Balothiya</p>
