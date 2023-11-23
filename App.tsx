// App.tsx
import { StatusBar, StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';

import Home from './src/screens/Home';
import { myStore } from './src/redux/myStore';

const App = () => {
  const [temp, setTemp] = useState(false);
  const [colors, setColors] = useState({})

  return (
      <Provider store={myStore}>
        <View style={{flex: 1}}>
          <Home />
        </View>
      </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
