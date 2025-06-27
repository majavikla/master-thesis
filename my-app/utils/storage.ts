import AsyncStorage from '@react-native-async-storage/async-storage';

export const GOALS_KEY = 'user_goals';

// Load all goals
export async function getStoredGoals(): Promise<
  { id: string; title: string; completed: boolean; icon: any; iconName: string }[]
> {
  try {
    const stored = await AsyncStorage.getItem(GOALS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load goals from storage', error);
    return [];
  }
}

// Save a new goal
export async function saveGoal(goal: { id: string; title: string; completed: boolean; icon: string;
  iconName: string; }) {
  try {
    const existingGoals = await getStoredGoals();
    const updatedGoals = [...existingGoals, goal];
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));
  } catch (error) {
    console.error('Failed to save goal to storage', error);
  }
}

// Optional: Clear all goals (for testing or reset)
export async function clearGoals() {
  try {
    await AsyncStorage.removeItem(GOALS_KEY);
  } catch (error) {
    console.error('Failed to clear goals', error);
  }
}