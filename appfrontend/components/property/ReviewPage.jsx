import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const ReviewPage = ({ reviewsProperty = [] }) => {
  const totalReviews = reviewsProperty.length;
  const sortedReviews = [...reviewsProperty].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const averageRating = (
    sortedReviews.reduce((sum, review) => sum + review.rating, 0) /
    (totalReviews || 1)
  ).toFixed(2);

  const ratingCounts = [0, 0, 0, 0, 0];
  sortedReviews.forEach((r) => {
    const rating = r?.rating || 0;
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating - 1]++;
    }
  });

  const getRatingPercentage = (count) =>
    ((count / (totalReviews || 1)) * 100).toFixed(0);

  const [visibleCount, setVisibleCount] = useState(5);

  const handleReadMore = () => {
    setVisibleCount((prev) => {
      const newCount = prev + 5;
      return newCount > totalReviews ? totalReviews : newCount;
    });
  };

  return (
    <View style={styles.reviewPage}>
      <View style={styles.ratingSummary}>
        <Text style={styles.sectionTitle}>Rating Overview</Text>
        <View style={styles.overallRating}>
          <Text style={styles.ratingValue}>{averageRating}</Text>
          <Text style={styles.ratingSubtitle}>out of 5</Text>
        </View>
        <View style={styles.ratingsDetail}>
          {[5, 4, 3, 2, 1].map((star) => {
            const percent = Number(getRatingPercentage(ratingCounts[star - 1]));
            const emoji = ["😄", "😊", "😐", "😕", "😭"][5 - star];
            return (
              <View style={styles.ratingItem} key={star}>
                <Text style={styles.ratingEmoji}>{emoji}</Text>
                <View style={styles.barContainer}>
                  <View style={[styles.barFill, { width: `${percent}%` }]} />
                </View>
                <Text style={styles.ratingScore}>{percent}%</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.reviewsList}>
        <Text style={styles.sectionTitle}>
          User Reviews <Text style={styles.reviewCount}>({totalReviews})</Text>
        </Text>
        {totalReviews === 0 ? (
          <View style={styles.noReviewsContainer}>
            <Text style={styles.noReviews}>No reviews yet.</Text>
            <Text style={styles.noReviewsSubtitle}>Be the first to review!</Text>
          </View>
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {sortedReviews.slice(0, visibleCount).map((review) => (
                <View style={styles.reviewCard} key={review._id}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewAuthor}>{review.name}</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(review.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.reviewStars}>
                    {"★".repeat(review.rating)}
                    <Text style={styles.starInactive}>
                      {"☆".repeat(5 - review.rating)}
                    </Text>
                  </Text>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </ScrollView>
            {visibleCount < totalReviews && (
              <Pressable style={styles.readMoreButton} onPress={handleReadMore}>
                <Text style={styles.readMoreButtonText}>Load More Reviews</Text>
              </Pressable>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewPage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8fafc',
    minHeight: 260,
    alignItems: 'flex-start',
  },
  ratingSummary: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: 180,
    maxWidth: 220,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewsList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flex: 2,
    minHeight: 220,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  horizontalScroll: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 14,
  },
  overallRating: {
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 8,
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#15803d',
  },
  ratingSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  ratingsDetail: {
    marginTop: 4,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingEmoji: {
    fontSize: 20,
    width: 32,
    textAlign: 'center',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 5,
  },
  ratingScore: {
    width: 36,
    textAlign: 'right',
    fontWeight: '600',
    color: '#4b5563',
    fontSize: 13,
  },
  reviewCount: {
    color: '#6b7280',
    fontWeight: '500',
  },
  noReviewsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noReviews: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 4,
  },
  noReviewsSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
  },
  reviewCard: {
    width: screenWidth * 0.5,
    minWidth: 220,
    maxWidth: 300,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    marginRight: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewAuthor: {
    fontWeight: '700',
    color: '#1f2937',
    fontSize: 15,
  },
  reviewDate: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '500',
  },
  reviewStars: {
    color: '#fbbf24',
    fontSize: 17,
    marginVertical: 2,
    letterSpacing: 1,
  },
  starInactive: {
    color: '#e5e7eb',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
    marginTop: 4,
  },
  readMoreButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    alignSelf: 'flex-start',
    minWidth: 160,
  },
  readMoreButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
