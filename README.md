## French Cards Generator

AI-powered flashcards to learn French vocabulary with instant translations. Choose how many cards to generate, pick a topic, select a translation language, and study with flip cards, pronunciation, and a simple progress marker.

### Features
- **AI word generation**: Requests themed word lists from Groq using the `openai/gpt-oss-120b` model
- **Multiple translations**: English, Українська, Deutsch, Español
- **Interactive cards**: Flip to reveal translation, mark as learned, and play French pronunciation via the Web Speech API
- **Modern stack**: Next.js, React 19, Redux Toolkit, TypeScript
---

## Usage
1. On the home page, choose the number of cards (1–20)
2. Select a translation language
3. Enter a topic (e.g., verbs, animals, food, travel)
4. Click Go to generate and navigate to the cards page
5. On each card:
   - Click to flip between French and translation
   - Click the speaker icon to play French pronunciation
   - Toggle the check icon to mark as learned

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Groq API key: create one in your Groq account dashboard

### Environment Variables
Create a `.env.local` at the project root:
```bash
GROQ_API_KEY=your_groq_api_key
```

### Development
```bash
npm run dev
```
Open http://localhost:3000 in your browser.


### npm scripts
- `dev`: start local development server
- `build`: production build
- `start`: start production server

---

## Installation
```bash
npm install
```

## Production
```bash
npm run build
npm start
```

