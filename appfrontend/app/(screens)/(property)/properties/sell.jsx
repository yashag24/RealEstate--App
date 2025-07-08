// import React, { useState, useRef } from 'react';
// import {
//   View,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   Platform,
//   SafeAreaView
// } from 'react-native';

// import { MaterialIcons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// // import Navbar from '../components/Navbar';
// import {FiltersSection,PropertiesListSection}  from '../../../../components/property/propertiesPage';
// import Footer from '../../../../components/home/Footer'
// const PropertiesSell = () => {
//   const [searchQuery] = useState({ type: 'Sell' || '' });
//   const [showScrollTop, setShowScrollTop] = useState(false);
  
//   const scrollViewRef = useRef(null);
  
//   const handleScroll = (event) => {
//     const scrollY = event.nativeEvent.contentOffset.y;
//     setShowScrollTop(scrollY > 300);
//   };
  
//   const scrollToTop = () => {
//     scrollViewRef.current?.scrollTo({ y: 0, animated: true });
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* <Navbar /> */}
      
//       <ScrollView
//         ref={scrollViewRef}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         contentContainerStyle={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.contentContainer}>
//           {/* Breadcrumbs */}
//           <View style={styles.breadcrumbsContainer}>
//             <TouchableOpacity  onPress={() => router.push('/')}>
//               <Text style={styles.breadcrumbText}>Home</Text>
//             </TouchableOpacity>
//             <Text style={styles.breadcrumbSeparator}>›</Text>
//             <Text style={[styles.breadcrumbText, styles.activeBreadcrumb]}>Properties</Text>
//           </View>
          
//           {/* Main Content */}
//           <View style={styles.mainContent}>
//             {/* Filters Section */}
//             <View style={styles.filtersContainer}>
//               <FiltersSection />
//             </View>
            
//             {/* Properties List */}
//             <View style={styles.propertiesContainer}>
//               <PropertiesListSection searchQuery={searchQuery} />
//             </View>
//           </View>
//         </View>
        
//         <Footer />
//       </ScrollView>
      
//       {/* Scroll to top button - only visible when scrolled down */}
//       {showScrollTop && (
//         <TouchableOpacity 
//           style={styles.scrollTopButton}
//           onPress={scrollToTop}
//           activeOpacity={0.8}
//         >
//           <MaterialIcons name="arrow-upward" size={20} color="#0078db" />
//         </TouchableOpacity>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f4f5f7',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   contentContainer: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: Platform.OS === 'ios' ? 10 : 5,
//   },
//   breadcrumbsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   breadcrumbText: {
//     color: '#8993A4',
//     fontSize: 12,
//     fontFamily: 'OpenSans',
//     marginHorizontal: 4,
//   },
//   activeBreadcrumb: {
//     color: '#495057',
//   },
//   breadcrumbSeparator: {
//     color: '#8993A4',
//     fontSize: 16,
//     marginHorizontal: 2,
//   },
//   mainContent: {
//     flex: 1,
//   },
//   filtersContainer: {
//     width: '100%',
//     marginBottom: 20,
//   },
//   propertiesContainer: {
//     flex: 1,
//     width: '100%',
//   },
//   scrollTopButton: {
//     position: 'absolute',
//     right: 15,
//     bottom: 15,
//     backgroundColor: '#D6EFFF',
//     borderRadius: 25,
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
// });

// export default PropertiesSell;

import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  SafeAreaView
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
// import Navbar from '../components/Navbar';
import {FiltersSection,PropertiesListSection}  from '../../../../components/property/propertiesPage';
import Footer from '../../../../components/home/Footer'

const PropertiesSell = () => {
  const [searchQuery] = useState({ type: 'Sell' || '' });
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const scrollViewRef = useRef(null);
  
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(scrollY > 300);
  };
  
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Navbar /> */}
      
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Breadcrumbs */}
          <View style={styles.breadcrumbsContainer}>
            <TouchableOpacity 
              onPress={() => router.push('/')}
              style={styles.breadcrumbButton}
              activeOpacity={0.7}
            >
              <Text style={styles.breadcrumbText}>Home</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>›</Text>
            <Text style={[styles.breadcrumbText, styles.activeBreadcrumb]}>Properties</Text>
          </View>
          
          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Filters Section */}
            <View style={styles.filtersContainer}>
              <FiltersSection />
            </View>
            
            {/* Properties List */}
            <View style={styles.propertiesContainer}>
              <PropertiesListSection searchQuery={searchQuery} />
            </View>
          </View>
        </View>
        
        <Footer />
      </ScrollView>
      
      {/* Scroll to top button - only visible when scrolled down */}
      {showScrollTop && (
        <TouchableOpacity 
          style={styles.scrollTopButton}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <MaterialIcons name="arrow-upward" size={22} color="#ffffff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 16 : 12,
  },
  breadcrumbsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  breadcrumbButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s ease',
  },
  breadcrumbText: {
    color: '#64748b',
    fontSize: 14,
    fontFamily: 'OpenSans',
    fontWeight: '500',
    lineHeight: 20,
  },
  activeBreadcrumb: {
    color: '#1e293b',
    fontWeight: '600',
  },
  breadcrumbSeparator: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '400',
    marginHorizontal: 8,
  },
  mainContent: {
    flex: 1,
    gap: 24,
  },
  filtersContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  propertiesContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  scrollTopButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#3b82f6',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
    transform: [{ scale: 1 }],
  },
});

export default PropertiesSell;