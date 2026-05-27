import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AppContext } from '../App';

export default function HomeScreen() {
  const { dbData, currentUserName } = useContext(AppContext);

  // ① 自分のデータだけを抽出
  const myHistory = dbData.history.filter(item => item.name === currentUserName);

  // ② 総練習距離の計算
  const totalDistance = myHistory.reduce((sum, item) => sum + item.distance, 0);

  // ③ 週間距離の計算 (直近7日間のデータを集計するロジック例)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyDistance = myHistory
    .filter(item => new Date(item.date) >= oneWeekAgo)
    .reduce((sum, item) => sum + item.distance, 0);

  // ④ カレンダーへのマーキング用オブジェクトの生成
  const markedDates = {};
  myHistory.forEach(item => {
    // 日付フォーマットを yyyy-mm-dd に整形してドットをつける
    const formattedDate = formatDateToYYYYMMDD(item.date); 
    markedDates[formattedDate] = { marked: true, dotColor: '#1e88e5' };
  });

  return (
    <ScrollView style={yourRRAppStyles.container}>
      {/* 総距離・週間距離の表示（デザインはRRアプリのものをそのまま使用） */}
      <Text>総練習距離: {totalDistance} km</Text>
      <Text>週間距離: {weeklyDistance} km</Text>

      {/* カレンダーコンポーネントに markedDates を渡す */}
      {/* <Calendar markedDates={markedDates} /> */}

      {/* 目標カウントダウンロジック（総距離から目標値を引くなど） */}
    </ScrollView>
  );
}