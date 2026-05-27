import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AppContext } from '../App';

export default function HomeScreen() {
  const { dbData, currentUserName } = useContext(AppContext);

  // ① 自分のデータだけを抽出
  const myHistory = dbData.history.filter(item => item.name === currentUserName);

  // ② 総練習距離の計算
  const totalDistance = myHistory.reduce((sum, item) => sum + item.distance, 0);

  // ③ 週間距離の計算
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyDistance = myHistory
    .filter(item => new Date(item.date) >= oneWeekAgo)
    .reduce((sum, item) => sum + item.distance, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>総練習距離</Text>
        <Text style={styles.value}>{totalDistance} km</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>週間距離</Text>
        <Text style={styles.value}>{weeklyDistance} km</Text>
      </View>
    </ScrollView>
  );
}

// ここにスタイル（デザイン）を定義します
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e88e5',
  }
});