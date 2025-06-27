import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { getStoredGoals } from '@/utils/storage';
import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { clearGoals } from '@/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOALS_KEY } from '@/utils/storage';

const iconMap: Record<string, any> = {
  'goals-removebg-preview': require('@/assets/images/goals-removebg-preview.png'),
};

export default function GoalsScreen() {
  const router = useRouter();
  type Goal = { id: string; title: string; completed: boolean; 
    icon: string; iconName: string; };
  const [goals, setGoals] = useState<Goal[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadGoals = async () => {
        const stored = await getStoredGoals();
        setGoals(stored);
      };
      loadGoals();
    }, [])
  );

  const toggleGoalCompletion = async (goalId: string) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));
  };

  const earnedCount = goals.filter((g) => g.completed).length;


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable onPress={() => router.push('/home')} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
        </Pressable>  
      </View>
    
      <Text style={styles.title}>Goals</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingLeft: 4  }}>
          <FontAwesome name="check-square-o" size={20} color="rgba(99, 185, 172, 255)" style={{ marginRight: 6 }} />
          <Text style={styles.progress}>{earnedCount} / {goals.length}</Text>
      </View>
      
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'center', gap: 80, marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleGoalCompletion(item.id)} android_ripple={{ color: 'transparent' }} style={styles.trophyCard} >
          <View style={styles.trophyImageWrapper}>
            <Image
              source={iconMap[item.icon] ?? require('@/assets/images/icon.png')}
              style={[styles.trophyIcon, !item.completed && { tintColor: '#ccc', opacity: 0.4 }]}
            />
            <FontAwesome
              name={item.iconName as any}
              size={50}
              color={item.completed ? 'rgb(244, 166, 166)' : '#aaa'}
              style={styles.overlayIcon}
            />
          </View>
          <Text style={[styles.trophyTitle, item.completed ? styles.earnedText : styles.lockedText]}>
            {item.title}
          </Text>
        </Pressable>
  )}
/>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 1 },
  title: {
    fontSize: 28,
    color: 'rgba(99, 185, 172, 255)',
    fontWeight: 'bold',
    paddingBottom: 10,
    paddingLeft: 6, 
    fontFamily: 'Poppins_700Bold',
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
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  progress: {
    fontSize: 16,
    color: 'rgba(99, 185, 172, 255)',
    fontFamily: 'Poppins_600SemiBold'
  },
  list: {
    paddingBottom: 24,
    paddingTop: 6,
  },
  earnedText: {
    color: 'rgb(68, 68, 68)',
    fontWeight: '600',
  },
  lockedText: {
    color: '#999',
  },
  achievementsText: {
    fontSize: 16,
    color: '#333',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    zIndex: 1,
  },
  trophyCard: {
    alignItems: 'center',
    width: '30%',
  },
  trophyIcon: {
    width: 110,
    height: 110,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  trophyTitle: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    color: '#333',
  },
  trophyDate: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#999',
    marginTop: 2,
  },
  trophyProgress: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#999',
    marginTop: 2,
  },
    trophyImageWrapper: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlayIcon: {
      position: 'absolute',
      top: '25%',
      left: '29%',
      zIndex: 1,
    },  
});