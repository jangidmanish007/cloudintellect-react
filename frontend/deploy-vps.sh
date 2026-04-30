#!/bin/bash

# CloudIntellect Frontend Deployment Script for VPS
# This script handles the complete deployment process

set -e  # Exit on error

echo "🚀 Starting CloudIntellect Frontend Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the frontend directory.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Step 1: Cleaning old installation...${NC}"
rm -rf node_modules
rm -f package-lock.json yarn.lock

echo -e "${YELLOW}📦 Step 2: Checking for package manager...${NC}"

# Check if yarn is available
if command -v yarn &> /dev/null; then
    echo -e "${GREEN}✅ Yarn found, using yarn${NC}"
    PACKAGE_MANAGER="yarn"
else
    echo -e "${YELLOW}⚠️  Yarn not found, checking npm...${NC}"
    if command -v npm &> /dev/null; then
        echo -e "${GREEN}✅ npm found${NC}"
        PACKAGE_MANAGER="npm"
        
        # Offer to install yarn
        echo -e "${YELLOW}💡 Yarn is recommended for better dependency handling.${NC}"
        read -p "Would you like to install yarn? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install -g yarn
            PACKAGE_MANAGER="yarn"
            echo -e "${GREEN}✅ Yarn installed successfully${NC}"
        fi
    else
        echo -e "${RED}❌ Error: Neither yarn nor npm found. Please install Node.js first.${NC}"
        exit 1
    fi
fi

echo -e "${YELLOW}📦 Step 3: Installing dependencies...${NC}"
if [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn install
else
    npm install
    
    # Check if native modules are installed
    if [ ! -d "node_modules/@rollup" ]; then
        echo -e "${YELLOW}⚠️  Native modules missing, installing manually...${NC}"
        
        # Detect platform
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            npm install @rollup/rollup-linux-x64-gnu lightningcss-linux-x64-gnu --save-optional
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            npm install @rollup/rollup-darwin-x64 lightningcss-darwin-x64 --save-optional
        fi
    fi
fi

echo -e "${YELLOW}🔧 Step 4: Checking environment configuration...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}⚠️  .env file not found, copying from .env.example${NC}"
        cp .env.example .env
        echo -e "${RED}⚠️  Please edit .env file with your configuration before building!${NC}"
        read -p "Press enter to continue after editing .env..."
    else
        echo -e "${YELLOW}⚠️  No .env file found. Continuing without it...${NC}"
    fi
else
    echo -e "${GREEN}✅ .env file found${NC}"
fi

echo -e "${YELLOW}🏗️  Step 5: Building for production...${NC}"
if [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn build
else
    npm run build
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""
echo "📁 Build output is in the 'dist' directory"
echo ""
echo "Next steps:"
echo "1. Configure your web server (nginx/apache) to serve the 'dist' directory"
echo "2. Ensure your backend API is running and accessible"
echo "3. Update .env with the correct API URL if needed"
echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
