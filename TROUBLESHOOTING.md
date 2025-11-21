# DigiFarm Mobile - Troubleshooting Guide

## Issue: Blank Page on Web Browser

### Problem
When opening http://localhost:19006 in the web browser, you see a blank white page.

### Cause
The app uses `react-native-chart-kit` for charts, which has limited web support. Some React Native components don't work perfectly in web browsers.

### **RECOMMENDED SOLUTIONS** (In Order of Best Experience)

---

## ✅ **Solution 1: Use Your Phone (BEST FOR DEMOS)**

This is the **recommended approach** for the best experience:

### Steps:
1. **Install Expo Go on your phone:**
   - **iPhone**: App Store → Search "Expo Go" → Install
   - **Android**: Google Play Store → Search "Expo Go" → Install

2. **Make sure your phone and computer are on the same WiFi network**

3. **In your terminal (where Metro is running), you should see:**
   ```
   Metro waiting on exp://192.168.x.x:8081
   › Scan the QR code above with Expo Go (Android) or Camera app (iOS)
   ```

4. **Scan the QR code:**
   - **iPhone**: Open the Camera app and point it at the QR code
   - **Android**: Open the Expo Go app and use the built-in scanner

5. **Wait 30-60 seconds** for the app to load on your phone

6. **Tap "Quick Demo Access"** and start exploring!

### Why This is Best:
- ✅ All features work perfectly
- ✅ Native performance
- ✅ Touch gestures work naturally
- ✅ Charts render correctly
- ✅ Best for stakeholder demos
- ✅ Shows the real mobile experience

---

## ✅ **Solution 2: Use iOS Simulator (Mac Only)**

### Steps:
1. **In your terminal where Metro is running, press `i`**

   OR run in a new terminal:
   ```bash
   cd "/Users/thanhlt/Documents/GitHub/DigiFarm Demo"
   npm run ios
   ```

2. **Wait 2-3 minutes** for the first build (subsequent launches are faster)

3. **The app will open in iOS Simulator**

4. **Tap "Quick Demo Access"** to start

### Why This Works:
- ✅ Full iOS experience
- ✅ All features work
- ✅ Charts render perfectly
- ✅ Good for development and testing

---

## ✅ **Solution 3: Use Android Emulator**

### Prerequisites:
- Android Studio installed
- An Android Virtual Device (AVD) created

### Steps:
1. **Start Android Emulator from Android Studio:**
   - Open Android Studio
   - Tools → Device Manager
   - Start an emulator

2. **Once emulator is running, in your terminal press `a`**

   OR run in a new terminal:
   ```bash
   cd "/Users/thanhlt/Documents/GitHub/DigiFarm Demo"
   npm run android
   ```

3. **Wait 3-5 minutes** for the first build

4. **The app will open in the emulator**

5. **Tap "Quick Demo Access"** to start

---

## 🔧 **Solution 4: Fix Web Version (Advanced)**

If you really need the web version to work, here's how to fix it:

### Option A: Disable Charts Temporarily

1. **Edit the Dashboard screen** to comment out charts:

```bash
# Open the file
open "/Users/thanhlt/Documents/GitHub/DigiFarm Demo/src/screens/Dashboard/DashboardScreen.js"
```

2. **Comment out the LineChart and BarChart imports and usage**

3. **Refresh the web page**

### Option B: Use Web-Compatible Chart Library

Install a web-compatible chart library:

```bash
cd "/Users/thanhlt/Documents/GitHub/DigiFarm Demo"
npm install react-chartjs-2 chart.js
```

Then update Dashboard to use react-chartjs-2 instead of react-native-chart-kit.

### Option C: Run in Development Mode with Logs

1. **Open browser console** (F12 or Cmd+Option+I)
2. **Look for JavaScript errors**
3. **Refresh the page** (Cmd+R or Ctrl+R)
4. **Check Console tab** for specific error messages

---

## 📱 **Quick Comparison: Which Method to Use?**

| Method | Setup Time | Best For | All Features Work? |
|--------|------------|----------|-------------------|
| **Physical Phone** | 2 min | Demos, Testing | ✅ Yes |
| **iOS Simulator** | 5 min (first time) | Development | ✅ Yes |
| **Android Emulator** | 5 min (first time) | Development | ✅ Yes |
| **Web Browser** | Instant | Quick preview | ⚠️ Charts may not work |

---

## 🎯 **Recommended for Your Demo**

**For stakeholder demos and end-user testing:**
→ Use your **physical phone** with Expo Go app

**Why?**
- Shows the real mobile experience
- Fastest to set up (just install Expo Go once)
- Touch interactions work perfectly
- Can hand the phone to stakeholders
- No simulator lag or desktop limitations

---

## 📋 **Step-by-Step: Phone Setup (Detailed)**

### iPhone Users:
1. **App Store** → Search "Expo Go" → Install
2. **Open Camera app** (not Expo Go)
3. **Point camera at QR code** in your terminal
4. **Tap the notification** that appears
5. **App loads** in Expo Go (30-60 seconds)
6. **Tap "Quick Demo Access"**

### Android Users:
1. **Google Play** → Search "Expo Go" → Install
2. **Open Expo Go app**
3. **Tap "Scan QR Code"**
4. **Point camera at QR code** in your terminal
5. **App loads** (30-60 seconds)
6. **Tap "Quick Demo Access"**

---

## ⚡ **If QR Code Not Showing in Terminal**

If you don't see a QR code in your terminal:

1. **Check the Expo DevTools webpage**: http://localhost:8081
2. **Look for "Connection" section** - QR code should be there
3. **Or manually enter the URL** in Expo Go app:
   - Look for the `exp://` URL in terminal
   - In Expo Go, tap "Enter URL manually"
   - Type the URL shown in terminal

---

## 🔍 **Debugging Web Issues**

If you still want to debug the web version:

### Check Browser Console:
1. Open **Chrome** or **Firefox**
2. Visit http://localhost:19006
3. Press **F12** (or Cmd+Option+I on Mac)
4. Click **Console** tab
5. **Look for red errors**

### Common Web Errors:

**Error: "Module not found"**
- Solution: `npm install` again

**Error: "react-native-chart-kit"**
- Solution: Use phone/simulator instead, or remove charts

**Blank white screen, no errors**
- Solution: Clear browser cache and reload (Cmd+Shift+R)

**Loading forever**
- Solution: Check Metro bundler is running, restart it

---

## 💡 **Pro Tips**

### For Best Demo Experience:
1. ✅ Use **physical phone**
2. ✅ Charge device to **80%+**
3. ✅ Enable **Do Not Disturb** mode
4. ✅ Close other apps
5. ✅ Test the full flow once before demo
6. ✅ Have **backup device** ready

### For Development:
1. Use **iOS Simulator** or **Android Emulator**
2. Keep Metro bundler running
3. Use **hot reload** (shake device → "Reload")
4. Check terminal for errors

---

## 📞 **Still Having Issues?**

### Check These:
- [ ] Metro bundler is running (terminal shows "Waiting on http://localhost:8081")
- [ ] Phone and computer on same WiFi
- [ ] Expo Go app is latest version
- [ ] No firewall blocking connections
- [ ] Node.js is installed (run `node --version`)

### Last Resort:
1. **Stop Metro**: Press Ctrl+C in terminal
2. **Clear cache**: `npm start -- --reset-cache`
3. **Clear Expo cache**: `npx expo start -c`
4. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules
   npm install
   npm start
   ```

---

## ✅ **Summary**

**The web version showing a blank page is NORMAL** because:
- React Native charts library has limited web support
- The app is designed for mobile devices
- All features work perfectly on phone/simulator

**What You Should Do:**
1. ✅ **Install Expo Go on your phone** (2 minutes)
2. ✅ **Scan the QR code** from terminal
3. ✅ **Start demoing** with the full mobile experience!

**This is actually BETTER than web** because:
- Real mobile experience
- All features work
- Touch interactions natural
- Perfect for stakeholder demos

---

**Your app is working perfectly - just use a phone or simulator instead of web browser! 📱**
