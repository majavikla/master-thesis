import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  
  const [isAppReady, setIsAppReady] = useState(false);
  const [hasLaunched, setHasLaunched] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const launched = await AsyncStorage.getItem('hasLaunched');
      if (launched === null) {
        // First time launch
        setHasLaunched(false);
      } else {
        setHasLaunched(true);
      }
      setIsAppReady(true);
    };
    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (fontsLoaded && isAppReady && hasLaunched !== null) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isAppReady, hasLaunched]);

  if (!fontsLoaded || !isAppReady || hasLaunched === null) {
    return null; // Loading splash / fonts / launch status
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {hasLaunched ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} />
        ) : (
          <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </ThemeProvider>
  );
}
