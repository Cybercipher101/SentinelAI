# SentinelAI — Phase 1 website

This is a small React website for the AI Cybersecurity Assistant project at Graphic Era Hill University (team CSE27-386). The frontend is written in **HTML, CSS and JavaScript with React**. The backend remains the existing Python `server.py`.

## Files to know

| File              | What it does                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| `index.html`      | Provides the page and the root element where React runs.                                            |
| `src/main.jsx`    | Starts React and loads the stylesheet.                                                              |
| `src/App.jsx`     | Displays the header, four module choices, input forms, results, history and About page.             |
| `src/index.css`   | Styles the page and its mobile layout.                                                              |
| `src/analysis.js` | Validates inputs, calls the Python API for URL/email checks, and previews files/CSV in the browser. |
| `vite.config.js`  | Starts the development server and forwards `/api` requests to Python.                               |
| `server.py`       | Existing Python backend for URL and email rule-based checks.                                        |

The old unused TypeScript components and compiled website have been removed. `dist/` is generated when building and is ignored by Git.

## Run the project

Use Node.js 24.12+ and Python 3.9+. From the project folder:

```bash
npm ci
python3 -u server.py
```

Leave Python running. In another terminal in the same folder:

```bash
npm run dev
```

Open the address printed by Vite (normally `http://localhost:3000`). The frontend sends URL and email requests to `/api`; Vite forwards them to Python on port 8000. File and CSV previews run in the browser.

## What each module currently does

- **Malware Detection:** accepts a file and shows its filename, size and SHA-256 hash. Malware classification is not implemented yet.
- **Phishing URL Detection:** sends a URL to the existing Python rule-based checker. It does not open the destination.
- **Email Security:** sends email text to the existing Python rule-based checker. Sender authentication and attachments are not verified.
- **Network Anomaly Detection:** accepts a CSV and shows its rows and columns. Network classification is not implemented yet.

The result box, examples, JSON download and session history are available on the same page. History is stored only in the current browser session and disappears on reload. Rule-based scores are not trained model probabilities; file and CSV previews have no score or prediction. The project report's trained models and measured accuracy remain future work.

## Check the project

```bash
npm test
npm run build
```

The tests are plain JavaScript. `npm run build` creates the `dist/` folder. For the built frontend, run `npm run preview` while the Python backend is running. The compiled website does not include Python or trained models.

Researchers: Hrithik Raj, Shrut Dev Malviya, Tanisha Pandey and Amogh Singh Bisht. Guide: Mr. Saksham Mittal, Assistant Professor.
