import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  Dimensions,
 
} from 'react-native';
import { MaterialIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';

import Footer from '../home/Footer'

const { width, height } = Dimensions.get('window');

const PostPurchaseServices = () => {
  

  return (
    <View style={styles.container}>
     
      <View 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <ImageBackground 
          source={require('../../assets/web9-1@2x.png')} 
          style={styles.heroSection}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heading}>Post-Purchase Property Services</Text>
            <Text style={styles.tagline}>
              Simplifying ownership formalities with expert legal and documentation services.
            </Text>
          </View>
        </ImageBackground>

        {/* Grid Section */}
        <View style={styles.gridSection}>
          <View style={styles.card}>
            <MaterialIcons name="description" size={40} color="#0056b3" style={styles.icon} />
            <Text style={styles.cardTitle}>Ownership Mutation</Text>
            <Text style={styles.cardText}>
              We help you record the new ownership with local municipal authorities, ensuring legal recognition.
            </Text>
          </View>

          <View style={styles.card}>
            <FontAwesome name="user-edit" size={36} color="#0056b3" style={styles.icon} />
            <Text style={styles.cardTitle}>Utility Transfers</Text>
            <Text style={styles.cardText}>
              Seamless transfer of electricity, water, gas, and internet connections to the new owners name.
            </Text>
          </View>

          <View style={styles.card}>
            <FontAwesome5 name="tools" size={36} color="#0056b3" style={styles.icon} />
            <Text style={styles.cardTitle}>Tax & Record Updates</Text>
            <Text style={styles.cardText}>
              Assistance with updating property tax records and society documents to reflect rightful ownership.
            </Text>
          </View>

          <View style={styles.card}>
            <FontAwesome5 name="balance-scale" size={36} color="#0056b3" style={styles.icon} />
            <Text style={styles.cardTitle}>Legal Advisory</Text>
            <Text style={styles.cardText}>
              Get expert guidance on affidavits, stamp duty, and property-related legal clarifications post-purchase.
            </Text>
          </View>
        </View>

        {/* Highlights Section */}
        <View style={styles.highlights}>
          <Text style={styles.highlightsTitle}>Why Choose Us?</Text>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>✓</Text>
            <Text style={styles.listText}>All documentation handled by legal and municipal experts</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>✓</Text>
            <Text style={styles.listText}>Accurate, compliant, and timely updates</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>✓</Text>
            <Text style={styles.listText}>End-to-end support across major Indian cities</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>✓</Text>
            <Text style={styles.listText}>Transparent process with fixed turnaround times</Text>
          </View>
        </View>

        
      </View>
      <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  heroSection: {
    height: width > 768 ? 300 : width > 480 ? 250 : 200,
    justifyContent: 'center',
    marginBottom: 30,
  },
  heroImage: {
    borderRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heading: {
    fontSize: width > 768 ? 28 : width > 480 ? 24 : 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tagline: {
    fontSize: width > 768 ? 16 : width > 480 ? 14 : 12,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '90%',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gridSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  card: {
    width: width > 768 ? '48%' : '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 86, 179, 0.1)',
  },
  icon: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    textAlign: 'center',
  },
  highlights: {
    backgroundColor: '#f9f9f9',
    padding: 25,
    borderRadius: 16,
    marginHorizontal: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(0, 86, 179, 0.05)',
  },
  highlightsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 15,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  bullet: {
    color: '#0056b3',
    marginRight: 12,
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
  },
  listText: {
    fontSize: 16,
    color: '#444',
    flex: 1,
    lineHeight: 22,
  },
 
  
  
});

export default PostPurchaseServices;