import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import LoginScreen from './src/screens/Auth/LoginScreen';
import OnboardingScreen from './src/screens/Auth/OnboardingScreen';
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import ActivitiesScreen from './src/screens/Activities/ActivitiesScreen';
import AddActivityScreen from './src/screens/Activities/AddActivityScreen';
import HarvestScreen from './src/screens/Harvest/HarvestScreen';
import AddHarvestScreen from './src/screens/Harvest/AddHarvestScreen';
import FinanceScreen from './src/screens/Finance/FinanceScreen';
import AddTransactionScreen from './src/screens/Finance/AddTransactionScreen';
import CalendarScreen from './src/screens/Calendar/CalendarScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import FarmManagementScreen from './src/screens/Profile/FarmManagementScreen';

// Context
import { DataProvider } from './src/context/DataContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Activities Stack
function ActivitiesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ActivitiesList"
        component={ActivitiesScreen}
        options={{ title: 'Field Activities' }}
      />
      <Stack.Screen
        name="AddActivity"
        component={AddActivityScreen}
        options={{ title: 'Record Activity' }}
      />
    </Stack.Navigator>
  );
}

// Harvest Stack
function HarvestStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HarvestList"
        component={HarvestScreen}
        options={{ title: 'Harvest & Yield' }}
      />
      <Stack.Screen
        name="AddHarvest"
        component={AddHarvestScreen}
        options={{ title: 'Record Harvest' }}
      />
    </Stack.Navigator>
  );
}

// Finance Stack
function FinanceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FinanceList"
        component={FinanceScreen}
        options={{ title: 'Finance' }}
      />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{ title: 'Add Transaction' }}
      />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="FarmManagement"
        component={FarmManagementScreen}
        options={{ title: 'Farm Management' }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Activities') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Harvest') {
            iconName = focused ? 'basket' : 'basket-outline';
          } else if (route.name === 'Finance') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Activities" component={ActivitiesStack} />
      <Tab.Screen name="Harvest" component={HarvestStack} />
      <Tab.Screen name="Finance" component={FinanceStack} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

// Root Navigator
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      setIsAuthenticated(!!user);
    } catch (error) {
      console.log('Error checking authentication:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <DataProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            </>
          ) : (
            <Stack.Screen name="Main" component={MainTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
}
