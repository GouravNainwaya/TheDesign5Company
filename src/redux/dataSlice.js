
// dataSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  dataArray: [],
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setDataArray: (state, action) => {
      state.dataArray = action.payload;
    },
    pushToDataArray: (state, action) => {
      state.dataArray.push(action.payload);
      // Update AsyncStorage
      AsyncStorage.setItem('yourKey', JSON.stringify(state.dataArray));
    },
    clearToDataArray: (state, action) => {
      state.dataArray = []
    },
  },
});

export const { setDataArray, pushToDataArray , clearToDataArray} = dataSlice.actions;

// Load data from AsyncStorage on initial load
export const loadAsyncData = () => async (dispatch) => {
  try {
    const storedData = await AsyncStorage.getItem('yourKey');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      dispatch(setDataArray(parsedData));
    }
  } catch (error) {
    console.error('Error loading data from AsyncStorage', error);
  }
};

export const selectDataArray = (state) => state.posts.dataArray;
export default dataSlice.reducer;
