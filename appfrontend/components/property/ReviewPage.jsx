import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const ReviewPage = ({ reviewsProperty = [] }) => {
  const totalReviews = reviewsProperty.length;
  const sortedReviews = [...reviewsProperty].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const averageRating = totalReviews > 0 ? 
    (sortedReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) : '0.0';

  const [visibleCount, setVisibleCount] = useState(4);

  const handleReadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, totalReviews));
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays}d ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#10b981'; // emerald-500
    if (rating >= 4.0) return '#22c55e'; // green-500
    if (rating >= 3.5) return '#eab308'; // yellow-500
    if (rating >= 3.0) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const getAvatarColor = (name) => {
    const colors = ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>Reviews & Ratings</Text>
        <View style={styles.titleAccent} />
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        {/* Rating Summary Card */}
        <View style={[styles.ratingCard, { borderLeftColor: getRatingColor(parseFloat(averageRating)) }]}>
          <View style={styles.ratingValueContainer}>
            <Text style={[styles.ratingValue, { color: getRatingColor(parseFloat(averageRating)) }]}>
              {averageRating}
            </Text>
          
          </View>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text key={star} style={[
                styles.starIcon,
                { color: parseFloat(averageRating) >= star ? '#fbbf24' : '#e5e7eb' }
              ]}>
                ★
              </Text>
            ))}
          </View>
          <Text style={styles.totalReviewsText}>
            {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
          </Text>
        </View>

        {/* Review Cards */}
        {totalReviews === 0 ? (
          <View style={styles.noReviewsCard}>
            <View style={styles.noReviewsIconContainer}>
              <Text style={styles.noReviewsEmoji}>💭</Text>
            </View>
            <Text style={styles.noReviewsTitle}>No reviews yet</Text>
            <Text style={styles.noReviewsText}>Be the first to share your experience!</Text>
          </View>
        ) : (
          <>
            {sortedReviews.slice(0, visibleCount).map((review) => (
              <View key={review._id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerInfo}>
                    <View style={[styles.avatarCircle, { backgroundColor: getAvatarColor(review.name) }]}>
                      <Text style={styles.avatarText}>
                        {review.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Text>
                    </View>
                    <View style={styles.reviewerDetails}>
                      <Text style={styles.reviewerName} numberOfLines={1}>
                        {review.name || 'Anonymous'}
                      </Text>
                      <Text style={styles.reviewDate}>
                        {formatDate(review.timestamp)}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.ratingBadge, { backgroundColor: `${getRatingColor(review.rating)}15` }]}>
                    <Text style={[styles.ratingBadgeText, { color: getRatingColor(review.rating) }]}>
                      {review.rating}
                    </Text>
                    <Text style={[styles.ratingBadgeStar, { color: getRatingColor(review.rating) }]}>★</Text>
                  </View>
                </View>
                
                <Text style={styles.reviewText} numberOfLines={3}>
                  {review.comment}
                </Text>
                
                <View style={styles.reviewFooter}>
                  <View style={styles.helpfulBadge}>
                    <Text style={styles.helpfulText}>👍 Helpful</Text>
                  </View>
                </View>
              </View>
            ))}
            
            {visibleCount < totalReviews && (
              <Pressable style={styles.loadMoreCard} onPress={handleReadMore}>
                <View style={styles.loadMoreIconContainer}>
                  <Text style={styles.loadMoreIcon}>+</Text>
                </View>
                <Text style={styles.loadMoreText}>Load More</Text>
                <Text style={styles.loadMoreCount}>
                  {totalReviews - visibleCount} more reviews
                </Text>
              </Pressable>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  titleAccent: {
    width: 4,
    height: 24,
    backgroundColor: '#8b5cf6',
    borderRadius: 2,
    marginLeft: 12,
  },
  scrollView: {
    maxHeight: 140,
  },
  scrollContainer: {
    paddingRight: 4,
    alignItems: 'flex-start',
  },
  
  // Rating Summary Card - Modern gradient-like design
  ratingCard: {
    width: 130,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  ratingValueContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingValue: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  ratingBurst: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 20,
    backgroundColor: '#fbbf24',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burstText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
    marginBottom: 8,
  },
  starIcon: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalReviewsText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // No Reviews Card - Elegant empty state
  noReviewsCard: {
    width: 170,
    height: 120,
    backgroundColor: '#fafafa',
    borderRadius: 32,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    marginRight: 16,
  },
  noReviewsIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  noReviewsEmoji: {
    fontSize: 18,
  },
  noReviewsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
    textAlign: 'center',
  },
  noReviewsText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },
  
  // Review Cards - Premium card design
  reviewCard: {
    width: screenWidth * 0.65,
    maxWidth: 300,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 2,
  },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ratingBadgeStar: {
    fontSize: 12,
    fontWeight: '600',
  },
  reviewText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#475569',
    fontWeight: '400',
    marginBottom: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  helpfulBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  helpfulText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  
  // Load More Card - Interactive design
  loadMoreCard: {
    width: 130,
    height: 120,
    backgroundColor: '#fafafa',
    borderRadius: 32,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  loadMoreIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loadMoreIcon: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '300',
  },
  loadMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 2,
  },
  loadMoreCount: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
});