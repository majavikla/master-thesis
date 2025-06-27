import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';

export default function OnboardingWelcomeScreen() {
  const router = useRouter();
  const [showTyping, setShowTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);
  const [showThirdMessage, setShowThirdMessage] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleLetsGo = () => {
    router.push('/onboarding/name');
  };

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowTyping(false);
      setShowFirstMessage(true);
    }, 0); // Typing for 1.5s
  
    const timer2 = setTimeout(() => {
      setShowSecondMessage(true);
    }, 3600); // Show second message 1.5s after the first

    const timer3 = setTimeout(() => {
        setShowThirdMessage(true);        
    }, 7000);

    const timer4 = setTimeout(() => {
        setShowButton(true);
    }, 11000);
  
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.title}>
            <Text style={styles.middletext}></Text>
        </View>

        <View style={styles.chatWrapper}>
            <View style={styles.messageWrapper}>
                {showFirstMessage && (
                    <Animated.View entering={FadeIn.duration(600)} style={styles.messageBubble}>
                        <Text style={styles.bubbleText}>Hi! I'm Nova - your support buddy on this new journey.</Text>
                    </Animated.View>
                    )}

                {showSecondMessage && (
                    <Animated.View entering={FadeIn.duration(600)} style={[styles.messageBubble, { marginTop: 8 }]}>
                        <Text style={styles.bubbleText}>
                        My name means 'a star that shines brighter', and that's exactly what I'm here to help you do! ✨
                        </Text>
                    </Animated.View>
                    )}

                {showThirdMessage && (
                    <Animated.View entering={FadeIn.duration(600)} style={[styles.messageBubble, { marginTop: 8 }]}>
                        <Text style={styles.bubbleText}>
                        Quitting snus can feel tough. But you're stronger than you think — and I'll be here anytime you need me, just a tap away 💜
                        </Text>
                    </Animated.View>
                    )}    
                <FontAwesome name="caret-down" size={28} color="rgb(208, 208, 208)" style={styles.caret} />
            </View>    
            <Image source={require('@/assets/images/nova-6.png')} style={styles.avatar} />
        </View>
        
        {showButton && (
            <Animated.View entering={FadeIn.duration(400)} style={[styles.buttonWrapper, { marginTop: 8 }]}>
                <TouchableOpacity style={styles.button} onPress={handleLetsGo}>
                    <Text style={styles.buttonText}>Let's begin!</Text>
                </TouchableOpacity>
            </Animated.View>

        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative'
  },
  avatar: {
    width: 110,
    height: 120,
    marginBottom: 60,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 44,
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 200,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold'
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
  background: {
    flex: 1,
    justifyContent: 'center', // or 'flex-start' depending on your layout
    alignItems: 'center',     // optional
  },
  middletext: {
    alignItems: 'center',
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(208, 208, 208)',
    padding: 12,
    borderRadius: 20,
    maxWidth: '80%',
  },
  chatWrapper: {
    alignItems: 'center',
    top: '20%',
    position: 'absolute',
    transform: [{ translateY: -50 }],
  },
  messageWrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bubbleText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins_400Regular',
  },
  caret: {
    marginTop: -11,
  },
  typingBubble: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '80%',
  },
  typingText: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
    fontFamily: 'Poppins_400Regular',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 50,
  },
});
