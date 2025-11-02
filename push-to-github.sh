#!/bin/bash

# Script to push the Motivational Quotes App to GitHub
# Repository: https://github.com/krinavaghela/Mindset.git

echo "🚀 Pushing project to GitHub..."

# Initialize git if not already initialized
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
fi

# Check if remote already exists
if git remote | grep -q "origin"; then
    echo "Remote 'origin' already exists. Updating..."
    git remote set-url origin https://github.com/krinavaghela/Mindset.git
else
    echo "Adding remote repository..."
    git remote add origin https://github.com/krinavaghela/Mindset.git
fi

# Add all files
echo "Adding files to git..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Initial commit: Daily Motivation app with Pinterest-style athletes section, light mode fixes, and Indian athletes

Features:
- Pinterest-style masonry grid for athletes
- 10 athlete stories (4 Indian + 6 World athletes)
- Filter and search functionality
- Light mode button visibility fixes
- Material Design UI with smooth animations
- Responsive design for mobile/tablet/desktop
- YouTube video embeds
- Practice steps for mental training
- Favorites and share functionality"

# Set main branch
echo "Setting main branch..."
git branch -M main

# Push to GitHub
echo "Pushing to GitHub..."
echo ""
echo "⚠️  You may be prompted for GitHub credentials."
echo "   If you have 2FA enabled, use a Personal Access Token as your password."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 View your repository at: https://github.com/krinavaghela/Mindset"
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "   1. Authentication required - use GitHub username and Personal Access Token"
    echo "   2. Repository may need to be created on GitHub first"
    echo "   3. Check your internet connection"
    echo ""
    echo "To fix authentication, you can:"
    echo "   - Use GitHub CLI: gh auth login"
    echo "   - Use SSH instead: git remote set-url origin git@github.com:krinavaghela/Mindset.git"
fi


