import React, { useRef, useState } from 'react';
import { View, Text, ScrollView,  StyleSheet, Pressable } from 'react-native';


export const ReviewPage = ({ reviewsProperty = [] }) => {

  const totalReviews = reviewsProperty.length

  // Sort reviews by latest first
  const sortedReviews = [...reviewsProperty].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Calculate average
  const averageRating = (
    sortedReviews.reduce((sum, review) => sum + review.rating, 0) /
    (totalReviews || 1)
  ).toFixed(2)

  const ratingCounts = [0, 0, 0, 0, 0];

  sortedReviews.forEach((r) => {
    const rating = r?.rating || 0;
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating - 1]++;
    }
  });


  const getRatingPercentage = (count) =>
    ((count / (totalReviews || 1)) * 100).toFixed(0);


  const [visibleCount, setVisibleCount] = useState(3)
  const reviewListRef = useRef(null)

  const handleReadMore = () => {
    setVisibleCount(prev => {
      const newCount = prev + 4;
      return newCount > totalReviews ? totalReviews : newCount;
    });

    setTimeout(() => {
      if (reviewListRef.current) {
        reviewListRef.current.scrollTo({ y: 0, animated: true });
      }
    }, 100);
  }



  return (
    <View style={styles.reviewPage}>
      <View style={styles.ratingSummary}>
        <Text>Rating Overview</Text>
        <View style={styles.overallRating}>
          <Text style={styles.ratingValue}>{averageRating}</Text>
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
        {/* we will see if there is need for closing the view tag here */}
      </View>

      <ScrollView
        ref={reviewListRef}
        style={styles.reviewsList}>

        <Text style={styles.heading}>
          Reviews <Text style={styles.reviewCount}>({totalReviews})</Text>
        </Text>

        {totalReviews === 0 ? (
          <Text style={styles.noReviews}>No reviews yet.</Text>
        ) : (
          <View style={styles.reviewsListContainer}>
            {sortedReviews.slice(0, visibleCount).map((review) => (
              <View style={styles.reviewItem} key={review._id}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>{review.name}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.timestamp).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.reviewStars}>
                  {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                </Text>
                <Text>{review.comment}</Text>
              </View>
            ))}
            {visibleCount < totalReviews && (
              <Pressable style={styles.readMoreButton} onPress={handleReadMore}>
                <Text style={styles.readMoreButtonText}>Read More</Text>
              </Pressable>
            )}


          </View>
        )}


      </ScrollView>





      {/* </View> */}

    </View>

  )
}


const styles = StyleSheet.create({
  reviewPage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7faff',
  },
  ratingSummary: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '30%',
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    margin: 10,
  },
  reviewsList: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '60%',
    minWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    margin: 10,
  },
  reviewsListContainer: {
    maxHeight: 460,
    paddingVertical: 20,
  },
  overallRating: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingsDetail: {
    marginTop: 20,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 24,
    width: 32,
    textAlign: 'center',
  },
  barContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#ffc107',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  ratingScore: {
    width: 48,
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#555',
  },
  reviewCount: {
    color: '#777',
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    color: '#333',
  },
  reviewDate: {
    color: '#888',
    fontSize: 14,
  },
  reviewStars: {
    color: '#ffc107',
    fontSize: 18,
    marginVertical: 4,
  },
  reviewResponse: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  readMoreButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
    borderRadius: 6,
  },
  readMoreText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

