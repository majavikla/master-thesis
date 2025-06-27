import { Tabs, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { useSnus, SnusProvider } from '@/context/snusContext';
import { BaseToast, ErrorToast } from 'react-native-toast-message';


const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#b89dcf',
        backgroundColor: '#ffff',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginHorizontal: 12,
      }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      text1Style={{
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: 'rgba(74,74,74,255)',
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: 'rgba(74,74,74,255)',
      }}
    />
  )
};


function FloatingPopup({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <View style={styles.popupContainer}>
      <View style={styles.popup}>
        <Text style={styles.popupText}>Are you sure you want to add a snus pouch?</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.popupButton} onPress={onConfirm}>
            <Text style={styles.popupButtonText}>Yes, add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { incrementSnusCount } = useSnus();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 4000); // auto-hide after 4s
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleAddSnusPouch = async () => {
    const today = dayjs().format('YYYY-MM-DD');
    const key = `snus-${today}`;
    const value = await AsyncStorage.getItem(key);
    const currentCount = value ? parseInt(value) : 0;
    const newCount = currentCount + 1;
    await AsyncStorage.setItem(key, newCount.toString());
    
    let retries = 0;
    let confirmValue = null;
    while (retries < 5) {
      confirmValue = await AsyncStorage.getItem(key);
      if (confirmValue === newCount.toString()) break;
      await new Promise(res => setTimeout(res, 100)); // wait a bit and retry
      retries++;
    }
    console.log(`✅ Confirmed new value for ${key}: ${confirmValue}`);
    

    incrementSnusCount(); // Notify home tab to refresh
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: 'Snus pouch added!',
      visibilityTime: 2000,
      bottomOffset: 100
    });

    setShowPopup(false);

    
  };

  
  return (
    <SnusProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'Health',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
          name="dummy"
          options={{
            tabBarLabel: 'Add snus',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size + 6} color={color} />
            ),
            tabBarButton: (props) => (
              <HapticTab
                {...props}
                onPress={(e) => {
                  e.preventDefault();
                  setShowPopup(true);
                }}
              />
            ),
          }}
        />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="bubble.left.and.text.bubble.right.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
        href: null, // Hides it from the tab bar
        }}
      />
    </Tabs>

    {showPopup && (
        <FloatingPopup
          onConfirm={handleAddSnusPouch}
          onCancel={() => {
            setShowPopup(false);
            Toast.show({
              type: 'success',
              position: 'bottom',
              text1: 'Great job!',
              text2: 'You just avoided a snus! 🎉',
              visibilityTime: 2500,
              bottomOffset: 100,
            });
          }}
        />
      )}

    <Toast config={toastConfig}/>
    </SnusProvider>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    bottom: 100, 
    alignSelf: 'center',
    backgroundColor: 'transparent',
    zIndex: 999,
    width: '70%'
  },
  popup: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    alignItems: 'center',
    minWidth: 200,
  },
  popupText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 6,
  },
  popupButton: {
    backgroundColor: '#b89dcf',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  popupButtonText: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold'
  },
  cancelText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 10,
  },
  cancelButton: {
    justifyContent: 'center',
    paddingVertical: 8,
    paddingBottom: 20,
  },
});