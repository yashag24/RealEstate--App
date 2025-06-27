// import { View, Text } from 'react-native'
// import React from 'react'

// const ReviewForm = () => {
//   return (
//     <View>
//       <Text>ReviewForm</Text>
//     </View>
//   )
// }

// export default ReviewForm

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ReviewForm = ({ propertyId }) => {
  const [data, setData] = useState({
    name: '',
    review: '',
    rating: 0,
  });

  const [hover, setHover] = useState(null); // For hover effect simulation

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
      const response = await fetch('http://localhost:8000/api/reviews/add-property-review', {
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
      />

      <TextInput
        style={styles.textarea}
        placeholder="Your review"
        value={data.review}
        onChangeText={(text) => handleInputChange('review', text)}
        multiline
        numberOfLines={5}
      />

      <View style={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleInputChange('rating', star)}
            onPressIn={() => setHover(star)}
            onPressOut={() => setHover(null)}
          >
            <FontAwesome
              name="star"
              size={30}
              color={star <= (hover || data.rating) ? '#ffc107' : '#e4e5e9'}
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
    margin: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
    color: '#000',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textarea: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    height: 120,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  starRating: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#6f42c1',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
