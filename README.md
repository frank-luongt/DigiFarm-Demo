# DigiFarm Mobile - Digital Farming Application Prototype

A comprehensive React Native mobile application prototype designed to help farmers digitalize their farming operations. Built with Expo for cross-platform compatibility (iOS, Android, and Web).

## 🌱 Overview

DigiFarm Mobile enables farmers to:
- **Track Field Activities**: Record planting, irrigation, fertilization, pest control, and more
- **Manage Harvests**: Log harvest data with quality grades and yield tracking
- **Monitor Finances**: Track income and expenses with detailed analytics
- **Schedule Tasks**: Calendar view for upcoming farm activities
- **Analyze Performance**: Visual dashboards with charts and insights
- **Manage Multiple Plots**: Organize different fields and crops efficiently

## ✨ Key Features

### 🏠 Dashboard
- Real-time farm metrics and KPIs
- Income, expenses, and profit tracking
- Harvest trends and performance charts
- Recent activity feed
- Pending task alerts

### 🌾 Field Activities
- Comprehensive activity logging (7+ activity types)
- Plot-wise activity tracking
- Cost and labor hour recording
- Photo and note attachments
- Search and filter capabilities

### 🧺 Harvest Management
- Harvest recording with quality grades (A/B/C)
- Yield tracking and analytics
- Labor cost calculation
- Historical harvest data

### 💰 Finance Tracking
- Income and expense management
- Category-wise expense breakdown
- Payment status tracking
- Profit margin analysis
- Visual charts and reports

### 📅 Calendar & Tasks
- Interactive calendar view
- Task scheduling and reminders
- Priority management
- Task completion tracking
- Overdue task alerts

### 👤 Profile & Farm Management
- User profile management
- Multi-farm and multi-plot support
- Farm statistics overview
- Plot details and crop information

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (will be installed with dependencies)
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   cd "/Users/thanhlt/Documents/GitHub/DigiFarm Demo"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**

   - **iOS Simulator** (Mac only):
     ```bash
     npm run ios
     ```

   - **Android Emulator**:
     ```bash
     npm run android
     ```

   - **Web Browser**:
     ```bash
     npm run web
     ```

   - **Physical Device**:
     - Install the Expo Go app from App Store or Google Play
     - Scan the QR code displayed in the terminal

## 📱 Demo Access

The app includes a **Quick Demo Access** button on the login screen that allows you to bypass authentication and explore the app immediately with pre-loaded synthetic data.

**Demo Credentials:**
- Farmer Name: Rajesh Kumar
- Farm: Green Valley Farm (25.5 acres)
- Location: Karnataka, India
- Plots: 3 active plots (Tomato, Rice, Wheat)

## 📊 Synthetic Data

The prototype comes pre-loaded with comprehensive synthetic data including:

- **90+ days** of farming activities
- **Multiple harvest records** with quality grades
- **50+ financial transactions** (income & expenses)
- **8 scheduled tasks** with various priorities
- **3 active plots** with different crops
- **Complete activity history** across all categories

## 🏗️ Project Structure

```
DigiFarm Demo/
├── App.js                          # Main app entry point with navigation
├── app.json                        # Expo configuration
├── package.json                    # Dependencies and scripts
├── src/
│   ├── context/
│   │   └── DataContext.js         # Global state management with AsyncStorage
│   ├── utils/
│   │   └── syntheticData.js       # Demo data generator
│   └── screens/
│       ├── Auth/
│       │   ├── LoginScreen.js     # Phone-based authentication
│       │   └── OnboardingScreen.js # New user setup
│       ├── Dashboard/
│       │   └── DashboardScreen.js # Main dashboard with analytics
│       ├── Activities/
│       │   ├── ActivitiesScreen.js    # Activity list and filters
│       │   └── AddActivityScreen.js   # Activity recording form
│       ├── Harvest/
│       │   ├── HarvestScreen.js       # Harvest records and metrics
│       │   └── AddHarvestScreen.js    # Harvest logging form
│       ├── Finance/
│       │   ├── FinanceScreen.js       # Financial overview
│       │   └── AddTransactionScreen.js # Income/expense form
│       ├── Calendar/
│       │   └── CalendarScreen.js      # Task calendar and scheduling
│       └── Profile/
│           ├── ProfileScreen.js       # User profile and settings
│           └── FarmManagementScreen.js # Farm and plot management
```

## 🛠️ Technology Stack

- **Framework**: React Native with Expo SDK 51
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **Data Persistence**: AsyncStorage (offline-first)
- **Charts**: react-native-chart-kit
- **Icons**: Expo Vector Icons (Ionicons)
- **Calendar**: react-native-calendars
- **Image Handling**: expo-image-picker
- **Location**: expo-location

## 📐 Design System

### Color Palette
- **Primary Green**: `#2E7D32` - Main brand color, CTAs, active states
- **Light Green**: `#E8F5E9` - Backgrounds, highlights
- **Background**: `#F5F5F5` - App background
- **Cards**: `#FFFFFF` - Content cards with elevation
- **Text Primary**: `#333333`
- **Text Secondary**: `#666666`
- **Text Tertiary**: `#999999`

### Activity Type Colors
- **Planting**: `#4CAF50` (Green)
- **Irrigation**: `#2196F3` (Blue)
- **Fertilization**: `#FF9800` (Orange)
- **Pest Control**: `#F44336` (Red)
- **Weeding**: `#8BC34A` (Light Green)
- **Maintenance**: `#9C27B0` (Purple)
- **Monitoring**: `#00BCD4` (Cyan)

### Typography
- **Headers**: Bold, 24-32px
- **Titles**: Semi-bold, 16-18px
- **Body**: Regular, 14-16px
- **Captions**: Regular, 11-12px

## 🎯 Core Functionality

### Data Persistence
All data is stored locally using AsyncStorage, enabling:
- ✅ Offline-first functionality
- ✅ No internet required for core features
- ✅ Automatic data sync on app restart
- ✅ Data persists between sessions

### Key User Flows

1. **First Time User**
   - Login with phone number → OTP verification → Onboarding → Main app
   - Or use "Quick Demo Access" to skip authentication

2. **Recording an Activity**
   - Navigate to Activities → Tap + button → Select plot and type → Fill details → Save

3. **Logging a Harvest**
   - Navigate to Harvest → Tap + button → Select plot → Enter quantity and grade → Save

4. **Adding a Transaction**
   - Navigate to Finance → Tap + button → Choose Income/Expense → Enter details → Save

5. **Managing Tasks**
   - Navigate to Calendar → View scheduled tasks → Tap checkbox to complete

## 📱 Supported Platforms

- ✅ **iOS** (iPhone & iPad)
- ✅ **Android** (Phone & Tablet)
- ✅ **Web** (Desktop & Mobile browsers)

## 🔧 Configuration

### Modifying Demo Data
Edit `src/utils/syntheticData.js` to customize the synthetic data:
- Add more farms, plots, or activities
- Adjust date ranges
- Modify transaction amounts
- Change task priorities

### Customizing Theme
Update colors in individual screen StyleSheets:
```javascript
const styles = StyleSheet.create({
  primaryColor: '#2E7D32', // Change primary color here
  // ... other styles
});
```

## 📈 Performance Considerations

- **Optimized Rendering**: Uses React.memo and useMemo for expensive calculations
- **Lazy Loading**: Data loaded on-demand
- **Image Optimization**: Supports image compression
- **Offline First**: Core features work without internet
- **Lightweight**: Minimal dependencies for fast load times

## 🐛 Known Limitations (Prototype)

- No actual OTP verification (demo mode accepts any 6-digit code)
- No backend integration (all data stored locally)
- No real-time sync across devices
- No push notifications (UI only)
- No image capture/upload (UI ready, not functional)
- No GPS-based plot mapping (placeholder)
- Limited to single user per device

## 🚧 Future Enhancements

### Phase 2 Features
- [ ] Backend API integration
- [ ] Real user authentication
- [ ] Cloud data sync
- [ ] Multi-user collaboration
- [ ] Push notifications
- [ ] Image upload and gallery
- [ ] GPS plot boundary mapping
- [ ] Weather integration
- [ ] Market price data
- [ ] Export reports (PDF)

### Phase 3 Features
- [ ] AI-powered pest identification
- [ ] Crop health analysis
- [ ] Yield prediction models
- [ ] IoT sensor integration
- [ ] Satellite imagery
- [ ] Expert consultation chat
- [ ] Community forum
- [ ] Marketplace integration

## 📄 License

This is a prototype/demo application built for evaluation purposes.

## 🤝 Support

For questions or issues:
1. Check the inline code documentation
2. Review the Product Requirements Document (PRD)
3. Contact the development team

## 🎉 Quick Start Demo Script

For presenting to stakeholders:

1. **Launch App** → Tap "Quick Demo Access"
2. **Dashboard Overview** → Show metrics, charts, recent activities
3. **Field Activities** → Browse activities, filter by type, show details
4. **Add Activity** → Demo recording a new irrigation activity
5. **Harvest** → Show harvest history and totals
6. **Finance** → Display income vs expenses, profit margin
7. **Calendar** → Show upcoming tasks, complete a task
8. **Profile** → View farm details, plot management

**Total Demo Time**: 5-7 minutes

---

## 📱 Screenshots Preview

The app includes:
- 🏠 Feature-rich Dashboard with real-time metrics
- 📊 Interactive Charts (Line & Bar charts)
- 📋 Comprehensive Data Entry Forms
- 🎨 Modern, Clean UI Design
- 📱 Mobile-First Responsive Layout
- 🌐 Cross-Platform Compatibility

---

**Built with ❤️ for Farmers**

Version 1.0.0 | Last Updated: November 2025
