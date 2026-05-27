import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { AppContext } from '../App';

export default function RecordScreen() {
  const { dbData, fetchData, currentUserName, currentUserGroup, API_URL } = useContext(AppContext);
  const [distance, setDistance] = useState('');
  const [loading, setLoading] = useState(false);

  // --- 記録の送信処理 ---
  const handleSubmit = async () => {
    if (!distance) {
      Alert.alert('エラー', '距離を入力してください');
      return;
    }

    setLoading(true);

    const postData = {
      action: 'create',
      name: currentUserName,
      date: new Date().toLocaleString('ja-JP'),
      group: currentUserGroup,
      distance: distance
    };

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(postData)
      });
      setDistance(''); // 入力欄を空にする
      Keyboard.dismiss(); // キーボードを閉じる
      fetchData(); // 最新のデータを再読み込み
    } catch (error) {
      console.error(error);
      Alert.alert('エラー', '記録の送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // --- 記録の削除処理 ---
  const handleDelete = (id) => {
    Alert.alert(
      "削除の確認",
      "本当にこの記録を削除しますか？",
      [
        { text: "キャンセル", style: "cancel" },
        { 
          text: "削除", 
          style: "destructive",
          onPress: async () => {
            try {
              await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ action: 'delete', name: currentUserName, id: id })
              });
              fetchData(); // 最新のデータを再読み込み
            } catch (error) {
              Alert.alert('エラー', '削除できませんでした');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* --- 記録入力フォーム --- */}
      <View style={styles.formCard}>
        <Text style={styles.label}>練習距離 (km)</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="例: 12.5"
            keyboardType="numeric"
            value={distance}
            onChangeText={setDistance}
          />
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>記録する</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* --- 双方向で見られるタイムラインUI --- */}
      <Text style={styles.sectionTitle}>みんなの記録</Text>
      <FlatList
        data={dbData.history}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Text style={styles.dateText}>{item.date}</Text>
              <Text style={styles.nameText}>{item.name} ({item.group})</Text>
            </View>
            <View style={styles.historyBody}>
              <Text style={styles.distanceText}>{item.distance} km</Text>
              
              {/* 自分の記録だった場合のみ削除ボタンを表示 */}
              {item.name === currentUserName && (
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteText}>削除</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

// デザイン設定
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  
  // フォーム部分のデザイン
  formCard: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', fontSize: 16, marginRight: 10 },
  button: { backgroundColor: '#1e88e5', padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', width: 100, height: 50 },
  buttonDisabled: { backgroundColor: '#aaa' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  
  // 履歴部分のデザイン
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 10, marginLeft: 5 },
  historyCard: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#1e88e5', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  dateText: { fontSize: 12, color: '#999' },
  nameText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  historyBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  distanceText: { fontSize: 20, fontWeight: 'bold', color: '#1e88e5' },
  deleteButton: { backgroundColor: '#ffebee', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 15 },
  deleteText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 12 }
});