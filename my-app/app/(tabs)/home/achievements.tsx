import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export const achievements = [
  { id: '1', title: '1 day without snus', icon: require('@/assets/images/icon-unlocked.png'), iconName: 'calendar', earned: true },
  { id: '2', title: '3 days without snus', icon: require('@/assets/images/icon-unlocked.png'), iconName: 'calendar', earned: true },
  { id: '3', title: 'Reduced snus intake 3 days in a row', icon: require('@/assets/images/icon-test10.png'), iconName: 'sort-amount-desc', earned: false },
  { id: '4', title: '1 month snus free', icon: require('@/assets/images/icon-test10.png'), iconName: 'calendar', earned: false },
  { id: '5', title: 'Had 5 conversations with the Chatbot', icon: require('@/assets/images/icon-unlocked.png'), iconName: 'comments-o',earned: true },
  { id: '6', title: 'Used the app every day for 30 days', icon: require('@/assets/images/icon-test10.png'), iconName: 'calendar', earned: false },
  { id: '7', title: 'Used the app every day for 7 days', icon: require('@/assets/images/icon-test10.png'), iconName: 'calendar', earned: false },
  { id: '8', title: 'Used the app every day for 3 days', icon: require('@/assets/images/icon-unlocked.png'), iconName: 'calendar', earned: true },
  { id: '9', title: 'Had 1 conversation with the Chatbot', icon: require('@/assets/images/icon-unlocked.png'), iconName: 'comments-o', earned: true },
  { id: '10', title: 'Logged a week of snus use', icon: require('@/assets/images/icon-unlocked.png'), iconName: 'edit', earned: true },
  { id: '11', title: 'Reduced snus intake 2 days in a row', icon: require('@/assets/images/icon-test10.png'), iconName: 'sort-amount-desc', earned: false },
  { id: '12', title: 'Reduced snus intake 7 days in a row', icon: require('@/assets/images/icon-test10.png'), iconName: 'sort-amount-desc', earned: false },
  { id: '13', title: 'Started your journey to quit snus', icon: require('@/assets/images/icon-unlocked.png'), iconName: 'leaf', earned: true },
];

export default function AchievementsScreen() {
  const router = useRouter();
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>  
      </View>
      <Text style={styles.title}>Achievements</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, paddingLeft: 4  }}>
        <FontAwesome name="trophy" size={20} color="#81C784" style={{ marginRight: 6 }} />
        <Text style={styles.progress}>{earnedCount} / {achievements.length}</Text>
      </View>
    
    <FlatList
      data={achievements}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'center', gap: 80, marginBottom: 16 }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      renderItem={({ item }) => (
      <View style={styles.trophyCard}>
        <View style={styles.trophyImageWrapper}>
        <Image
        source={item.icon}
        style={[
          styles.trophyIcon,
          !item.earned && { tintColor: '#ccc', opacity: 0.4 },
        ]}/>
        {item.iconName && (
        <FontAwesome
          name={item.iconName as any}
          size={50}
          color={item.earned ? 'rgb(244, 166, 166)' : '#aaa'}
          style={styles.overlayIcon}/>)}
      </View>
      <Text style={[styles.trophyTitle, !item.earned && styles.lockedText]}>
        {item.title}
      </Text>
      
    </View>
    )}/>

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
    flexDirection: 'row',
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
    height: 70,
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
    color: '#81C784',
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
  container: { 
    padding: 1
  },
  achievementsText: {
    fontSize: 16,
    color: '#333',
  },
  progress: {
    fontSize: 16,
    color: '#81C784',
    fontFamily: 'Poppins_600SemiBold'
  },
  earnedText: {
    color: 'rgb(68, 68, 68)',
    fontWeight: '600',
  },
  lockedText: {
    color: '#999',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4
  },
  card1: {
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
    left: '30%',
    zIndex: 1,
  },
});

