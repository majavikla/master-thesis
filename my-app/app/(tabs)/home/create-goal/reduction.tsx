import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { saveGoal } from '@/utils/storage';

export default function BudgetGoalsScreen() {
  type GoalKey = 'budget1' | 'budget2' | 'budget3' | 'budget4';
  const router = useRouter();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<GoalKey | null>(null);
  const [goalInputs, setGoalInputs] = useState({
    budget1: '',
    budget2: '',
    budget3: '',
    budget4: '',
  });

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleInputChange = (key: string, value: string) => {
    setGoalInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveGoal = async (title: string) => {
    const id = Date.now().toString();
    await saveGoal({ id, title, completed: false, icon: 'goals-removebg-preview', iconName: 'sort-amount-desc'  });
    router.push('/home/goals');
  };

  const renderCard = (key: GoalKey, description: string, placeholder: string, icon: any, color: string) => (
    <View style={styles.card}>
      <Pressable
        style={[styles.cardHeader, selectedCard === key && { marginBottom: 8 }]}
        onPress={() => setSelectedCard(prev => (prev === key ? null : key))}
      >
        <FontAwesome
          name={selectedCard === key ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={selectedCard === key ? color : '#75808b'}
          style={{ marginLeft: 'auto' }}
        />
        <Text style={[styles.cardTitles, { color: selectedCard === key ? color : '#75808b' }]}> {description.replace('___', goalInputs[key] || '_')} </Text>
      </Pressable>

      {selectedCard === key && (
        <View style={styles.inputBlock}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            keyboardType="numeric"
            value={goalInputs[key]}
            onChangeText={text => handleInputChange(key, text)}
          />
          {goalInputs[key].trim() !== '' && (
            <Pressable style={styles.saveButton} onPress={() => handleSaveGoal(description.replace('___', goalInputs[key]))}>
              <Text style={styles.saveButtonText}>Save this goal</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{ flex: 1 }}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <View style={styles.headerSection}>
            <FontAwesome name="sort-amount-desc" size={90} color="#F4A261" style={{ marginTop: 24 }} />
            <Text style={styles.progress}>Create a Reduction Goal</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {renderCard('budget1', 'Use no more than ___ pouches a day', 'Enter number of pouches...', 'money', '#F4A261')}
            {renderCard('budget2', 'Decrease daily use by ___ pouch(es) every Monday ', 'Enter number of pouches...', 'money', '#F4A261')}
            {renderCard('budget3', 'End the week at ___ pouches per day', 'End at...', 'money', '#F4A261')}
            {renderCard('budget4', 'Use ___ pouches less each day this week', 'Enter number of pouches...', 'money', '#F4A261')}
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  progress: {
    fontSize: 24,
    color: '#F4A261',
    fontFamily: 'Poppins_700Bold',
    marginTop: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
  },
  card: {
    flexDirection: 'column',
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
    marginTop: 5
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  cardTitles: {
    fontSize: 17,
    fontFamily: 'Poppins_400Regular',
    paddingLeft: 8,
  },
  inputBlock: {
    paddingTop: 4,
    width: '100%',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#75808b',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    marginTop: 3
  },
});


// Use no more than {maxPerDay || '_'} pouches a day
//             Decrease daily use by {days || '_'} pouch(es) every Monday 

//                 Start at {startValue || '_'} pouches per day and end the week at {endValue || '_'} pouches

//                 Use {duration || '_'} pouches less each day this week

