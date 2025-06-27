import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

const Articles: React.FC = () => {
  const [article, setArticle] = useState<any>(null);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const chosenIndices = [0, 2, 3, 8, 9, 17, 43];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          'https://newsapi.org/v2/everything?q=real%20estate&apiKey=24bcf6c46b474bec8c8e6a95e67f0cbe'
        );
        const data = await response.json();

        const getRandomIndex = (excludedIndex: number | null, length: number) => {
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * length);
          } while (randomIndex === excludedIndex);
          return randomIndex;
        };

        const randomChosenIndex = getRandomIndex(previousIndex, chosenIndices.length);
        const selectedIndex = chosenIndices[randomChosenIndex];
        setPreviousIndex(randomChosenIndex);

        if (selectedIndex < data.articles.length) {
          setArticle(data.articles[selectedIndex]);
        } else {
          console.warn('Selected index is out of range of fetched articles.');
        }
      } catch (error) {
        console.error('Error fetching the articles: ', error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>REAL ESTATE AROUND THE GLOBE</Text>

      {!article && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}

      {article && (
        <View style={styles.article}>
          <Image
            source={{
              uri: article.urlToImage || 'https://via.placeholder.com/400x200.png?text=No+Image',
            }}
            style={styles.image}
          />
          <View style={styles.content}>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.description}>{article.description}</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(article.url)}
              style={styles.readMore}
            >
              <Text style={styles.readMoreText}>READ MORE ...</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 24, // ~3vw
    paddingBottom: 32, // ~4vw
    paddingHorizontal: 24, // ~6vw–8vw range
    gap: 40,
    backgroundColor: '#764EC6',
    color: '#fff',
    marginVertical: 20,
  },
  article: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 50,
    flexWrap: 'wrap', // Allows responsiveness
  },
  image: {
    height: 400,
    width: 400,
    resizeMode: 'cover',
  },
  heading: {
    fontWeight: '500',
    fontSize: 36,
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    height: 400,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: '#fff',
  },
  description: {
    fontSize: 18,
    fontStyle: 'italic',
    lineHeight: 25,
    color: '#fff',
  },
  readMore: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  readMoreText: {
    fontSize: 18,
    color: '#fff',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});


export default Articles;
