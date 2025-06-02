import Constants from 'expo-constants';
import twelvedata from "twelvedata";

const client = twelvedata({
  key: Constants.expoConfig?.extra?.TWELVE_DATA_API_KEY,
});

const params = {
  symbol: "AAPL",
  interval: "1min",
  outputsize: 5,
};

client
  .timeSeries(params)
  .then(data => console.log('Time Series:', data))
  .catch(error => console.error('Error:', error));
