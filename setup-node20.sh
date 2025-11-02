#!/bin/bash

# Setup Node 20 using nvm
# Run this after Command Line Tools are installed

export NVM_DIR="$HOME/.nvm"

# Load nvm if it exists
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Check if nvm is installed, if not install it
if ! command -v nvm &> /dev/null; then
    echo "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    
    # Reload nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
fi

# Install and use Node 20
echo "Installing Node 20..."
nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies and run dev server
cd /Users/shiva/MotivationalQuotesApp
echo "Installing dependencies..."
npm install

echo "Starting development server..."
npm run dev

