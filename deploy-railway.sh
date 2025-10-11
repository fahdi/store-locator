#!/bin/bash

echo "🚀 BlueSky Store Locator - Railway Deployment Script"
echo "================================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

echo "✅ Railway CLI version: $(railway --version)"

# Check if user is logged in
echo "🔐 Checking Railway authentication..."
if railway whoami 2>/dev/null; then
    echo "✅ Already logged in to Railway"
else
    echo "❌ Not logged in. Please run: railway login"
    echo "   This will open your browser for authentication."
    read -p "Press Enter after you've logged in..."
fi

# Link to project
echo "🔗 Linking to Railway project..."
railway link -p 23417230-5989-43ae-8231-ba8c843fc548

# Check project status
echo "📊 Checking project status..."
railway status

# Deploy the application
echo "🚀 Deploying to Railway..."
railway up --detach

echo ""
echo "✅ Deployment initiated!"
echo "📝 Monitor progress at: https://railway.app/project/23417230-5989-43ae-8231-ba8c843fc548"
echo "🌐 Your app will be available at the URL shown in Railway dashboard"
echo ""
echo "Demo Credentials:"
echo "  Admin: admin / a"
echo "  Manager: manager / m" 
echo "  Store: store / s"