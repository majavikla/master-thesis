import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AchievementsScreen() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<'reduction' | 'date-based' | 'budget' | 'custom' | null>(null);
  
  const handleCardPress = (cardType: 'reduction' | 'date-based' | 'budget' | 'custom') => {
    setSelectedCard(cardType);
  };

  const handleNext = () => {
    if (selectedCard === 'reduction') {
      router.push('/home/create-goal/reduction');
    } else if (selectedCard === 'date-based') {
      router.push('/home/create-goal/datebased');
    } else if (selectedCard === 'budget') {
      router.push('/home/create-goal/budget');
    } else if (selectedCard === 'custom') {
      router.push('/home/create-goal/custom');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>  
      </View>
      <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 60, paddingLeft: 4  }}>
        <FontAwesome name="flag-checkered" size={90} color="rgba(74,74,74,255)" style={{ marginTop: 24}} />
        <Text style={styles.progress}> Choose the category of your goal</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Pressable style={styles.card} onPress={() => handleCardPress('reduction')}>
            <FontAwesome name="sort-amount-desc" size={38} color={selectedCard === 'reduction' ? '#F4A261' : '#75808b'} />
            <Text style={[styles.cardTitles, { color: selectedCard === 'reduction' ? '#F4A261' : '#75808b' }]}>
            Reduction
            </Text>
        </Pressable>
        <Pressable style={styles.card} onPress={() => handleCardPress('date-based')}>
          <FontAwesome name="calendar" size={38} color={selectedCard === 'date-based' ? '#5DADE2' : '#75808b'}/>
          <Text style={[styles.cardTitles, { color: selectedCard === 'date-based' ? '#5DADE2' : '#75808b' }]}>
            Date-Based
          </Text>
        </Pressable>
      </View>  

      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Pressable style={styles.card} onPress={() => handleCardPress('budget')}>
          <FontAwesome name="money" size={38} color={selectedCard === 'budget' ? '#81C784' : '#75808b'}/>
          <Text style={[styles.cardTitles, { color: selectedCard === 'budget' ? '#81C784' : '#75808b' }]}>
            Budget
          </Text>
        </Pressable>

        <Pressable style={styles.card} onPress={() => handleCardPress('custom')}>
          <FontAwesome name="paint-brush" size={38} color={selectedCard === 'custom' ? '#BAA8E4' : '#75808b'}/>
            <Text style={[styles.cardTitles, { color: selectedCard === 'custom' ? '#BAA8E4' : '#75808b' }]}>
                Custom
            </Text>
        </Pressable>
      </View>  

      {selectedCard && (
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      )}
    

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
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginLeft: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 100,
    width: 140,
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
    padding: 1, 
  },
  progress: {
    fontSize: 20,
    color: 'rgba(74,74,74,255)',
    fontFamily: 'Poppins_700Bold',
    marginTop: 20,
  },
  cardTitles: {
    fontSize: 17,
    fontFamily: 'Poppins_400Regular',
    marginTop: 10,
  },
  nextButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: '#75808b',
    borderRadius: 22,
    marginTop: 140,
    alignSelf: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
});
