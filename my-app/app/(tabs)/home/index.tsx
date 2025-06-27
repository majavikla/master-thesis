import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Dimensions, ScrollView, View, Pressable, Image, Platform, Button, Text, Animated } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSnus } from '@/context/snusContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { achievements } from './achievements';
import Svg, { Circle } from 'react-native-svg';
import { getStoredGoals } from '@/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const screenWidth = Dimensions.get('window').width;

function getLast7DaysLabels(): string[] {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push(dayjs().subtract(i, 'day').format('dd'));
  }
  return days;
}

const HalfDonutProgress = ({ progress }: { progress: number }) => {
  const radius = 50;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <View style={styles.chartCard}>
      <Svg height={radius * 1} width={radius * 2}>
        <Circle
          stroke="#ddd"
          fill="transparent"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={0} // Background circle
          rotation="180"
          originX={radius}
          originY={radius}
        />
        <Circle
          stroke="rgba(255,161,192,255)" // Progress color
          fill="transparent"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          rotation="180" // Start from top
          originX={radius}
          originY={radius}
        />
      </Svg>
      <Text style={styles.circleText}>{Math.round(progress * 100)}% Completed</Text>
    </View>
  );
};

export default function HomeScreen() {
  const { dailySnusData, updateDailySnusData, snusUpdateVersion } = useSnus();
  console.log(dailySnusData)
  const [userName, setUserName] = useState('');
  const [moneySaved, setMoneySaved] = useState(0);
  const [earnedAchievements, setEarnedAchievements] = useState(0);
  const [randomGoal, setRandomGoal] = useState<{ title: string } | null>(null);
  const [goals, setGoals] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [snusAvoided, setSnusAvoided] = useState(0);

  const [randomHealthFact, setRandomHealthFact] = useState<string | null>(null);

  const withdrawalFacts = [
    "Within just 4 hours of quitting snus, nicotine cravings can begin as your body starts adjusting.",
    "After 8 to 24 hours without snus, cravings intensify and symptoms like irritability and increased appetite often appear.",
    "Cravings typically peak around 24 hours after quitting",
    "By the second day, withdrawal symptoms such as headaches, anxiety, and restlessness are often at their worst.",
    "Around day 3, all nicotine has left your body",
    "Within the first week, cravings begin to ease and your energy levels may start to rise again.",
    "By 2 to 4 weeks, your mood, focus, and sleep patterns begin to stabilize as your brain adapts to life without nicotine.",
  ];

  const healingFacts = [
    "Just 24 hours after quitting snus, your risk of heart-related issues begins to decrease.",
    "Within 2 to 3 days, your senses of taste and smell often start to sharpen noticeably.",
    "One week after quitting, your blood circulation improves, making physical activity feel easier.",
    "After two weeks, your mouth starts to heal — inflammation and small lesions begin to reverse.",
    "After one month, gum health improves significantly, with less bleeding and inflammation.",
  ];
  
  const damageFacts = [
    "Even within days or weeks of using snus, nicotine addiction can start to take hold.",
    "Snus can quickly cause gum irritation and inflammation where the pouch is placed.",
    "By one month of use, the gum line may begin to recede, especially at the contact point.",
    "Nicotine from snus puts extra stress on your heart and blood vessels even early in use.",
    "Many flavored snus products increase the risk of cavities by altering your saliva and pH.",
    "Using snus regularly for a year or more can raise your risk of developing type 2 diabetes.",
  ];
  
  const healthFacts = [...withdrawalFacts, ...healingFacts, ...damageFacts];


  const progress = earnedAchievements / achievements.length;

  const chartData = {
    labels: getLast7DaysLabels(),
    datasets: [
      {
        data: dailySnusData,
        color: () => '#b89dcf',
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgb(184, 157, 207)`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#a06cd5',
    },
    propsForBackgroundLines: {
      stroke: 'transparent',
    },
    propsForLabels: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 13,
    },
  };

  useFocusEffect(
    useCallback(() => {
      const fetchEverything = async () => {
        const storedName = await AsyncStorage.getItem('userName');
        if (storedName) setUserName(storedName);
  
        const snusPriceString = await AsyncStorage.getItem('snusPrice');
        const snusPrice = snusPriceString ? parseFloat(snusPriceString) : 0;
        const pouchPrice = snusPrice / 20;
  
        const updatedData: number[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
          const value = await AsyncStorage.getItem(`snus-${date}`);
          updatedData.push(value ? parseInt(value) : 0);
        }
        updateDailySnusData(updatedData);
  
        let saved = 0;
        let avoided = 0;
        for (let i = 1; i < updatedData.length; i++) {
          const yesterday = updatedData[i - 1];
          const today = updatedData[i];
          if (yesterday > today) {
            const diff = yesterday - today;
            saved += diff * pouchPrice;
            avoided += diff;
          }
        }
        setMoneySaved(saved);
        setSnusAvoided(avoided);
  
        const earnedCount = achievements.filter((a) => a.earned).length;
        setEarnedAchievements(earnedCount);
  
        const allGoals = await getStoredGoals();
        setGoals(allGoals);
        const unfinishedGoals = allGoals.filter((g) => !g.completed);
        setRandomGoal(unfinishedGoals.length > 0
          ? unfinishedGoals[Math.floor(Math.random() * unfinishedGoals.length)]
          : null);
      };
  
      fetchEverything();
    }, [snusUpdateVersion])
  );


  const completedCount = goals.filter((g) => g.completed).length;

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * healthFacts.length);
    setRandomHealthFact(healthFacts[randomIndex]);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Text style={styles.titletest}>Welcome, {userName || 'Friend'}!</Text>
          <Pressable onPress={() => router.push('/home/avatar')} style={styles.button}>
            <FontAwesome name="user-circle-o" size={28} color="#ccc" style={styles.avatar} />
          </Pressable>
        </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.subtitletest}>Snus use this week</Text>
    
      <View style={styles.chartContainer}>
        <View style={styles.chartCardtest}>
          <LineChart
              key={snusUpdateVersion}
              data={chartData}
              width={screenWidth - 46}
              height={150}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              fromZero
          />
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.subtitletest}>My progress</Text>
        </View>
        <View style={styles.goalRow}>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="money" size={30} color="#81C784" style={{ marginRight: 9 }} />
          <Text style={{ fontSize: 13, fontFamily: 'Poppins_400Regular'}}>Money saved:</Text>
          </View>
          <Text style={{ fontSize: 25, fontFamily: 'Poppins_600SemiBold', color: 'rgba(74,74,74,255)'}}>
              {moneySaved > 0
                ? `${moneySaved.toFixed(1)} kr `
                : 'No savings yet, keep going!'}
              </Text>
        </View>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="ban" size={28} color="rgb(251,92,92)" style={{ marginRight: 9 }} />
          <Text style={{ fontSize: 13, fontFamily: 'Poppins_400Regular'}}>Snus avoided:</Text>
          </View>
          <Text style={{ fontSize: 25, fontFamily: 'Poppins_600SemiBold', color: 'rgba(74,74,74,255)'}}>
            {snusAvoided > 0 ? `${snusAvoided}` : '-'}
          </Text>
        </View>
        </View>
      </View>


       <View style={styles.sectionContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.subtitletest}>My goals</Text>
          <Pressable onPress={() => router.push('/home/goals')} style={styles.button}>
            <Text style={styles.buttonText}>See all {'>'}</Text>
          </Pressable>
        </View>

        {randomGoal && (
        <View style={styles.chartCard}>
          <View style={styles.goalRow}>
            <View style={styles.iconColumn}>
              <FontAwesome name="check-square-o" size={30} color='rgba(99, 185, 172, 255)' style={{ marginRight: 9, marginLeft: 10 }} />
              <Text style={{fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: 'rgba(99, 185, 172, 255)'}}>
               {completedCount} / {goals.length}</Text>
               <Text style={{fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: 'rgba(99, 185, 172, 255)'}}>
                completed</Text>
            </View>
          <View style={styles.textColumn}>
            <Text style={{fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: 'rgba(74,74,74,255)'}}> Next goal:</Text>            
            <Text style={styles.goalTitle}>{randomGoal.title}</Text>
          </View>
          </View>
        </View>

        )}           

          <Pressable style={styles.chartCard} onPress={() => router.push('/home/new-goal')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4  }}>
              <FontAwesome name="plus" size={25} color="#75808b" style={{ marginRight: 9}} />
              <Text style={{ fontSize: 15, fontFamily: 'Poppins_400Regular'}}>
                Create a new goal 
              </Text>
            </View>
          </Pressable>  
      </View>

      <View style={styles.sectionContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.subtitletest}>Achievements</Text>
          <Pressable onPress={() => router.push('/home/achievements')} style={styles.button}>
            <Text style={styles.buttonText}>See all {'>'}</Text>
          </Pressable>
        </View>
        <HalfDonutProgress progress={progress} />  
      </View>

    
        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={styles.subtitletest}>My health</Text>
            <Pressable onPress={() => router.push('./health')} style={styles.button}>
              <Text style={styles.buttonText}>See all {'>'}</Text>
            </Pressable>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.goalRow}>
              <View style={styles.iconColumn}>
                <FontAwesome name="heartbeat" size={35} color="rgba(209,183,233,255)" style={{ marginRight: 5, marginLeft: 10 }} />
                
              </View>
            <View style={styles.textColumn}>
                <Text style={{fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: 'rgba(74,74,74,255)'}}>Did you know?</Text>            
                <Text style={styles.goalTitle}>
                  {randomHealthFact ? randomHealthFact : ''}
                </Text>
            </View>
          </View>
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button
            title="Go to Onboarding"
            onPress={() => router.push('/onboarding')}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 12, 
  },
  avatar: {
    width: 35,
    height: 40,
    marginRight: 15, // Space between avatar and message bubble
    borderRadius: 25, // Make the avatar circular
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12, 
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#ffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    width: '48%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  text: {
    fontSize: 16,
    color: 'rgba(74,74,74,255)',
    marginTop: 12,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  chartContainer: {
    marginBottom: 24,
  },
  chart: {
    marginVertical: 3,
    borderRadius: 16,
    paddingBottom: 3,
  },
  chartCard: {
    backgroundColor: '#ffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  chartCardtest: {
    backgroundColor: '#ffff',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  titletest: {
    fontSize: 30,
    color: 'rgba(74,74,74,255)',
    marginBottom: 22,
    paddingLeft: 22, 
    paddingTop: 8,
    fontFamily: 'Poppins_700Bold',
    },
  subtitletest: {
    fontSize: 21,
    color: 'rgba(74,74,74,255)',
    paddingBottom: 2,
    fontFamily: 'Poppins_600SemiBold',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  circleText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff', // Change to your desired color
    borderRadius: 20,
    marginLeft: 10, // Adds spacing to the left of the button
  },
  buttonText: {
    color: 'rgb(19, 45, 58)',
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    fontWeight: 'bold',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4
  },
  iconColumn: {
    alignItems: 'center',
    marginRight: 16,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  goalProgress: {
    fontSize: 14,
    color: '#75808b',
    marginTop: 4,
    fontFamily: 'Poppins_600SemiBold',
  },
  goalTitle: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
    marginTop: 1,
    marginLeft: 1,
  },
});
             