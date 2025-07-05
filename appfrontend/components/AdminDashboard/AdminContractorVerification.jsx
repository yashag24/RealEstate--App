import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const AdminContractorVerification = ({
  contractors,
  loading,
  error,
  handleAcceptContractor,
  handleRejectContractor,
  navigation, // React Navigation prop
}) => {
  const [filter, setFilter] = useState('all');

  const filteredContractors = contractors
    .filter((contractor) =>
      filter === 'all'
        ? true
        : filter === 'verified'
        ? contractor.verified
        : !contractor.verified
    )
    .reverse();

  const handleViewDetails = (contractorId) => {
    navigation.navigate('ContractorDetails', { contractorId });
  };

  const handleImageError = (imageIndex, workIndex, contractorIndex) => {
    // In a real app, you might want to update state to hide broken images
    console.log('Image failed to load');
  };

  const renderPortfolioImages = (work, workIndex) => (
    <View style={styles.imageGallery}>
      {work.images.slice(0, 3).map((img, j) => (
        <Image
          key={j}
          source={{ uri: img }}
          style={styles.portfolioImage}
          onError={() => handleImageError(j, workIndex)}
          resizeMode="cover"
        />
      ))}
      {work.images.length > 3 && (
        <View style={styles.moreImages}>
          <Text style={styles.moreImagesText}>+{work.images.length - 3} more</Text>
        </View>
      )}
    </View>
  );

  const renderPortfolioItem = (work, index) => (
    <View key={index} style={styles.portfolioItem}>
      <View style={styles.portfolioContent}>
        <Text style={styles.portfolioTitle}>{work.title}</Text>
        <Text style={styles.portfolioDescription}>{work.description}</Text>
        <Text style={styles.portfolioMeta}>
          Location: {work.location} • Completed: {new Date(work.completedOn).toLocaleDateString()}
        </Text>
      </View>
      {renderPortfolioImages(work, index)}
    </View>
  );

  const renderContractorCard = (contractor) => (
    <View key={contractor._id} style={styles.contractorCard}>
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{contractor.name}</Text>
          <View style={[
            styles.status,
            contractor.verified ? styles.verified : styles.pending
          ]}>
            <Text style={[
              styles.statusText,
              contractor.verified ? styles.verifiedText : styles.pendingText
            ]}>
              {contractor.verified ? 'Verified' : 'Pending'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewDetailsBtn}
          onPress={() => handleViewDetails(contractor._id)}
        >
          <Text style={styles.viewDetailsBtnText}>View Details</Text>
        </TouchableOpacity>

        <View style={styles.infoGroup}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Service Type:</Text>
            <Text style={[styles.value, styles.serviceType]}>
              {contractor.serviceType}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.value}>
              {contractor.email} | {contractor.phone}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{contractor.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Joined:</Text>
            <Text style={styles.value}>
              {new Date(contractor.createdAt).toLocaleString()}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Portfolio Projects:</Text>
            <Text style={styles.value}>{contractor.portfolio.length}</Text>
          </View>

          {contractor.portfolio.length > 0 ? (
            <View style={styles.portfolioList}>
              {contractor.portfolio.slice(0, 2).map((work, i) => 
                renderPortfolioItem(work, i)
              )}
            </View>
          ) : (
            <Text style={styles.message}>No portfolio items provided</Text>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          {!contractor.verified && (
            <View style={styles.adminActions}>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => handleAcceptContractor(contractor._id)}
              >
                <Text style={styles.acceptBtnText}>Verify</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleRejectContractor(contractor._id)}
              >
                <Text style={styles.rejectBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setFilter('all')}
          style={[styles.filterBtn, filter === 'all' && styles.active]}
        >
          <Text style={[styles.filterBtnText, filter === 'all' && styles.activeText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('verified')}
          style={[styles.filterBtn, filter === 'verified' && styles.active]}
        >
          <Text style={[styles.filterBtnText, filter === 'verified' && styles.activeText]}>
            Verified
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('pending')}
          style={[styles.filterBtn, filter === 'pending' && styles.active]}
        >
          <Text style={[styles.filterBtnText, filter === 'pending' && styles.activeText]}>
            Pending
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.message}>Loading contractors...</Text>
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : filteredContractors.length === 0 ? (
        <Text style={styles.message}>No contractors found for this filter.</Text>
      ) : (
        filteredContractors.map(renderContractorCard)
      )}
    </ScrollView>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 32,
    maxWidth: 1400,
    alignSelf: 'center',
    backgroundColor: '#f5f7fa', // React Native doesn't support gradients in backgroundColor, use libraries like react-native-linear-gradient
    minHeight: height,
    width: '100%',
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 24,
    // React Native doesn't support box-shadow directly, use elevation for Android and shadowColor, shadowOffset, shadowOpacity, shadowRadius for iOS
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },

  filterBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 32,
    backgroundColor: 'white',
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    // React Native doesn't support transform animations directly in styles, use Animated API
  },

  filterBtnText: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  filterBtnActive: {
    backgroundColor: '#667eea', // Use react-native-linear-gradient for gradient backgrounds
    borderColor: '#667eea',
    elevation: 6,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },

  filterBtnActiveText: {
    color: 'white',
  },

  message: {
    fontSize: 20,
    textAlign: 'center',
    color: '#6b7280',
    fontWeight: '500',
    paddingVertical: 48,
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 32,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  error: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    padding: 24,
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#fecaca',
    borderRadius: 16,
    marginVertical: 16,
  },

  contractorCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },

  cardTopBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#667eea', // Use react-native-linear-gradient for gradient
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#f1f5f9',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },

  status: {
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 32,
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  statusVerified: {
    backgroundColor: '#10b981',
    color: 'white',
  },

  statusPending: {
    backgroundColor: '#f59e0b',
    color: 'white',
  },

  viewDetailsBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  viewDetailsBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },

  infoGroup: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  label: {
    fontWeight: '600',
    color: '#374151',
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    width: 200,
    marginRight: 16,
  },

  value: {
    color: '#6b7280',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },

  serviceType: {
    backgroundColor: '#f1f5f9',
    color: '#374151',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  portfolioItem: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  portfolioContent: {
    flex: 1,
    marginRight: 24,
  },

  portfolioTitle: {
    color: '#1e293b',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },

  portfolioDescription: {
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 24,
  },

  portfolioMeta: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },

  moreProjects: {
    backgroundColor: '#e0f2fe',
    borderColor: '#0369a1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  moreProjectsText: {
    color: '#0369a1',
    fontWeight: '600',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  imageGallery: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: 120,
  },

  portfolioImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  moreImages: {
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed', // React Native doesn't support dashed borders, use a custom component
    borderRadius: 12,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  moreImagesText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 19,
  },

  buttonsContainer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: '#f1f5f9',
  },

  adminActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },

  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  acceptBtn: {
    backgroundColor: '#10b981',
  },

  rejectBtn: {
    backgroundColor: '#ef4444',
  },

  actionBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  // Mobile responsive styles (use with width breakpoints)
  mobileContainer: {
    padding: 16,
  },

  mobileFilterContainer: {
    flexDirection: 'column',
    gap: 12,
    padding: 16,
    marginBottom: 16,
  },

  mobileFilterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    fontSize: 14,
  },

  mobileContractorCard: {
    padding: 24,
  },

  mobileTitleRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
  },

  mobileTitle: {
    fontSize: 24,
  },

  mobileInfoGroup: {
    flexDirection: 'column',
    gap: 12,
  },

  mobileLabel: {
    fontSize: 14,
    marginBottom: 4,
  },

  mobileAdminActions: {
    flexDirection: 'column',
    gap: 12,
  },

  mobileActionBtn: {
    width: '100%',
    paddingVertical: 16,
  },

  mobilePortfolioItem: {
    flexDirection: 'column',
    gap: 16,
  },

  mobileImageGallery: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minWidth: 'auto',
  },

  mobilePortfolioImage: {
    width: 60,
    height: 60,
    marginRight: 8,
    marginBottom: 0,
  },

  mobileMoreImages: {
    width: 60,
    height: 60,
    fontSize: 11,
  },

  // Small mobile styles
  smallMobileContainer: {
    padding: 8,
  },

  smallMobileFilterContainer: {
    marginBottom: 16,
    padding: 12,
  },

  smallMobileFilterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 13,
  },

  smallMobileContractorCard: {
    padding: 16,
    borderRadius: 16,
  },

  smallMobileTitle: {
    fontSize: 20,
  },

  smallMobilePortfolioImage: {
    width: 50,
    height: 50,
  },

  smallMobileMoreImages: {
    width: 50,
    height: 50,
    fontSize: 10,
  },
});

export default AdminContractorVerification;