import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';

export default function OnboardingWelcomeScreen() {
  const router = useRouter();
  const [startTransition, setStartTransition] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleLetsGo = () => {
    setStartTransition(true);
    cloudOpacities.forEach((opacity, i) => {
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 1000 });
      }, i * 100); 
    });
  
    setTimeout(() => {
      router.push('/onboarding/nova');
    }, 1500); 
  };

  const cloudOffsets = [
    useSharedValue(-150),
    useSharedValue(-150), 
    useSharedValue(-150),
    useSharedValue(-150),
    useSharedValue(-150),
    useSharedValue(150), 
    useSharedValue(150),
    useSharedValue(150),
    useSharedValue(150),
    useSharedValue(150),
    useSharedValue(150),
  ];

  const cloudHeights = [570, 470, 410, 130, 230, 190, 280, 80, 160, 520, 620];
  const cloudHorizontalOffsets = [-100, -140, -70, -80, 10, -140, 100, 160, 180, 140, 90];
  const cloudOpacities = cloudOffsets.map(() => useSharedValue(1)); 


  useEffect(() => {
    cloudOffsets.forEach((offset, i) => {
      const direction = i < 3 ? -150 : 150;
      offset.value = direction;
      setTimeout(() => {
        offset.value = withTiming(0, { duration: 800 });
      }, i * 200); 
    });
    
    const timer4 = setTimeout(() => {
      setShowButton(true);
    }, 9500);

    return () => {
      clearTimeout(timer4);
    };
  }, []);

  const animatedStyles = cloudOffsets.map((offset, i) =>
    useAnimatedStyle(() => ({
      transform: [
        { translateX: offset.value + cloudHorizontalOffsets[i] }, 
      ],
      opacity: cloudOpacities[i].value,
      position: 'absolute',
      top: cloudHeights[i],
      left: 150,
    }))
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cloudLayer}>
          {animatedStyles.map((style, i) => (
          <Animated.View key={i} style={style}>
            <FontAwesome
              name="cloud"
              size={75 + (i % 2) * 10}
              color="white"
            />
          </Animated.View>
          ))}
        </View>

      <View style={styles.container}>
        <View style={styles.appandappname}>
          <Image source={require('@/assets/images/packoff-removebg-preview.png')} style={styles.logo} />
          <Text style={styles.appname}>PackOff</Text>
        </View>
        
        <View style={styles.middletext}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>Your journey to a healthier life starts now.</Text>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleLetsGo}>
          <Text style={styles.buttonText}>Let's go!</Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(186, 222, 255)',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(186, 222, 255)',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 44,
    fontFamily: 'Poppins_700Bold',
  },
  appname: {
    fontSize: 29,
    fontFamily: 'Poppins_600SemiBold',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 200,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold'
  },
  button: { 
    backgroundColor: '#fff',
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
  logo: {
    width: 90,
    height: 80,
    marginRight: 10,
  },
  appandappname: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  middletext: {
    alignItems: 'center',
  },
  cloudLayer: {
    ...StyleSheet.absoluteFillObject, 
    zIndex: 1, 
    pointerEvents: 'none',
  },
});
