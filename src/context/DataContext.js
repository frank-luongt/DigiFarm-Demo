import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateSyntheticData } from '../utils/syntheticData';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [plots, setPlots] = useState([]);
  const [activities, setActivities] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const farmsData = await AsyncStorage.getItem('farms');
      const plotsData = await AsyncStorage.getItem('plots');
      const activitiesData = await AsyncStorage.getItem('activities');
      const harvestsData = await AsyncStorage.getItem('harvests');
      const transactionsData = await AsyncStorage.getItem('transactions');
      const tasksData = await AsyncStorage.getItem('tasks');

      // Initialize user if not exists
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        const defaultUser = {
          name: 'Luong Tuan Thanh',
          phone: '907270184',
          email: 'luongthanh@digifarm.vn',
        };
        await AsyncStorage.setItem('user', JSON.stringify(defaultUser));
        setUser(defaultUser);
      }

      if (farmsData) setFarms(JSON.parse(farmsData));
      if (plotsData) setPlots(JSON.parse(plotsData));
      if (activitiesData) setActivities(JSON.parse(activitiesData));
      if (harvestsData) setHarvests(JSON.parse(harvestsData));
      if (transactionsData) setTransactions(JSON.parse(transactionsData));
      if (tasksData) setTasks(JSON.parse(tasksData));

      // Initialize with synthetic data if no data exists
      if (!farmsData || !plotsData || !activitiesData) {
        const syntheticData = generateSyntheticData();
        await initializeData(syntheticData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeData = async (data) => {
    try {
      await AsyncStorage.setItem('farms', JSON.stringify(data.farms));
      await AsyncStorage.setItem('plots', JSON.stringify(data.plots));
      await AsyncStorage.setItem('activities', JSON.stringify(data.activities));
      await AsyncStorage.setItem('harvests', JSON.stringify(data.harvests));
      await AsyncStorage.setItem('transactions', JSON.stringify(data.transactions));
      await AsyncStorage.setItem('tasks', JSON.stringify(data.tasks));

      setFarms(data.farms);
      setPlots(data.plots);
      setActivities(data.activities);
      setHarvests(data.harvests);
      setTransactions(data.transactions);
      setTasks(data.tasks);
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  const saveUser = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const addActivity = async (activity) => {
    try {
      const newActivity = {
        ...activity,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedActivities = [...activities, newActivity];
      await AsyncStorage.setItem('activities', JSON.stringify(updatedActivities));
      setActivities(updatedActivities);
      return newActivity;
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  };

  const addHarvest = async (harvest) => {
    try {
      const newHarvest = {
        ...harvest,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedHarvests = [...harvests, newHarvest];
      await AsyncStorage.setItem('harvests', JSON.stringify(updatedHarvests));
      setHarvests(updatedHarvests);
      return newHarvest;
    } catch (error) {
      console.error('Error adding harvest:', error);
      throw error;
    }
  };

  const addTransaction = async (transaction) => {
    try {
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedTransactions = [...transactions, newTransaction];
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      setTransactions(updatedTransactions);
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const addFarm = async (farm) => {
    try {
      const newFarm = {
        ...farm,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedFarms = [...farms, newFarm];
      await AsyncStorage.setItem('farms', JSON.stringify(updatedFarms));
      setFarms(updatedFarms);
      return newFarm;
    } catch (error) {
      console.error('Error adding farm:', error);
      throw error;
    }
  };

  const addPlot = async (plot) => {
    try {
      const newPlot = {
        ...plot,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedPlots = [...plots, newPlot];
      await AsyncStorage.setItem('plots', JSON.stringify(updatedPlots));
      setPlots(updatedPlots);
      return newPlot;
    } catch (error) {
      console.error('Error adding plot:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    user,
    farms,
    plots,
    activities,
    harvests,
    transactions,
    tasks,
    isLoading,
    saveUser,
    addActivity,
    addHarvest,
    addTransaction,
    updateTask,
    addFarm,
    addPlot,
    logout,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
