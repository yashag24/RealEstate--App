import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';


const cards = [
  {
    image: require('../assets/images/ccu.png'),
    title: 'Chakrborty grih',
    location: 'sector 5 old Kolkata',
    price: '1 Cr',
  },
  {
    image: require('../assets/images/Delhi.png'),
    title: 'Garg builder floor',
    location: 'sector 8 Dwarka Delhi',
    price: '1.9 Cr',
  },
  {
    image: require('../assets/images/Mumbai.png'),
    title: 'Ashiyana Floor',
    location: 'sector 2 South Mumbai',
    price: '3 Cr',
  },
  {
    image: require('../assets/images/gurugram.png'),
    title: 'Kailash Apartments',
    location: 'sector 5 Gurugram',
    price: '75 lakh',
  },
];

const Upcoming: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/upcoming.png')}
          style={styles.logo}
        />
        <Text style={styles.heading}>NEW ARRIVALS</Text>
      </View>

      <View style={styles.cardGrid}>
        {cards.map((card, index) => (
          <View key={index} style={styles.card}>
            <Image source={card.image} style={styles.cardImage} />
            <View style={styles.content}>
              <Text style={styles.title}>{card.title}</Text>
              <Text style={styles.location}>{card.location}</Text>
              <Text style={styles.price}>{card.price}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    gap: 16,
    marginVertical: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgb(171, 171, 246)',
    width: '90%',
    alignSelf: 'center',
    height: width < 768 ? 'auto' : 400,
    shadowColor: '#757BEE',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: '500',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 12,
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 20,
    resizeMode: 'cover',
  },
  content: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 6,
  },
});

export default Upcoming;
