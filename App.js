import React, { createContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';

// スクリーンコンポーネントのインポート
import HomeScreen from './screens/HomeScreen';
import RecordScreen from './screens/RecordScreen';

// 全画面で共有するためのContextを作成
export const AppContext = createContext();

const Tab = createBottomTabNavigator();

export default function App() {
  // 前回設定したGASのURL
  const API_URL = 'https://script.google.com/macros/s/AKfycbzBVccaoVEuS2F9MHCx4zhIn_-71KqNHjxSCiDgzFf6QvLDSgKwZx9R4CeW4WWdeVBhSA/exec';
  
  // アプリを利用するユーザーの情報（設定画面などから変更できるようにすると便利です）
  const [currentUserName, setCurrentUserName] = useState('ユーザー名'); 
  const [currentUserGroup, setCurrentUserGroup] = useState('A'); // 所属グループ(A, B, C)

  // GASから取得したデータを格納する箱（ランキング、全員の履歴）
  const [dbData, setDbData] = useState({ groupRanking: [], userRanking: [], history: [] });
  const [loading, setLoading] = useState(false);

  // データをGASから取得する共通関数（起動時や引っ張り更新時に呼び出す）
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      setDbData(json);
    } catch (error) {
      console.error(error);
      Alert.alert('同期エラー', '最新の練習記録を取得できませんでした');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    // ContextProviderで全体を包み、配下のスクリーンでデータや関数を使えるようにする
    <AppContext.Provider value={{ dbData, fetchData, loading, currentUserName, currentUserGroup, API_URL }}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#1e88e5' },
            headerTintColor: '#fff',
            tabBarActiveTintColor: '#1e88e5',
            tabBarInactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'ホーム',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Record"
            component={RecordScreen}
            options={{
              title: '練習記録',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="clipboard-list" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}