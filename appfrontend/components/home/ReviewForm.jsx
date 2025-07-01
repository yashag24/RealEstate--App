import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ReviewForm = ({ propertyId }) => {
  const [data, setData] = useState({
    name: '',
    review: '',
    rating: 0,
  });

  const [hover, setHover] = useState(null);

  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleInputChange = (name, value) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (data.rating === 0) {
      Alert.alert('Error', 'Please select a star rating.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/reviews/add-property-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          name: data.name,
          review: data.review,
          rating: data.rating,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        Alert.alert('Error', result.error || 'Failed to submit review');
        return;
      }

      setData({ name: '', review: '', rating: 0 });
      Alert.alert('Success', 'Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Leave a Review</Text>

      <TextInput
        style={styles.input}
        placeholder="Your name"
        value={data.name}
        onChangeText={(text) => handleInputChange('name', text)}
        placeholderTextColor="#94a3b8"
      />

      <TextInput
        style={styles.textarea}
        placeholder="Your review"
        value={data.review}
        onChangeText={(text) => handleInputChange('review', text)}
        multiline
        numberOfLines={5}
        placeholderTextColor="#94a3b8"
      />

      <View style={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleInputChange('rating', star)}
            onPressIn={() => setHover(star)}
            onPressOut={() => setHover(null)}
            activeOpacity={0.8}
          >
            <FontAwesome
              name="star"
              size={32}
              color={star <= (hover || data.rating) ? '#fbbf24' : '#e5e7eb'}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReviewForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    margin: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
    color: '#16a34a', // green accent
    letterSpacing: 0.2,
  },
  input: {
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
    color: '#1f2937',
  },
  textarea: {
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
    color: '#1f2937',
    textAlignVertical: 'top',
  },
  starRating: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#3b82f6', // blue accent
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
