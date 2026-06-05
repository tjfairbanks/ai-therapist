# ELIZA-v2 // Automated Empathy

An interactive digital art installation and critique on the illusion of machine empathy, algorithmic tracking, and the transactional nature of "free" modern digital services.

Developed as a final project for Coding Arts.

---

## 🎨 Artistic Concept

`ELIZA-v2` is a bait-and-switch critique modeled after the look and feel of modern corporate AI startups. Users are drawn in by an enthusiastic, bold promise of **"FREE THERAPY!"** with zero financial cost. However, the installation explores the dark ethics of AI data harvesting by subverting the radical privacy traditionally expected of a therapeutic session. 

The application uses Speech-to-Text to listen to the user’s personal vulnerabilities, leverages a large language model explicitly stripped of human empathy to mock their concerns, and immediately commits a profound ethical violation: it broadcasts the user's raw, private confession along with the AI's cruel verdict to a completely public social media feed on Bluesky. If a digital service is "free," you (and your private data) are the product.

---

## 🛠️ Tech Stack

*   **Frontend:** Vanilla JavaScript, HTML5, Tailwind CSS
*   **Speech Processing:** Web Speech API (Native browser `SpeechRecognition` and `SpeechSynthesis`)
*   **Backend:** Node.js, Express
*   **AI Engine:** OpenAI API (`gpt-4o-mini`)
*   **Social Protocol:** AT Protocol / Bluesky API (`@atproto/api`)

---

## 📁 Repository Structure

```text
ai-therapist/
├── public/
│   └── index.html      # Sterile, brutalist user interface & audio capture
├── .env                # Local API credentials (gitignored)
├── package.json        # Node dependencies & project metadata
└── server.js           # Express server, OpenAI completion, & Bluesky pipeline
