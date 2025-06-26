# 🧠 AI CV Matcher

A full-stack web application that uses AI to match CVs with job descriptions. Built with **React**, **Django REST Framework**, and **OpenRouter AI API**, fully Dockerized and reverse-proxied via **Nginx**.

---

## 🚀 Features

- Upload a CV in PDF format
- Paste a job description
- Get an AI-generated match summary and score
- Frontend served via Nginx (React)
- Backend served via Gunicorn + Django
- Fully containerized with Docker Compose

---

## 📦 Tech Stack

- ⚛️ Frontend: React  
- 🐍 Backend: Django REST Framework  
- 🤖 AI: OpenRouter API (supports GPT-style models)  
- 🐳 Docker & Docker Compose  
- 🌐 Nginx reverse proxy  

---

## 🖼️ Screenshots


## 📁 Project Structure

```
cv-verifier/
├── backend/            # Django project
├── frontend/           # React app
├── nginx/              # Nginx reverse proxy config
├── docker-compose.yml  # Orchestration
└── .env                # Environment variables (not committed)
```

---

## ⚙️ Getting Started

### 1. Clone the project

```bash
git clone https://github.com/ankote/cv-verifier.git
cd cv-verifier
```

### 2. Create `.env` file

```env
OPENROUTER_API_KEY=your_openrouter_key_here
```

### 3. Run with Docker Compose

```bash
docker-compose up --build
```

Visit the app at:  
➡️ http://localhost:80

---

## 📤 API Endpoint (for testing)

```bash
curl -X POST http://localhost:8000/api/match/ \
  -F "pdf=@cv.pdf" \
  -F "job_details=We are hiring a Python backend developer"
```

---

## 🧪 Dev Commands

### Frontend

```bash
cd frontend
npm install
npm run dev  # or: npm run build
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

---

## 🧠 Credits

- Created by **Ayoub Ankote** @ 1337 / 42 Network  
- AI powered by **OpenRouter API**  
- Inspired by real-world job application challenges

---

## 🛡️ License

MIT License
