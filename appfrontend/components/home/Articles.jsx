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

const Articles = () => {
  const [article, setArticle] = useState(null);
  const [previousIndex, setPreviousIndex] = useState(null);
  const chosenIndices = [0, 2, 3, 8, 9, 17, 43];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          'https://newsapi.org/v2/everything?q=real%20estate&apiKey=cc543b56a9f4473f99a9b75372096e94'
        );
        const data = await response.json();

        const getRandomIndex = (excludedIndex, length) => {
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
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: '#764EC6',
  },
  heading: {
    fontWeight: '500',
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  article: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  content: {
    width: '100%',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 22,
    color: '#fff',
    marginBottom: 10,
  },
  readMore: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  readMoreText: {
    fontSize: 16,
    color: '#fff',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

export default Articles;
