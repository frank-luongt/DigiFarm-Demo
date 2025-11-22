# DigiFarm Mobile - Complete Setup Guide

This guide will walk you through setting up and running the DigiFarm Mobile prototype application.

## 📋 Prerequisites Checklist

Before you begin, ensure you have the following installed:

- [ ] **Node.js** (v16.x or higher) - [Download here](https://nodejs.org/)
- [ ] **npm** (comes with Node.js) or **yarn**
- [ ] **Git** (for version control)
- [ ] A code editor (VS Code recommended)
- [ ] For iOS: **Xcode** (Mac only) with Command Line Tools
- [ ] For Android: **Android Studio** with Android SDK

## 🚀 Step-by-Step Setup

### Step 1: Verify Node.js Installation

Open your terminal and run:

```bash
node --version
# Should output v16.x.x or higher

npm --version
# Should output 8.x.x or higher
```

### Step 2: Navigate to Project Directory

```bash
cd "/Users/thanhlt/Documents/GitHub/DigiFarm Demo"
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages:
- React Native and Expo SDK
- React Navigation
- Chart libraries
- Icon libraries
- AsyncStorage
- And more...

**Expected install time**: 2-5 minutes (depending on internet speed)

### Step 4: Verify Installation

After installation completes, verify by checking:

```bash
npm list expo
# Should show expo@~51.0.0
```

### Step 5: Start the Development Server

```bash
npm start
```

You should see:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

## 📱 Running on Different Platforms

### Option A: Run on iOS Simulator (Mac Only)

1. **Open iOS Simulator** (wait for it to load)
   ```bash
   npm run ios
   ```

2. The app will automatically open in the simulator

3. **First launch** may take 2-3 minutes to build

### Option B: Run on Android Emulator

1. **Start Android Emulator** from Android Studio (AVD Manager)

2. **Once emulator is running**, in your terminal:
   ```bash
   npm run android
   ```

3. **First launch** may take 3-5 minutes to build

### Option C: Run on Physical Device (Recommended for Demo)

1. **Install Expo Go** on your phone:
   - iOS: App Store → Search "Expo Go"
   - Android: Google Play → Search "Expo Go"

2. **Scan the QR code** displayed in terminal
   - iOS: Use Camera app
   - Android: Use Expo Go app

3. **App will load** on your device (10-30 seconds)

### Option D: Run in Web Browser

```bash
npm run web
```

Opens automatically in your default browser at `http://localhost:19006`

## 🎯 Quick Demo Access

Once the app loads:

1. **On the Login Screen**, tap **"Quick Demo Access"** button
2. The app will load with complete synthetic data
3. You're ready to demo!

**No authentication required for demo mode.**

## 🧪 Testing the App

### Recommended Demo Flow

1. **Dashboard** (Home tab)
   - View farm metrics and charts
   - Check pending tasks alert
   - Review recent activities

2. **Activities** (Leaf icon)
   - Browse 14+ pre-loaded activities
   - Filter by activity type
   - Tap "+" to add a new activity
   - Fill form and save

3. **Harvest** (Basket icon)
   - View 5 harvest records
   - See total harvest: 1,840 kg
   - Add new harvest record

4. **Finance** (Cash icon)
   - Review income: ₹198K
   - Check expenses: ₹84K
   - Net profit: ₹114K (57% margin)
   - View expense breakdown chart

5. **Calendar** (Calendar icon)
   - See 8 scheduled tasks
   - Mark tasks as complete
   - View overdue tasks

6. **Profile** (Person icon)
   - View farmer profile
   - Navigate to Farm Management
   - See 3 plots with details

## 🔧 Troubleshooting

### Problem: "npm install" fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: "Metro bundler won't start"

**Solution:**
```bash
# Kill any running Metro processes
killall node

# Clear Metro cache
npm start -- --reset-cache
```

### Problem: iOS Simulator won't open

**Solution:**
```bash
# Open Simulator manually first
open -a Simulator

# Then run
npm run ios
```

### Problem: Android build fails

**Solution:**
1. Open Android Studio
2. Go to SDK Manager
3. Install Android SDK Platform 33 or higher
4. Install Android SDK Build-Tools
5. Try again: `npm run android`

### Problem: "Invariant Violation: TurboModuleRegistry"

**Solution:**
```bash
# This usually means dependencies aren't installed correctly
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### Problem: App crashes on startup

**Solution:**
```bash
# Clear AsyncStorage
# Uninstall app from device/simulator
# Reinstall
npm run ios
# or
npm run android
```

## 📊 Understanding the Synthetic Data

The prototype includes realistic farming data:

### Farm Profile
- **Name**: Green Valley Farm
- **Location**: Tay Ninh, Vietnam
- **Total Area**: 25.5 acres
- **Owner**: Frank Luong

### Plots
1. **North Field** - 8.5 acres - Tomato (Roma variety)
2. **South Field** - 10 acres - Rice (Basmati variety)
3. **East Field** - 7 acres - Wheat (Durum variety)

### Activities (14 records)
- Planting: 2 activities
- Irrigation: 3 activities
- Fertilization: 3 activities
- Pest Control: 2 activities
- Weeding: 2 activities
- Maintenance: 1 activity
- Monitoring: 1 activity

### Harvests (5 records)
- Tomato: 4 harvests (1,840 kg total, Grade A)
- Rice: 1 harvest (2,800 kg, Premium grade)

### Transactions (22 records)
- Income: 4 transactions (₹198,000 total)
- Expenses: 18 transactions (₹84,000 total)
- Categories: Seeds, Fertilizer, Pesticides, Labor, Equipment, etc.

### Tasks (8 scheduled)
- High priority: 3 tasks
- Medium priority: 4 tasks
- Low priority: 1 task

## 🎨 Customization

### Change Demo User Name

Edit `src/screens/Auth/LoginScreen.js`:

```javascript
const demoUser = {
  name: 'Luong Tuan Thanh',  // Change this
  phone: '+84 90727 0184',
  language: 'Vietnamese',
};
```

### Modify Synthetic Data

Edit `src/utils/syntheticData.js` to:
- Add more activities
- Change crop types
- Adjust financial amounts
- Modify date ranges

### Update Color Scheme

Search for `#2E7D32` (primary green) in screen files and replace with your color.

## 📱 Device Testing Matrix

### Tested On:
- ✅ iOS 14+ (iPhone 12, 13, 14)
- ✅ Android 11+ (Various devices)
- ✅ Chrome, Safari, Firefox (Web)
- ✅ iPad (Tablet view)

### Screen Sizes:
- ✅ Small phones (iPhone SE)
- ✅ Standard phones (iPhone 13)
- ✅ Large phones (iPhone 14 Pro Max)
- ✅ Tablets (iPad)

## 🚀 Production Build (Optional)

To create a standalone app:

### iOS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --platform ios
```

### Android

```bash
# Build for Android
eas build --platform android
```

**Note**: Building for production requires an Expo account (free tier available).

## 📞 Support & Help

### Common Commands

```bash
# Start development server
npm start

# Start with cache reset
npm start -- --reset-cache

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Install new package
npm install package-name

# Check for updates
npm outdated
```

### Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [Expo Forums](https://forums.expo.dev/)

## ✅ Setup Complete!

You're now ready to demo the DigiFarm Mobile prototype to stakeholders and end users.

### Next Steps:

1. ✅ Run the app on your preferred platform
2. ✅ Use "Quick Demo Access" to bypass login
3. ✅ Explore all features systematically
4. ✅ Note any feedback or enhancement requests
5. ✅ Share with team members for review

---

**Need Help?** Check the main README.md for additional information or contact the development team.

Happy Farming! 🌱
