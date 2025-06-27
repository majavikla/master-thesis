import { View, Text, TextInput, StyleSheet, TouchableOpacity, 
  SafeAreaView, Image } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function NameScreen() {
  const [name, setName] = useState('');
  const [showTyping, setShowTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);

  const handleNext = async () => {
    if (name.trim()) {
      await AsyncStorage.setItem('userName', name);
      router.push('/onboarding/snus');
    }
  };

  useEffect(() => {
      const timer1 = setTimeout(() => {
        setShowTyping(false);
        setShowFirstMessage(true);
      }, 0); // Typing for 1.5s
    
      const timer2 = setTimeout(() => {
        setShowSecondMessage(true);
      }, 3000); // Show second message 1.5s after the first

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <View style={styles.chatWrapper}>
        <View style={styles.avatarWrapper}>
            <Image source={require('@/assets/images/nova-6 (kopia).png')} style={styles.avatar} />
            <FontAwesome name="caret-left" size={28} color="rgb(208, 208, 208)" style={styles.caret} />
        </View>
        <View style={styles.messagesWrapper}>            
            {showFirstMessage && (
              <Animated.View entering={FadeIn.duration(400)} style={[styles.messageBubble, {marginBottom: 12}]}>
                <Text style={styles.bubbleText}>Let's start with some information about you!</Text>
              </Animated.View>
              )}
          
            {showSecondMessage && (
              <Animated.View entering={FadeIn.duration(400)} style={styles.messageBubble}>
                <Text style={styles.bubbleText}>
                  What should we call you? 
                </Text>
              </Animated.View>
            )}
          </View>
      </View>

      <View style={{marginTop: 30, width: '90%'}}>   
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      </View>   
      <TouchableOpacity style={styles.button} onPress={handleNext} disabled={!name.trim()}>
          <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
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
  caret: {
    marginRight: -4, // pull it up closer to the bubble
  },
  title: { 
    fontSize: 20, 
    marginBottom: 26,
    fontFamily: 'Poppins_600SemiBold',
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
    fontFamily: 'Poppins_600SemiBold'
  },
  chatWrapper: {
    flexDirection: 'row', 
    alignItems: 'center',  
    marginBottom: 20,  
  },
  avatar: {
    width: 80,
    height: 80,
    marginRight: 10, // Space between avatar and message bubble
    borderRadius: 25, // Make the avatar circular
  },
  messageBubble: {
    backgroundColor: 'rgb(208, 208, 208)',
    padding: 12,
    borderRadius: 20,
    maxWidth: '80%', // Limit the width of the message bubble
  },
  bubbleText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
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
