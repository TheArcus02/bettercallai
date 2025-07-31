# AI Legal Document Analyzer

An AI-powered application to make legal documents easy to understand; users can paste text or a URL for any Terms of Service, Privacy Policy, or other legal agreement, and the tool instantly summarizes the critical warnings and key points in plain English.

## 🚀 Project Overview

The modern digital world requires users to agree to lengthy and complex legal documents constantly. Most people accept these terms without reading them, potentially exposing themselves to unfavorable conditions regarding data privacy, hidden fees, or restrictive usage rights.

This tool is designed to solve that problem. It acts as a personal AI legal assistant, empowering users by demystifying the fine print. By providing an automated, easy-to-understand analysis, the application helps users know exactly what they are agreeing to.

## ⚙️ How It Works

The application uses a sophisticated two-stage AI architecture to deliver a seamless user experience. While the user only sees a simple input and a clear output, two specialized agents work together behind the scenes.

1. **The Extractor \& Classifier Agent**: This is the first point of contact.
    * When a user provides a URL, this agent fetches the content, intelligently navigating JavaScript-heavy pages and avoiding common scraping issues.
    * It then analyzes the raw text to determine if it contains a legal document.
    * If a document is found, the agent classifies its type (e.g., *Privacy Policy*, *Terms of Service*, *Cookie Policy*) and extracts the full, clean text.
2. **The Analyzer Agent**: This is the core analysis engine.
    * It receives the clean text and its classification from the first agent.
    * Using a powerful large language model, it performs a deep analysis tailored to the specific document type.
    * It identifies and summarizes potential red flags, user-unfriendly clauses, and important sections a user must be aware of.
    * The final output is a structured, easy-to-read report with categorized warnings, concerns, and a general summary.

This modular architecture ensures high accuracy, optimizes cost by using different AI models for different tasks, and makes the system flexible enough to support new document types or input sources in the future.

## 🛠️ Technology Stack

The project is built using a modern and efficient technology stack, chosen for rapid development and an excellent user experience.

* **Framework**: Next.js (App Router)
* **UI Components**: shadcn/ui
* **Styling**: Tailwind CSS
* **Backend Logic**: Next.js Server Actions
* **Web Content Fetching**: A third-party Web Scraping API
* **AI Integration**: Multiple Large Language Model (LLM) APIs (a fast model for extraction and a high-reasoning model for analysis)
* **Deployment**: Vercel


## 🚀 Getting Started

To set up and run this project locally, you will need to follow these general steps:

1. **Clone the Repository**: Get a local copy of the project files.
2. **Install Dependencies**: Use a package manager (like npm or yarn) to install all the required project dependencies.
3. **Configure Environment Variables**: Create a local environment file (typically `.env.local`) in the project's root directory. In this file, you must provide the necessary API keys for the web scraping service and the AI models.
4. **Run the Development Server**: Start the application to view it in your browser.