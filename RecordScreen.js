import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { AppContext } from '../App'; // App.jsからContextをインポート

export default function RecordScreen() {
  // App.jsで管理しているデータや関数を呼び出す
  const { dbData, fetchData, currentUserName, currentUserGroup, API_URL } = useContext(AppContext);
  const [distance, setDistance] = useState('');

  // 送信処理や削除処理のロジックをここに配置（前回のコードと同様）
  // 送信時は body: JSON.stringify({ action: 'create', name: currentUserName, ... }) を使用

  return (
    <View style={yourRRAppStyles.container}>
      {/* RRアプリ既存の記録フォームUI */}
      
      {/* 双方向で見られるタイムラインUI */}
      <FlatList
        data={dbData.history} // 全員の履歴データ
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={yourRRAppStyles.card}>
            <Text>{item.date} - {item.name} ({item.group})</Text>
            <Text>{item.distance} km</Text>
            
            {/* 自分の記録だった場合のみ削除ボタンを表示 */}
            {item.name === currentUserName && (
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={{color: 'red'}}>削除</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}