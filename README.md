## French Cards Generator

AI-powered flashcards to learn French vocabulary with instant translations. Choose how many cards to generate, pick a topic, select a translation language, switch the UI locale, and study with flip cards, pronunciation, and a simple progress marker.

### Features
- **AI word generation**: Groq `openai/gpt-oss-120b` generates themed word lists
- **Duplicate avoidance**: Excludes up to last 200 learned French words from generation
- **Multiple translations**: English, Українська, Deutsch, Español
- **Localized UI**: en, fr, es, de, uk; quick toggle from the home page
- **Interactive cards**: Flip to reveal translation, mark as learned, and play French pronunciation (ResponsiveVoice)
- **Learned page**: Review learned words, see count, and reset progress
- **Local persistence**: `localStorage` for learned words and preferred translation language
- **Modern stack**: Next.js 15, React 19, Redux Toolkit, TypeScript, next-intl, Vercel Analytics
---

## Usage
1. On the home page, choose the number of cards (1–20)
2. Select a translation language
3. Optionally toggle the UI language (en/fr/es/de/uk)
4. Enter a topic (e.g., verbs, animals, food, travel)
5. Click Go to generate and navigate to the cards page
6. On each card:
   - Click to flip between French and translation
   - Click the speaker icon to play French pronunciation
   - Toggle the check icon to mark as learned
7. Open the Learned page to review learned words and reset progress

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

## API

- `POST /api/cards`
  - Body: `{ count: number, theme: string, language: "English|Українська|Deutsch|Español", storage: string[] }`
  - Behavior: Uses Groq to generate words; excludes items from `storage` (up to 200) to avoid duplicates
  - Response: JSON array like `[{ "french": "bonjour", "English": "hello" }]`

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