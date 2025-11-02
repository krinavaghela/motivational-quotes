#!/bin/bash

# Start the development server with Node 20
cd /Users/shiva/MotivationalQuotesApp

# Load nvm (adjust path if needed)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
[ -s "$HOME/.bashrc" ] && source "$HOME/.bashrc"
[ -s "$HOME/.zshrc" ] && source "$HOME/.zshrc"

# Use Node 20
nvm use 20 2>/dev/null || {
    echo "⚠️  Node 20 not found. Installing..."
    nvm install 20
    nvm use 20
}

# Check Node version
echo "📦 Using Node $(node -v)"
echo "🚀 Starting dev server..."
echo ""

# Start the server
npm run dev


