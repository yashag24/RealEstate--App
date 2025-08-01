import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const PostPurchaseServices = () => {
  const handleGoHome = () => {
          router.push('/user');
        };

  const services = [
    {
      icon: 'description',
      iconType: 'MaterialIcons',
      title: 'Ownership Mutation',
      description: 'We help you record the new ownership with local municipal authorities, ensuring legal recognition.'
    },
    {
      icon: 'user-edit',
      iconType: 'FontAwesome',
      title: 'Utility Transfers',
      description: 'Seamless transfer of electricity, water, gas, and internet connections to the new owner\'s name.'
    },
    {
      icon: 'tools',
      iconType: 'FontAwesome5',
      title: 'Tax & Record Updates',
      description: 'Assistance with updating property tax records and society documents to reflect rightful ownership.'
    },
    {
      icon: 'balance-scale',
      iconType: 'FontAwesome5',
      title: 'Legal Advisory',
      description: 'Get expert guidance on affidavits, stamp duty, and property-related legal clarifications post-purchase.'
    }
  ];

  const highlights = [
    'All documentation handled by legal and municipal experts',
    'Accurate, compliant, and timely updates',
    'End-to-end support across major Indian cities',
    'Transparent process with fixed turnaround times'
  ];

  const renderIcon = (iconType, iconName, size, color) => {
    const iconProps = { name: iconName, size, color };
    switch (iconType) {
      case 'MaterialIcons':
        return <MaterialIcons {...iconProps} />;
      case 'FontAwesome':
        return <FontAwesome {...iconProps} />;
      case 'FontAwesome5':
        return <FontAwesome5 {...iconProps} />;
      default:
        return <MaterialIcons {...iconProps} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoHome}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post-Purchase Services</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroGradient}>
            <Text style={styles.heading}>Post-Purchase Property Services</Text>
            <Text style={styles.tagline}>
              Simplifying ownership formalities with expert legal and documentation services.
            </Text>
          </View>
        </View>

        {/* Services Grid */}
        <View style={styles.servicesContainer}>
          <View style={styles.gridSection}>
            {services.map((service, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.iconContainer}>
                  {renderIcon(service.iconType, service.icon, 32, '#0056b3')}
                </View>
                <Text style={styles.cardTitle}>{service.title}</Text>
                <Text style={styles.cardText}>{service.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Why Choose Us Section */}
        <View style={styles.highlightsContainer}>
          <View style={styles.highlights}>
            <Text style={styles.highlightsTitle}>Why Choose Us?</Text>
            {highlights.map((highlight, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bulletContainer}>
                  <Text style={styles.bullet}>✓</Text>
                </View>
                <Text style={styles.listText}>{highlight}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Call to Action */}
        {/* <View style={styles.ctaContainer}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
            <Text style={styles.ctaSubtitle}>
              Let our experts handle all your post-purchase property services with complete peace of mind.
            </Text>
            <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
              <Text style={styles.ctaButtonText}>Contact Our Experts</Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
 
  header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#8a8676ff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerPlaceholder: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  heroSection: {
    height: 180 ,
    backgroundColor: '#0056b3',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroGradient: {
    backgroundColor: 'rgba(0, 86, 179, 0.9)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    maxWidth: '100%',
  },
  heading: {
    fontSize: 20 ,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 26 ,
  },
  tagline: {
    fontSize:  14 ,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight:  20 ,
    maxWidth: '90%',
  },
  servicesContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  gridSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '100%' ,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 86, 179, 0.08)',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 86, 179, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize:  16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  cardText: {
    fontSize:14,
    color: '#666',
    lineHeight:20,
    textAlign: 'center',
  },
  highlightsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  highlights: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 86, 179, 0.05)',
  },
  highlightsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  bulletContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1dae20ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  bullet: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
    lineHeight: 22,
  },
  
});

export default PostPurchaseServices;