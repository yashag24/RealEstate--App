import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const localities = [
  { name: 'Gajuwaka', rate: '₹4,250/ sq.ft', rentalYield: '3%', priceTrend: '14.9% YOY' },
  { name: 'Madhurawada', rate: '₹4,800/ sq.ft', rentalYield: '3%', priceTrend: '7.9% YOY' },
  { name: 'Atchutapuram', rate: '₹2,800/ sq.ft', rentalYield: '4%', priceTrend: '7.7% YOY' },
  { name: 'Sujatha Nagar', rate: '₹3,800/ sq.ft', rentalYield: 'NA', priceTrend: '5.6% YOY' },
  { name: 'Yendada', rate: '₹6,300/ sq.ft', rentalYield: '2%', priceTrend: '3.3% YOY' },
];

const CityWiseReviews = () => {
  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.head}>
        <Text style={styles.heading}>Top Gainers</Text>
        <Text style={styles.subheading}>
          across Visakhapatnam with highest appreciation
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.flex2]}>Locality</Text>
          <Text style={styles.headerCell}>Rate</Text>
          <Text style={styles.headerCell}>Yield</Text>
          <Text style={styles.headerCell}>Trend</Text>
        </View>

        {localities.map((loc, index) => (
          <View key={index} style={styles.row}>
            <View style={[styles.cell, styles.flex2, styles.locality]}>
              <Image
                source={require('../../assets/images/image.png')}
                style={styles.icon}
              />
              <View>
                <Text style={styles.locName}>{loc.name}</Text>
                <Text style={styles.city}>Visakhapatnam</Text>
              </View>
            </View>
            <Text style={styles.cell}>{loc.rate}</Text>
            <Text style={styles.cell}>{loc.rentalYield}</Text>
            <Text style={styles.cell}>{loc.priceTrend}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            View all most appreciated localities of Visakhapatnam
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 600,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignSelf: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  head: {
    width: '100%',
    marginBottom: 10,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#777',
  },
  table: {
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#2697e0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    color: '#fff',
  },
  flex2: {
    flex: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#555',
  },
  locality: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  city: {
    fontSize: 13,
    color: '#777',
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  button: {
    marginTop: 12,
    padding: 12,
    width: '100%',
    backgroundColor: '#2697e0',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CityWiseReviews;
