#!/bin/bash

echo "🚀 Starting KataBump Server"
echo "============================"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "   Run ./setup.sh first to configure the environment."
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

echo "✅ Environment loaded"
echo "   Port: ${PORT:-5000}"
echo "   Mode: ${NODE_ENV:-production}"
echo ""

# Check if built
if [ ! -f "index.js" ]; then
    echo "❌ Server files not found!"
    echo "   Make sure you have the built files in this directory."
    exit 1
fi

echo "🔄 Starting server..."
node index.js
