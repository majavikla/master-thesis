import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, ScrollView, StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView, Pressable, Image } from 'react-native';
import { sendMessageToChatbot } from '../../services/chatbotService';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const loadUserName = async () => {
      const name = await AsyncStorage.getItem('userName');
      if (name) setUserName(name);

      if (messages.length === 0) {
        sendInitialGreeting(name || 'there');
      }
    };
    loadUserName();
  }, []);

  const sendInitialGreeting = async (name: string) => {
    try {
      const hasGreeted = await AsyncStorage.getItem('hasGreetedBefore');
  
      if (!hasGreeted) {
        const introMessage1 = `Hi ${name}! I'm Nova - your support buddy to help you quit snus 🌟`;
        const introMessage2 = `You can talk to me anytime - whether you're dealing with cravings, feeling stuck, or just need a tip or two 💬✨`;
        setIsTyping(true);
        setTimeout(() => {
          setMessages([{ sender: 'bot', text: introMessage1 }]);
        }, 1000);

        setTimeout(() => {
          setMessages((prev) => [...prev, { sender: 'bot', text: introMessage2 }]);
          setIsTyping(false);
        }, 2500);
  
        await AsyncStorage.setItem('hasGreetedBefore', 'true');
        return;
      }
  
      const hour = new Date().getHours();
      const timeBasedGreeting =
        hour < 10
          ? `Good morning, ${name}! Ready to start strong?`
          : hour < 18
            ? `Good afternoon, ${name}! How's your day going?`
            : `Good evening, ${name}! How are you holding up?`;
  
      const generalGreetings = [
        `Hi ${name}! What do you have in mind today?`,
        `Hello ${name}! How are you feeling?`,
        `Hi ${name}! I'm here to support you - what's on your mind?`,
        `Hey ${name}, I'm here for you. What's on your mind today?`,
        `Hi ${name}! How are you feeling right now?`,
        `Welcome back! Every step counts — how can I help today?`,
        `Here for you as always. Is there something you'd like to talk about?`,
      ];
  
      const allGreetings = [timeBasedGreeting, ...generalGreetings];
      const randomGreeting = allGreetings[Math.floor(Math.random() * allGreetings.length)];
  
      setIsTyping(true);
      setTimeout(() => {
        const botMessage = { sender: 'bot', text: randomGreeting };
        setMessages([botMessage]);
        setIsTyping(false);
      }, 1000);
  
    } catch (error) {
      console.error('Failed to send initial greeting:', error);
    }
  };


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const botReply = await sendMessageToChatbot(updatedMessages);
      const personalizedReply = botReply.replace(/\{\{name\}\}/g, userName);

      setTimeout(() => {
        const botMessage = { sender: 'bot', text: personalizedReply };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000); // simulate bot typing delay
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);


  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} 
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>Nova</Text>
          </View>
        
          <View style={styles.chatArea}>
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.chatContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={{ flex: 1}}
            >
              {messages.map((msg, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageBubbleContainer,
                    msg.sender === 'user' ? styles.userBubbleContainer : styles.botBubbleContainer,
                  ]}
                >
                  <View style={styles.avatarContainer}>
                    {msg.sender === 'user' ? (
                      <FontAwesome name="user-circle-o" size={28} color="#ccc" style={styles.avatar} />
                    ) : (
                      <Image source={require('@/assets/images/nova-6 (kopia).png')} style={styles.avatar} />
                    )}
                  </View>
                  <View
                    style={[
                      styles.messageBubble,
                      msg.sender === 'user' ? styles.userBubble : styles.botBubble,
                    ]}
                  >
                    <Text style={styles.messageText}>{msg.text}</Text>
                  </View>
                </View>
              ))}
              {isTyping && (
                <View style={styles.botBubbleContainer}>
                  <View style={styles.avatarContainer}>
                    <Image source={require('@/assets/images/nova-6 (kopia).png')} style={styles.avatar} />
                  </View>
                  <View style={[styles.messageBubble, styles.botBubble]}>
                    <Text style={styles.messageText}>Nova is typing...</Text>
                  </View>
                </View>
              )}
            </ScrollView>
            </View>
          
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            style={styles.input}
          />
          <View style={styles.sendButtonContainer}>
            <Pressable
              onPress={handleSend}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.sendButton,
                pressed && { opacity: 0.7 },
                isLoading && { opacity: 0.4 },
              ]}
            >
              <FontAwesome name="send" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  chatArea: {
    flex: 1,
    marginBottom: 8,
  },
  chatContent: {
    paddingHorizontal: 12, 
    paddingTop: 16, 
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 58, // Ensure there is space for the keyboard
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
  },
  messageText: {
    color: 'black',
    fontSize: 16,
    padding: 10,
  },
  userBubble: {
    backgroundColor: 'rgb(127, 183, 228)',
    borderRadius: 20,
    maxWidth: '70%',
  },
  botBubble: {
    backgroundColor: 'rgb(213, 213, 213)',
    borderRadius: 20,
    maxWidth: '70%',
  },
  userBubbleContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  botBubbleContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  sendButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loading: {
    marginTop: 8,
  },
  messageBubbleContainer: {
    width: '100%',
  },
  messageBubble: {
    padding: 1,
    borderRadius: 20,
  },
  header: {
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgb(255, 255, 255)', // Light neutral tone; you can adjust
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#132D3A', // Deep blue/gray to match your palette
    fontFamily: 'Poppins_600SemiBold', // Optional: use your custom font
  },
  sendButton: {
    width: 37,
    height: 35,
    borderRadius: 20,
    backgroundColor: 'rgb(161, 161, 161)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 6,
    borderWidth: 1, 
    borderColor: 'rgb(161, 161, 161)',
    marginBottom: 3
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
