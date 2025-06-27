import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import Navbar from './Navbar'; // Make sure this file exists and is correctly linked

const INSIGHT_CARDS = [
  {
    image: require('../../assets/images/news.jpeg'),
    title: 'Read Latest News',
    subtitle: 'About real estate',
    url: 'https://www.moneycontrol.com/real-estate-property/',
  },
  {
    image: require('../../assets/images/checkarticles.png'),
    title: 'Check Articles',
    subtitle: 'On trendy topics and policy updates',
    url: 'https://www.rprealtyplus.com/',
  },
  {
    image: require('../../assets/images/emicalculator.png'),
    title: 'EMI Calculator',
    subtitle: 'Calculate your home loan EMI',
    url: 'https://emicalculator.net/',
  },
  {
    image: require('../../assets/images/areacalculator.png'),
    title: 'Area Calculator',
    subtitle: 'Convert one area to another easily',
    url: 'https://www.calculator.net/area-calculator.html',
  },
];

const CardLayout = () => {
  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert('Cannot open the link', url);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.insightsContainer}>
      <Navbar />

      <View style={styles.header}>
        <Image
          source={require('../../assets/images/insightslogo.jpeg')}
          style={styles.logo}
        />
        <Text style={styles.title}>INSIGHTS AND TOOLS</Text>
      </View>

      <View style={styles.cardGrid}>
        {INSIGHT_CARDS.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => openLink(card.url)}
          >
            <Image source={card.image} style={styles.cardImage} />
            <View style={styles.content}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  insightsContainer: {
    width: '100%',
    marginTop: 90,
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: '500',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 30,
    paddingHorizontal: 16,
    width: '100%',
  },
  card: {
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 20,
  },
  content: {
    padding: 10,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
});

export default CardLayout;
