import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  FontAwesome5,
  MaterialIcons,
  Feather,
  Ionicons
} from "@expo/vector-icons";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const ContractorDetails = () => {
  const { id } = useLocalSearchParams();
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchContractor() {
      try {
        const res = await fetch(`${BASE_URL}/api/contractor/${id}`);
        const data = await res.json();
        setContractor(data);
      } catch (err) {
        console.error("Failed to load contractor", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContractor();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading contractor...</Text>
      </View>
    );
  }

  if (!contractor) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load contractor data</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="white" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Contractor Header */}
      <Text style={styles.title}>{contractor.name}</Text>
      
      {/* Contractor Meta Info */}
      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <Feather name="map-pin" size={16} color="#764ba2" />
          <Text style={styles.metaLabel}>Location:</Text>
          <Text style={styles.metaValue}>{contractor.location}</Text>
        </View>
        
        <View style={styles.metaItem}>
          <Feather name="tool" size={16} color="#764ba2" />
          <Text style={styles.metaLabel}>Service Type:</Text>
          <Text style={styles.metaValue}>{contractor.serviceType}</Text>
        </View>
        
        <View style={styles.metaItem}>
          <Feather name="phone" size={16} color="#764ba2" />
          <Text style={styles.metaLabel}>Contact no:</Text>
          <Text style={styles.metaValue}>{contractor.phone}</Text>
        </View>
        
        <View style={styles.metaItem}>
          <Feather name="mail" size={16} color="#764ba2" />
          <Text style={styles.metaLabel}>Email:</Text>
          <Text style={styles.metaValue}>{contractor.email}</Text>
        </View>
      </View>

      {/* Verified Badge */}
      {contractor.verified && (
        <View style={styles.verifiedBadge}>
          <MaterialIcons name="verified" size={16} color="#059669" />
          <Text style={styles.verifiedText}>Verified Contractor</Text>
        </View>
      )}

      {/* Portfolio Section */}
      <Text style={styles.subheading}>Portfolio Projects</Text>

      {contractor.portfolio.length === 0 ? (
        <View style={styles.noPortfolio}>
          <Text style={styles.noPortfolioText}>No portfolio available.</Text>
        </View>
      ) : (
        <FlatList
          data={contractor.portfolio}
          scrollEnabled={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: project }) => (
            <View style={styles.project}>
              <Text style={styles.projectTitle}>{project.title}</Text>
              <Text style={styles.description}>{project.description}</Text>
              
              <View style={styles.projectMeta}>
                <Feather name="map-pin" size={14} color="#6b7280" />
                <Text style={styles.metaText}>
                  <Text style={styles.metaBold}>Location: </Text>
                  {project.location}
                </Text>
              </View>
              
              <View style={styles.projectMeta}>
                <Feather name="calendar" size={14} color="#6b7280" />
                <Text style={styles.metaText}>
                  <Text style={styles.metaBold}>Completed On: </Text>
                  {new Date(project.completedOn).toLocaleDateString()}
                </Text>
              </View>

              {project.images?.length > 0 && (
                <FlatList
                  data={project.images}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(img, idx) => idx.toString()}
                  renderItem={({ item: img }) => (
                    <TouchableOpacity style={styles.imageContainer}>
                      <Image 
                        source={{ uri: img }} 
                        style={styles.projectImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.imagesContainer}
                />
              )}
            </View>
          )}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    color: '#6b7280',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 16,
    color: '#667eea',
  },
  metaGrid: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  metaLabel: {
    color: '#374151',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: '#4b5563',
    marginLeft: 8,
    fontSize: 14,
    flexShrink: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    alignSelf: 'center',
    marginVertical: 16,
  },
  verifiedText: {
    color: '#059669',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  subheading: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 24,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#667eea',
  },
  noPortfolio: {
    padding: 24,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  noPortfolioText: {
    fontStyle: 'italic',
    color: '#6b7280',
    fontSize: 16,
  },
  project: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    color: '#4b5563',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  projectMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    color: '#4b5563',
    fontSize: 14,
    marginLeft: 8,
  },
  metaBold: {
    fontWeight: '600',
    color: '#374151',
  },
  imagesContainer: {
    marginTop: 16,
  },
  imageContainer: {
    marginRight: 12,
  },
  projectImage: {
    width: 180,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
});

export default ContractorDetails;