#!/bin/bash

# Exact commands as requested by user
# Note: This will add all files, not just README.md, to preserve the existing README content

cd /Users/shiva/MotivationalQuotesApp

# Initialize git if not already done
git init

# Add all files (including the comprehensive README.md we already have)
git add .

# Commit with descriptive message
git commit -m "Initial commit: Daily Motivation app with Pinterest-style athletes section"

# Set main branch
git branch -M main

# Add remote (remove if exists first to avoid error)
git remote remove origin 2>/dev/null
git remote add origin https://github.com/krinavaghela/Mindset.git

# Push to GitHub
git push -u origin main


