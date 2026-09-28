# StudyAI — Student Homework Helper

This folder contains the first working frontend for a student-focused AI homework website.

## Files
- index.html — main app
- style.css — responsive UI
- script.js — chat UI, image selection, local history and demo response

## Important
The current `script.js` intentionally uses a demo response. Do NOT put a private AI API key inside `script.js` or any GitHub Pages frontend.

For real AI:
1. Keep this frontend on GitHub Pages.
2. Add a small server/serverless function as the secure backend.
3. The frontend sends the question/image to your backend.
4. The backend calls your chosen AI provider/model.
5. The backend returns the answer.

"Unlimited and completely free" cannot be guaranteed for hosted AI APIs because inference has a real cost. A local/self-hosted model can avoid per-request API charges, but it still needs computing resources.

## Run locally
Simply open `index.html` in a browser. For a more reliable local server, use VS Code Live Server.

## GitHub Pages
Upload `index.html`, `style.css`, and `script.js` to a repository and enable GitHub Pages. The demo UI will work immediately; real AI requires the secure backend.
