#!/bin/bash

echo "🏥 ME Movies Backend - Quick Start Script"
echo "======================================"
echo ""

# Check if Mail.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
    echo ""
fi

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build
echo "✅ Build complete!"
echo ""

echo "🚀 Starting development server..."
echo ""
npm run dev
