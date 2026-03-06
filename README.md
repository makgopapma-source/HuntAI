# HUNT.AI — Deployment Guide

## What this app does
Upload your CV → AI reads it → automatically searches SA jobs → scores every match

---

## Deploy to Vercel (step by step)

### Step 1 — GitHub
1. Go to github.com → "+" → "New repository" → name it `hunt-ai` → Create
2. Click "uploading an existing file"
3. Open the unzipped folder on your computer
4. Select ALL files and folders inside → drag into GitHub
5. Click "Commit changes"

### Step 2 — Vercel
1. Go to vercel.com → sign in with GitHub
2. "Add New Project" → select `hunt-ai` → Import
3. Framework: **Vite**
4. Click Deploy

### Step 3 — Environment Variables
Go to your Vercel project → Settings → Environment Variables → add:

| Name | Value |
|------|-------|
| ANTHROPIC_API_KEY | your key from console.anthropic.com |
| ADZUNA_APP_ID | d3ad4caa |
| ADZUNA_API_KEY | 8095a7e3576f82dd13ebe0377e97ecad |

Then: Deployments → three dots → Redeploy

---

## Your app is live! Share the URL with anyone.
