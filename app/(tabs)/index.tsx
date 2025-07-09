import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';

const API_KEY = Constants.expoConfig?.extra?.TWELVE_DATA_API_KEY || '';
const DEFAULT_SYMBOLS = ['GBP/USD', 'BTC/USD', 'EUR/USD', 'ETH/USD'];
WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [prices, setPrices] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [allSymbols, setAllSymbols] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri({
        scheme: 'your-app-scheme', // match your app.json scheme
      }),
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );

  // Load favorites 
  useEffect(() => {
    AsyncStorage.getItem('favorites').then(data => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

 
  useEffect(() => {
    fetchPrices(DEFAULT_SYMBOLS);
  }, []);

  // Fetch all symbols from API
  useEffect(() => {
    const fetchAllSymbols = async () => {
      try {
        const url = `https://api.twelvedata.com/symbol_search?symbol=&apikey=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === "error") {
          console.error("API Error:", data.message);
          setAllSymbols([]);
          return;
        }

        const allSymbols = (data.data || []).map((item: any) => item.symbol);
        setAllSymbols(allSymbols);
      } catch (e) {
        console.error('Error fetching all symbols:', e);
        setAllSymbols([]);
      }
    };

    fetchAllSymbols();
  }, []);

  // Fetch prices for given symbols
  const fetchPrices = async (symbols: string[]) => {
    if (!symbols.length) return;

    setLoading(true);
    try {
      // Remove slashes for API format 
      // and join with commas
      const joined = symbols.map(s => s.replace('/', '')).join(',');
      const url = `https://api.twelvedata.com/price?symbol=${joined}&apikey=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'error') {
        console.error("API Error:", data.message);
      } else {
        // data can be an object with keys for symbols or a single symbol object
        if (symbols.length === 1 && data.price) {
          setPrices(prev => ({ ...prev, [symbols[0].replace('/', '')]: data }));
        } else {
          setPrices(prev => ({ ...prev, ...data }));
        }
      }
    } catch (e) {
      console.error('Error fetching prices:', e);
    }
    setLoading(false);
  };

  // Handle search
  const onSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const url = `https://api.twelvedata.com/symbol_search?symbol=${search.trim()}&apikey=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      let found = data.data || [];

      if (!found.length && allSymbols.length) {
        // fallback to filter allSymbols if API returns no data
        found = allSymbols
          .filter(s => s.toLowerCase().includes(search.toLowerCase()))
          .map(s => ({ symbol: s }));
      }

      setResults(found);
      fetchPrices(found.map((item: any) => item.symbol));
    } catch (e) {
      console.error('Search error:', e);
    }
    setLoading(false);
  };

  // Toggle favorite symbols and save to AsyncStorage
  const toggleFavorite = async (symbol: string) => {
    let updated: string[];
    if (favorites.includes(symbol)) {
      updated = favorites.filter(s => s !== symbol);
    } else {
      updated = [...favorites, symbol];
    }
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  // Fetch chart data for selected symbol
  const fetchChart = async (symbol: string) => {
    setChartLoading(true);
    setSelectedSymbol(symbol);
    try {
      const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=1h&outputsize=24&apikey=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'error') {
        console.error('Chart API error:', data.message);
        setChartData([]);
      } else {
        setChartData(
          (data.values || []).reverse().map((v: any) => ({
            timestamp: new Date(v.datetime).getTime(),
            value: parseFloat(v.close),
          }))
        );
      }
    } catch (e) {
      console.error('Chart data error:', e);
      setChartData([]);
    }
    setChartLoading(false);
  };

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { authentication } = response;
  //     if (authentication) {
  //       fetch('https://www.googleapis.com/userinfo/v2/me', {
  //         headers: { Authorization: `Bearer ${authentication.accessToken}` },
  //       })
  //         .then(res => res.json())
  //         .then(data => setUserInfo(data));
  //     }
  //   };
  // }, [response])

  const renderItem = ({ item }: { item: any }) => {
    const symbol = item.symbol || item;
    // Format symbol for display e.g. GBP/USD
    const display = symbol.includes('/')
      ? symbol
      : symbol.replace(/([A-Z]+)(USD|EUR|GBP|BTC|ETH)/, '$1/$2');

    const priceKey = symbol.replace('/', '');
    const price = prices[priceKey]?.price || '--';
    const isFav = favorites.includes(symbol);

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => fetchChart(symbol)}
        activeOpacity={0.7}
      >
        <ThemedText style={{ flex: 1 }}>{display}</ThemedText>
        <ThemedText>{price}</ThemedText>
        <TouchableOpacity onPress={() => toggleFavorite(symbol)}>
          <Ionicons name={isFav ? 'star' : 'star-outline'} size={20} color="#FFD700" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // if (!userInfo) {
  //   return (
  //     <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <Button
  //         disabled={!request}
  //         title="Sign in with Google"
  //         onPress={() => promptAsync()}
  //       />
  //     </ThemedView>
  //   );
  // }

  return (
    <FlatList
      data={results.length ? results : DEFAULT_SYMBOLS}
      keyExtractor={item => item.symbol || item}
      renderItem={renderItem}
      ListHeaderComponent={
        <>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Trading Indexes</ThemedText>
          </ThemedView>
          <TextInput
            style={styles.input}
            placeholder="Search indexes (e.g. BTCUSD, GBPUSD)..."
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={onSearch}
            returnKeyType="search"
          />
          {loading && <ActivityIndicator />}
          {favorites.length > 0 && (
            <>
              <ThemedText type="subtitle" style={{ marginTop: 12 }}>Favorites</ThemedText>
              {favorites.map(symbol => renderItem({ item: symbol }))}
            </>
          )}
        </>
      }
      ListFooterComponent={
        selectedSymbol ? (
          <ThemedView style={styles.chartContainer}>
            <ThemedText type="subtitle">{selectedSymbol} Chart (24h)</ThemedText>
            {chartLoading ? (
              <ActivityIndicator />
            ) : chartData.length > 0 ? (
              <LineChart.Provider data={chartData}>
                <LineChart height={180} width={340}>
                  <LineChart.Path color="#4F8EF7" />
                  <LineChart.CursorCrosshair />
                </LineChart>
                <LineChart.PriceText style={{ alignSelf: 'center', marginTop: 8 }} />
              </LineChart.Provider>
            ) : (
              <ThemedText>No chart data.</ThemedText>
            )}
          </ThemedView>
        ) : null
      }
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingTop: 40,
    paddingBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 4,
  },
  chartContainer: {
    marginTop: 20,
    borderRadius: 12,
    padding: 12,
  },
});
