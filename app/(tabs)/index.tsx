import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';

// If using Expo, you can use process.env or expo-constants
const API_KEY = process.env.EXPO_PUBLIC_TWELVE_DATA_API_KEY || '';

const DEFAULT_SYMBOLS = ['GBP/USD', 'BTC/USD', 'EUR/USD', 'ETH/USD'];

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

  // Load favorites from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('favorites').then(data => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  // Fetch default prices
  useEffect(() => {
    fetchPrices(DEFAULT_SYMBOLS);
  }, []);

  // Fetch all available forex and crypto pairs on mount
  useEffect(() => {
    const fetchAllSymbols = async () => {
      try {
        const forexRes = await fetch(`https://api.twelvedata.com/forex_pairs?apikey=${API_KEY}`);
        const forexData = await forexRes.json();
        const cryptoRes = await fetch(`https://api.twelvedata.com/cryptocurrency_pairs?apikey=${API_KEY}`);
        const cryptoData = await cryptoRes.json();
        const forexSymbols = (forexData.data || []).map((item: any) => item.symbol);
        const cryptoSymbols = (cryptoData.data || []).map((item: any) => item.symbol);
        setAllSymbols([...forexSymbols, ...cryptoSymbols]);
      } catch (e) {
        setAllSymbols([]);
      }
    };
    fetchAllSymbols();
  }, []);

  // Fetch prices for a list of symbols
  const fetchPrices = async (symbols: string[]) => {
    setLoading(true);
    try {
      const joined = symbols.map(s => s.replace('/', '')); // API expects e.g. GBPUSD
      const url = `https://api.twelvedata.com/price?symbol=${joined.join(',')}&apikey=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setPrices(prev => ({ ...prev, ...data }));
    } catch (e) {}
    setLoading(false);
  };

  // Search for symbols
  const onSearch = async () => {
    if (!search) return;
    setLoading(true);
    try {
      const url = `https://api.twelvedata.com/symbol_search?symbol=${search}&apikey=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      let found = data.data || [];
      // If API returns nothing, filter from allSymbols
      if (!found.length && allSymbols.length) {
        found = allSymbols
          .filter(s => s.toLowerCase().includes(search.toLowerCase()))
          .map(s => ({ symbol: s }));
      }
      setResults(found);
      fetchPrices(found.map((item: any) => item.symbol));
    } catch (e) {}
    setLoading(false);
  };

  // Save/unsave favorite
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
      const url = `https://api.twelvedata.com/time_series?symbol=${symbol.replace('/', '')}&interval=1h&outputsize=24&apikey=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setChartData(
        (data.values || []).reverse().map((v: any) => ({
          timestamp: new Date(v.datetime).getTime(),
          value: parseFloat(v.close),
        }))
      );
    } catch (e) {
      setChartData([]);
    }
    setChartLoading(false);
  };

  // Render a single index row
  const renderItem = ({ item }: { item: any }) => {
    const symbol = item.symbol || item;
    const display = symbol.includes('/') ? symbol : symbol.replace(/([A-Z]+)(USD|EUR|GBP|BTC|ETH)/, '$1/$2');
    const price = prices[symbol.replace('/', '')]?.price || prices[symbol]?.price || '--';
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

  return (
    <FlatList
      data={results.length ? results : DEFAULT_SYMBOLS}
      keyExtractor={item => (item.symbol || item)}
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
            <ThemedText type="subtitle" style={{ marginTop: 12 }}>Favorites</ThemedText>
          )}
          {favorites.length > 0 && favorites.map(symbol => renderItem({ item: symbol }))}
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
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 12,
  },
});