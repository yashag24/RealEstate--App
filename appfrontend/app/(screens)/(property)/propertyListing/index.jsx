// app/(screens)/propertyListing/index.jsx

import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import PropertyListings from '@/components/property/PropertyListings';

export default function PropertyListingScreen() {
  const { city = '', query = '' } = useLocalSearchParams();
  return <PropertyListings cityParam={city} queryParam={query} />;
}
