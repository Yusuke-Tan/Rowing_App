import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContext } from '../App';

export default function RecordScreen() {
  const { dbData, currentUserName } = useContext(AppContext);
  const [distance, setDistance] = useState('');

  // 削除処理のダミー（必要に応じて実装を追加）
  const handleDelete = (id) => {
    console.log("Delete ID:", id);
  };

  return (
    <View style={styles.container}>
      {/* 双方向で見られるタイムラインUI */}
      <FlatList
        data={dbData.history}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.dateText}>{item.date} - {item.name} ({item.group})</Text>
            <Text style={styles.distanceText}>{item.distance} km</Text>
            
            {/* 自分の記録だった場合のみ削除ボタンを表示 */}
            {item.name === currentUserName && (
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>削除</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

// ここにスタイル（デザイン）を定義します
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  distanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e88e5',
  },
  deleteButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  }
});