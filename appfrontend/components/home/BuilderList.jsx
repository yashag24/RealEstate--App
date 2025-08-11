// components/BuilderList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Linking, ActivityIndicator, StyleSheet } from 'react-native';

export default function BuilderList() {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchBuilders();
  }, []);

  const fetchBuilders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/builders`);
      const data = await res.json();
      setBuilders(data);
    } catch (error) {
      console.error('Error fetching builders:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBuilder = ({ item }) => (
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>

      {item.builderUrl ? (
        <TouchableOpacity onPress={() => Linking.openURL(item.builderUrl)}>
          <Text style={styles.link}>Visit Builder</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={builders}
      keyExtractor={(item) => item._id}
      renderItem={renderBuilder}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 10 },
  card: { backgroundColor: '#fff', padding: 12, marginBottom: 12, borderRadius: 10, elevation: 3 },
  image: { width: '100%', height: 150, borderRadius: 8 },
  placeholder: { backgroundColor: '#ccc' },
  name: { fontSize: 18, fontWeight: 'bold', marginVertical: 6 },
  description: { fontSize: 14, color: '#555' },
  link: { color: '#007AFF', marginTop: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
