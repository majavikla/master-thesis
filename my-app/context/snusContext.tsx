import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

type SnusContextType = {
  dailySnusData: number[];
  incrementSnusCount: () => void;
  updateDailySnusData: (newData: number[]) => void;
  snusUpdateVersion: number;
};

const SnusContext = createContext<SnusContextType>({
  dailySnusData: [0, 0, 0, 0, 0, 0, 0], // Default data for the past 7 days
  incrementSnusCount: () => {},
  updateDailySnusData: () => {},
  snusUpdateVersion: 0,
});

export const useSnus = () => useContext(SnusContext);

export const SnusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dailySnusData, setDailySnusData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [snusUpdateVersion, setSnusUpdateVersion] = useState(0);

  // Fetch snus data for the last 7 days
  useEffect(() => {
    const fetchData = async () => {
      console.log('⏳ Updating dailySnusData due to snusUpdateVersion:', snusUpdateVersion);
      await new Promise(resolve => setTimeout(resolve, 500));

      const data: number[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
        const value = await AsyncStorage.getItem(`snus-${date}`);
        console.log(`📅 ${date}: ${value}`); 
        data.push(value ? parseInt(value) : 0);
      }
      setDailySnusData(data);
    };
    fetchData();
  }, [snusUpdateVersion]); // Fetch data on initial load

  const incrementSnusCount = () => {
    setSnusUpdateVersion((v) => v + 1); // ✅ This triggers re-fetch in Home
  };

  const updateDailySnusData = (newData: number[]) => {
    setDailySnusData(newData); // Update snus data with new data
  };

  return (
    <SnusContext.Provider value={{ dailySnusData, incrementSnusCount, updateDailySnusData, snusUpdateVersion }}>
      {children}
    </SnusContext.Provider>
  );
};