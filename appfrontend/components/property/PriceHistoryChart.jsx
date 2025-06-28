import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import priceHistory from './priceHistory';
import { format } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

const PriceHistoryChart = () => {
  // Prepare data for the chart
  const labels = priceHistory.map(entry => {
    const date = new Date(entry.date);
    return format(date, "MMM''yy"); // e.g. Jan'25
  });

  const data = priceHistory.map(entry => entry.price);

  return (
    <View style={styles.chartContainer}>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: data
            }
          ]
        }}
        width={screenWidth - 32} // full width with padding
        height={220}
        yAxisLabel="₹"
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#4bc0c0'
          }
        }}
        bezier
        style={{
          borderRadius: 16
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    width: '100%',
    paddingHorizontal: '8%',
    paddingVertical: '4%',
    alignItems: 'center',
  },
});

export default PriceHistoryChart;
