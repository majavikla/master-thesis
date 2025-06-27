import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function AchievementsScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const fetchNameAndData = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) setUserName(storedName);

    };    
    fetchNameAndData();
  }, []); 

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>  
      </View>
      <Text style={styles.title}>{userName}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingLeft: 4  }}>
        <Text style={styles.progress}>he</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 22,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 24,
    paddingTop: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 70,
  },
  earned: {
    backgroundColor: '#fff',
  },
  locked: {
    backgroundColor: '#f0d0d0',
  },
  emoji: {
    fontSize: 28,
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    color: 'rgb(19, 45, 58)',
    paddingBottom: 10,
    paddingLeft: 6, 
    paddingTop: 10,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#ffff',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
  },
  container: { 
    padding: 1
  },
  progress: {
    fontSize: 16,
    color: 'rgb(83, 127, 84)',
    fontFamily: 'Poppins_400Regular'
  },
});
