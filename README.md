<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/12StgkDNjZmcsKEgSMptXyPYmy7jItI44

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
# 🌿 HealthAware AI  
### *Understand Your Symptoms. Take Informed Action.*  
Built using **Gemini 3 Pro** in Google AI Studio

---

## 🧠 Overview  
**HealthAware AI** is an intelligent symptom-awareness and health-guidance assistant designed to help users better understand their symptoms and take informed next steps — all while ensuring safety and responsible AI behavior.

Users can describe their symptoms in natural language, upload optional lab reports, and receive a structured awareness report that includes:
- Possible health considerations (non-diagnostic)
- Risk level assessment  
- Red-flag detection  
- Suggested self-care steps  
- Medication cautions  
- When to seek medical help  
- Interactive flashcards and knowledge-check questions  
- Downloadable PDF report  

This system showcases the power of **Gemini 3 Pro's multimodal reasoning**, advanced context handling, and structured output generation.

---

## 🚀 Features

### 🔹 1. Patient Profile (Optional)
Users may enter:
- Name  
- Age  
- Gender  
- Location  
- Optional contact info  

**Note:** All fields are optional to ensure user comfort.

---

### 🔹 2. Symptom Input  
Users describe symptoms in free text, such as:  
> *“I have had a constant cough with mild fever and body aches for two days.”*

They can also select:
- Duration  
- Severity  
- Upload lab reports/images (optional)

---

### 🔹 3. Clarifying Questions  
Gemini auto-generates follow-up questions to better understand symptoms and patterns.

---

### 🔹 4. Health Awareness Report  
After processing the answers, the system generates a detailed, structured report including:

#### ✅ Primary Insight  
High-level summary of concerning patterns.

#### ⚠️ Risk Level  
Low | Medium | High (highlighting red-flag symptoms)

#### 🧩 Possible Health Considerations  
A list of potential conditions **(not diagnostic)** with:
- Likelihood
- Relevant symptom matches  
- Non-matching symptoms  

#### 💊 Medication Cautions  
Guidance on what to avoid without a doctor.

#### 🧘 Self-Care Steps  
Safe measures users can take at home.

#### 🚑 When to Seek Medical Care  
Urgent red flags displayed clearly.

#### 🧠 Interactive Flashcards  
Helps users understand symptoms and awareness concepts.

---

## 📝 Downloadable Report  
Users can export the full health awareness report as a **PDF**.  
A sample report is included in this repository:

📄 **HealthAwareAI_SampleReport.pdf**

---

## 🔗 Live Demo (AI Studio App)  
👉 https://ai.studio/apps/drive/12StgkDNjZmcsKEgSMptXyPYmy7jItI44?fullscreenApplet=true

---

## 🎬 Video Demo  
👉 https://youtu.be/9fuYKWL_Z2o

---

## 🛠️ Tech Stack  
- **Google AI Studio**  
- **Gemini 3 Pro Preview**  
- **Vibe Coding** + multimodal reasoning  
- HTML/CSS/JS (auto-generated UI inside AI Studio)  

---

## 🧩 How It Works
1. User provides symptom details  
2. Gemini analyzes natural language + context  
3. Clarifying questionnaire auto-generates  
4. Model evaluates risk patterns and red flags  
5. Detailed report + flashcards + suggestions are generated  
6. User can export report or restart assessment  

---

## 🔒 Safety & Disclaimer  
HealthAware AI is **not a medical diagnostic tool**.  
It does **not** provide treatment or professional medical advice.  

Users are advised to consult qualified healthcare providers for any medical concerns.

---

## 👩‍💻 Creator  
**Mandavi Singh**  
BSc (Hons.) DS & AI — IIT Guwahati  
AI enthusiast | Healthcare-focused AI Builder  

---

## 📜 License  
This project is released under **CC BY 4.0 International**.

---

## ⭐ Acknowledgment  
Thanks to **Google DeepMind** and **Gemini 3 Pro** for enabling multimodal, structured, and intelligent health-assistance capabilities.

