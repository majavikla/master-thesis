import { View, Text, Button, StyleSheet, TextInput, Alert, TouchableOpacity, SafeAreaView,
  KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Image
 } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';

export default function SnusScreen() {
  const [snusUsePerDay, setSnusUsePerDay] = useState('');
  const [snusPrice, setSnusPrice] = useState('');
  const [showTyping, setShowTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);
  const [showThirdMessage, setShowThirdMessage] = useState(false);

  const completeOnboarding = async () => {
    if (!snusUsePerDay || !snusPrice) {
      Alert.alert('Missing Information', 'Please fill in both fields.');
      return;
    }

    try {
      await AsyncStorage.setItem('hasOnboarded', 'true');
      await AsyncStorage.setItem('snusUsePerDay', snusUsePerDay);
      await AsyncStorage.setItem('snusPrice', snusPrice);
      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
    }
  };

  useEffect(() => {
      const timer1 = setTimeout(() => {
        setShowTyping(false);
        setShowFirstMessage(true);
      }, 0); // Typing for 1.5s
    
      const timer2 = setTimeout(() => {
        setShowSecondMessage(true);
      }, 3500); // Show second message 1.5s after the first
  
      const timer3 = setTimeout(() => {
          setShowThirdMessage(true);        
      }, 6500);
  
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        
      <View style={styles.chatWrapper}>
        <View style={styles.avatarWrapper}>
            <Image source={require('@/assets/images/nova-6 (kopia).png')} style={styles.avatar} />
            <FontAwesome name="caret-left" size={28} color="rgb(208, 208, 208)" style={styles.caret} />
        </View>
        <View style={styles.messagesWrapper}>            
            {showFirstMessage && (
              <Animated.View entering={FadeIn.duration(400)} style={styles.messageBubble}>
                <Text style={styles.bubbleText}>Let's log your snus use!</Text>
              </Animated.View>
              )}
          </View>
      </View>    
        <View style={styles.middle}> 
          <Text style={styles.label}> How many snus pouches do you use in a day?</Text>
          <Text style={styles.infotext}> One tin contains approximately 20 snus pouches</Text>
          <View style={styles.middletext}>
            <TextInput
            style={styles.input}
            placeholder="e.g. 14"
            keyboardType="numeric"
            value={snusUsePerDay}
            onChangeText={setSnusUsePerDay}
            />
          </View>
          <View style={styles.middletext}>
            <Text style={styles.label}>What is the price of one snus tin (SEK)?</Text>
            <TextInput
            style={styles.input}
            placeholder="e.g. 53"
            keyboardType="numeric"
            value={snusPrice}
            onChangeText={setSnusPrice}
            />
          </View>
          <View style={ {alignItems: 'center', marginBottom: 20}}>
            <TouchableOpacity style={styles.button} onPress={completeOnboarding}>
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
          </View>
        </View>

  
      </View>
    </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  container: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    padding: 24,
    paddingTop: 42,
  },
  title: { 
    fontSize: 24, marginBottom: 20, fontFamily: 'Poppins_600SemiBold', 
  },
  label: { 
    fontSize: 18, 
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  messageBubble: {
    backgroundColor: 'rgb(208, 208, 208)',
    padding: 12,
    borderRadius: 20,
    maxWidth: '90%', // Limit the width of the message bubble
  },
  bubbleText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
  },
  input: { 
    borderWidth: 2, 
    padding: 10, 
    width: '100%', 
    marginBottom: 20, 
    borderRadius: 10,
    borderColor: 'rgb(186, 222, 255)',
    textAlign: 'center',
    fontSize: 16, 
    fontFamily: 'Poppins_600SemiBold',
  },
  infotext: { 
    fontSize: 14, 
    marginBottom: 12, 
    color: '#666', 
    textAlign: 'center', 
    fontFamily: 'Poppins_600SemiBold',
  },
  button: { 
    backgroundColor: 'rgb(208, 208, 208)',
    paddingVertical: 14,
    paddingHorizontal: 32, 
    borderRadius: 22, 
    marginBottom: 20,
    alignItems: 'baseline',
  },
  buttonText: { 
    color: '#kkk', 
    fontSize: 18, 
    fontFamily: 'Poppins_600SemiBold',
  },
  middletext: {
    alignItems: 'center', 
    width: '100%',
    marginBottom: 24,
  },
  top: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    marginRight: 10, 
    borderRadius: 25, 
  },
  caret: {
    marginRight: -4, 
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    marginBottom: 110,
  },
  bottom: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chatWrapper: {
    flexDirection: 'row', 
    alignItems: 'center',  
    marginBottom: 20,  
  },
  avatarWrapper: {
    flexDirection: 'row',  // Align avatar and caret horizontally
    alignItems: 'center',  // Center them vertically
    marginBottom: 20,  // Space between avatar and first message
    marginLeft: 6,
  },
  messagesWrapper: {
    flexDirection: 'column',  // Stack messages vertically
    alignItems: 'flex-start',  // Align the messages to the left
    marginTop: 4,
  },
});
