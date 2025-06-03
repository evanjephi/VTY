import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootLayoutNav from './RootLayoutNav'; // or your main navigator

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootLayoutNav />
    </GestureHandlerRootView>
  );
}
