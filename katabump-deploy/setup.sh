#!/bin/bash

echo "🚀 KataBump Deployment Setup"
echo "=============================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found"
    
    if [ -f ".env.example" ]; then
        echo "📝 Creating .env from .env.example..."
        cp .env.example .env
        echo "✅ .env file created"
        echo ""
        echo "⚠️  IMPORTANT: Edit the .env file and add your configuration:"
        echo "   - MONGODB_URI: Your MongoDB connection string"
        echo "   - JWT_SECRET: Generate using: openssl rand -hex 32"
        echo "   - ADMIN_PASSWORD: Strong password for admin account"
        echo ""
        exit 1
    else
        echo "❌ .env.example not found. Cannot create .env file."
        exit 1
    fi
fi

echo "✅ .env file found"

# Load environment variables
source .env

# Validate required variables
MISSING_VARS=""

if [ -z "$MONGODB_URI" ] || [ "$MONGODB_URI" = "mongodb+srv://username:password@cluster.mongodb.net/?appName=KataBump" ]; then
    MISSING_VARS="$MISSING_VARS\n  - MONGODB_URI"
fi

if [ -z "$JWT_SECRET" ]; then
    MISSING_VARS="$MISSING_VARS\n  - JWT_SECRET"
fi

if [ -z "$ADMIN_PASSWORD" ]; then
    MISSING_VARS="$MISSING_VARS\n  - ADMIN_PASSWORD"
fi

if [ ! -z "$MISSING_VARS" ]; then
    echo ""
    echo "❌ Missing or invalid environment variables:"
    echo -e "$MISSING_VARS"
    echo ""
    echo "Please edit .env and set these variables."
    exit 1
fi

echo "✅ Environment variables validated"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server, run:"
echo "  ./start.sh"
echo ""
