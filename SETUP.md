# Work Log App - Setup Guide

Since the automated tools (Node.js, Firebase CLI, GitHub CLI) were not available in the agent environment, you need to run the following commands manually to complete the setup.

## 1. Install Dependencies
Make sure you have Node.js installed on your machine.
Then, inside the `work-log-app` directory, run:

```bash
npm install
```

## 2. GitHub Setup
To connect this project to a GitHub repository:

```bash
# 1. Login to GitHub
gh auth login

# 2. Create the repository
gh repo create work-log-app --public --source=. --remote=origin --push
```

## 3. Firebase Hosting Setup
To deploy this project to Firebase:

```bash
# 1. Install Firebase tools (if not installed)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize Firebase
firebase init hosting
```
*   Select **"Use an existing project"** (create one on firebase.google.com first) or **"Create a new project"**.
*   For **"What do you want to use as your public directory?"**, type: `dist`
*   **"Configure as a single-page app?"**: `Yes`
*   **"Set up automatic builds and deploys with GitHub?"**: `Yes` (optional, but recommended)

## 4. Run Locally
To start the development server:

```bash
npm run dev
```

## 5. Deploy
To deploy your changes to the live URL:

```bash
npm run build
firebase deploy --only hosting
```
