import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ReviewForm = ({ propertyId, onClose }) => {
  const [data, setData] = useState({
    name: '',
    review: '',
    rating: 0,
  });

  const [hover, setHover] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
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
      if (onClose) onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const getRatingText = (rating) => {
    const texts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return texts[rating] || '';
  };

  return (
    <View style={styles.container}>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <View style={styles.closeButtonCircle}>
            <Text style={styles.closeButtonText}>×</Text>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.headerContainer}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerEmoji}>⭐</Text>
        </View>
        <Text style={styles.heading}>Share Your Experience</Text>
        <Text style={styles.subheading}>Help others by sharing your honest review</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Your Name</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'name' && styles.inputFocused,
              data.name.length > 0 && styles.inputFilled
            ]}
            placeholder="Enter your full name"
            value={data.name}
            onChangeText={(text) => handleInputChange('name', text)}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Your Review</Text>
          <TextInput
            style={[
              styles.textarea,
              focusedField === 'review' && styles.textareaFocused,
              data.review.length > 0 && styles.inputFilled
            ]}
            placeholder="Share your experience about this property..."
            value={data.review}
            onChangeText={(text) => handleInputChange('review', text)}
            onFocus={() => setFocusedField('review')}
            onBlur={() => setFocusedField(null)}
            multiline
            numberOfLines={5}
            placeholderTextColor="#94a3b8"
          />
          <Text style={styles.characterCount}>{data.review.length}/500</Text>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.inputLabel}>Rate Your Experience</Text>
          <View style={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleInputChange('rating', star)}
                onPressIn={() => setHover(star)}
                onPressOut={() => setHover(null)}
                activeOpacity={0.8}
                style={styles.starButton}
              >
                <FontAwesome
                  name="star"
                  size={36}
                  color={star <= (hover || data.rating) ? '#fbbf24' : '#e5e7eb'}
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
          {(hover || data.rating) > 0 && (
            <Text style={styles.ratingText}>
              {getRatingText(hover || data.rating)}
            </Text>
          )}
        </View>

        <TouchableOpacity 
          onPress={handleSubmit} 
          style={[
            styles.submitButton,
            data.rating === 0 && styles.submitButtonDisabled
          ]}
          disabled={data.rating === 0}
        >
          <View style={styles.submitButtonContent}>
            <Text style={[
              styles.submitButtonText,
              data.rating === 0 && styles.submitButtonTextDisabled
            ]}>
              Submit Review
            </Text>
            <Text style={styles.submitButtonIcon}>→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReviewForm;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    elevation: 12,
    margin: 0,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: '300',
    lineHeight: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 8,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  headerEmoji: {
    fontSize: 28,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
  },
  formContainer: {
    gap: 24,
  },
  inputContainer: {
    position: 'relative',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    borderColor: '#e2e8f0',
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#1f2937',
    fontWeight: '500',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputFocused: {
    borderColor: '#8b5cf6',
    backgroundColor: '#ffffff',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputFilled: {
    borderColor: '#10b981',
    backgroundColor: '#ffffff',
  },
  textarea: {
    borderColor: '#e2e8f0',
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    height: 120,
    backgroundColor: '#fafafa',
    color: '#1f2937',
    textAlignVertical: 'top',
    fontWeight: '500',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textareaFocused: {
    borderColor: '#8b5cf6',
    backgroundColor: '#ffffff',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  characterCount: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
    marginTop: 6,
    fontWeight: '500',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  starRating: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
    marginTop: 8,
  },
  starButton: {
    padding: 4,
    borderRadius: 20,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  starIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#e2e8f0',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  submitButtonTextDisabled: {
    color: '#94a3b8',
  },
  submitButtonIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 4,
  },
});