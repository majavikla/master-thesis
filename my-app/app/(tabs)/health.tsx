import { StyleSheet, Image, Platform, ScrollView, View, Text, Pressable,
  } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter  } from 'expo-router';
import React, { useEffect, useState } from 'react';

const withdrawalTimeline = [
  { time: '0-4 hours', text: 'Nicotine cravings begin' },
  { time: '8-24 hours', text: 'Cravings intensify - appetite and irritability increase' },
  { time: '1 day', text: 'Cravings are at its peak - symptoms such as irritability, trouble sleeping, and anxiety are at its high' },
  { time: '2 days', text: 'Intense withdrawal symptoms such as headaches and anxiety' },
  { time: '3 days', text: 'Nicotine fully leaves your body' },
  { time: '3-7 days', text: 'Cravings reduce and energy levels are improving' },
  { time: '2-4 weeks', text: 'Mood, concentration, and sleep begin to normalize' },
];

const healingTimeline = [
  { time: '24h', text: 'Risk of acute cardiovascular events begins to decrease' },
  { time: '2-3 days', text: 'Taste and smell begin to improve' },
  { time: '1 week', text: 'Blood circulation improves' },
  { time: '2 weeks', text: 'Oral tissues begin healing: minor lesions or gum inflammation may start to reverse' },
  { time: '1 month', text: 'Improved gum health: less bleeding, inflammation, and bacterial load' },
];

const snusDamageTimeline = [
  { time: 'Days to Weeks', text: 'Nicotine addiction begins' },
  { time: 'Days to Weeks', text: 'Early signs of gum irritation and mucosal inflammation' },
  { time: '1 month', text: 'Gum recession at the placement site of the pouch' },
  { time: '1 month', text: 'Elevated stress on the cardiovascular system' },
  { time: '1 month', text: 'Increased risk of dental caries due to changes in saliva pH and sugar content in flavored snus' },
  { time: '1 year', text: 'Higher risk of insulin resistance and type 2 diabetes' },

];

export default function HealthScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>  
        <Pressable onPress={() => router.push('/(tabs)/home/avatar') } style={styles.helpIcon}>
            <FontAwesome name="question-circle-o" size={28} color='#ccc' style={{ marginRight: 5 }} />
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 1}}>
          <Text style={styles.title}>Your personal health journey</Text>
          
      </View>
 
      

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.subtitletest}>Here's how your body is healing from snus</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timelineScroll}>
            {healingTimeline.map((item, index) => (
            <View key={index} style={[styles.timelineCard, { backgroundColor: '#d1e7dd' }]}>
              <Text style={styles.timeLabel}>{item.time}</Text>
              <Text style={styles.description}>{item.text}</Text>
            </View>
            ))}
          </ScrollView>  
        </View>


        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.subtitletest}>How snus can affect your health</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timelineScroll}>
            {snusDamageTimeline.map((item, index) => (
            <View key={index} style={[styles.timelineCard, { backgroundColor: '#f8d7da' }]}>
              <Text style={styles.timeLabel}>{item.time}</Text>
              <Text style={styles.description}>{item.text}</Text>
            </View>
            ))}
          </ScrollView>  
        </View>


        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.subtitletest}>What to expect as your body adjusts</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timelineScroll}>
            {withdrawalTimeline.map((item, index) => (
            <View key={index} style={[styles.timelineCard, { backgroundColor: '#fff3cd' }]}>
              <Text style={styles.timeLabel}>{item.time}</Text>
              <Text style={styles.description}>{item.text}</Text>
            </View>
            ))}
          </ScrollView>  
        </View>
        
      
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  container: { 
    padding: 1 
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff', // Change to your desired color
    borderRadius: 20,
    marginLeft: 10, // Adds spacing to the left of the button
  },
  subtitletest: {
    fontSize: 21,
    color: 'rgba(74,74,74,255)',
    paddingBottom: 2,
    fontFamily: 'Poppins_600SemiBold',
  },
  title: {
    fontSize: 28,
    color: 'rgba(209,183,233,255)',
    fontWeight: 'bold',
    paddingBottom: 10,
    paddingLeft: 6, 
    fontFamily: 'Poppins_700Bold',
  },
  progressText: {
    color: '#4A90E2',
    fontSize: 16,
    marginBottom: 24,
  },
  timeline: {
    paddingLeft: 10,
  },
  bulletLineContainer: {
    alignItems: 'center',
    width: 30,
  },
  bullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#d1d1d1',
    marginTop: 3,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#d1d1d1',
    marginTop: 2,
  },
  milestoneContent: {
    flex: 1,
    paddingLeft: 10,
  },
  milestoneText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#F47EBB',
  },
  percentage: {
    marginTop: 4,
    fontSize: 12,
    color: '#4A90E2',
  },
  progress: {
    fontSize: 16,
    color: '#4A90E2',
    fontFamily: 'Poppins_400Regular'
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
  cardPositive: {
    backgroundColor: '#dff5e2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardNegative: {
    backgroundColor: '#ffe0e0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d2b33',
  },
  cardContent: {
    marginTop: 16,
  },
  item: {
    fontSize: 15,
    paddingVertical: 4,
    color: '#333',
  },
  timelineScroll: {
    marginTop: 10,
    paddingLeft: 10,
  },
  timelineCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    marginTop: 4,
    width: 200,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  timeLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#132d3a',
  },
  description: {
    fontSize: 14,
    color: '#444',
  },
  helpIcon: {
    position: 'absolute',
    top: 40, // adjust based on your header height or status bar
    right: 16,
    padding: 8,
  },

});

//<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingLeft: 4  }}>
//<FontAwesome name="heartbeat" size={20} color="#4A90E2" style={{ marginRight: 6 }} />
//<Text style={styles.progress}>X / {healthMilestones.length}</Text>
//</View>
//