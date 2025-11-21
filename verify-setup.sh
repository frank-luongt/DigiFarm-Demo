#!/bin/bash

# DigiFarm Mobile - Setup Verification Script
# Run this to verify your setup is correct

echo "🌱 DigiFarm Mobile - Setup Verification"
echo "========================================"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null
then
    NODE_VERSION=$(node --version)
    echo "  ✅ Node.js installed: $NODE_VERSION"
else
    echo "  ❌ Node.js not found. Please install from https://nodejs.org"
    exit 1
fi

# Check npm
echo ""
echo "✓ Checking npm..."
if command -v npm &> /dev/null
then
    NPM_VERSION=$(npm --version)
    echo "  ✅ npm installed: $NPM_VERSION"
else
    echo "  ❌ npm not found."
    exit 1
fi

# Check if node_modules exists
echo ""
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]
then
    echo "  ✅ Dependencies installed"
else
    echo "  ⚠️  Dependencies not installed yet"
    echo "  Run: npm install"
fi

# Check project files
echo ""
echo "✓ Checking project structure..."

check_file() {
    if [ -f "$1" ]; then
        echo "  ✅ $1"
    else
        echo "  ❌ Missing: $1"
    fi
}

check_file "App.js"
check_file "package.json"
check_file "app.json"
check_file "src/context/DataContext.js"
check_file "src/utils/syntheticData.js"

# Check screens
SCREEN_COUNT=$(find src/screens -name "*.js" 2>/dev/null | wc -l)
echo ""
echo "✓ Screen files found: $SCREEN_COUNT/13"

if [ $SCREEN_COUNT -eq 13 ]; then
    echo "  ✅ All screens present"
else
    echo "  ⚠️  Some screens may be missing"
fi

# Check documentation
echo ""
echo "✓ Checking documentation..."
check_file "README.md"
check_file "QUICKSTART.md"
check_file "SETUP_GUIDE.md"
check_file "FEATURES.md"

echo ""
echo "========================================"
echo "🎉 Verification Complete!"
echo ""
echo "Next steps:"
echo "1. If dependencies not installed: npm install"
echo "2. Start the app: npm start"
echo "3. Choose platform: Press 'i' (iOS), 'a' (Android), or 'w' (Web)"
echo "4. Read QUICKSTART.md for 5-minute guide"
echo ""
echo "Happy Farming! 🌾"
