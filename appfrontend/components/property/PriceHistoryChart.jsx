import React, { useState, useEffect } from "react";
import { View, Dimensions, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import priceHistory from "./priceHistory";
import { format } from "date-fns";

const PriceHistoryChart = () => {
  const [screenData, setScreenData] = useState(Dimensions.get("window"));

  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  const screenWidth = screenData.width;
  const chartWidth = screenWidth - 32;
  const chartHeight = 180; // Fixed compact height

  // Show only last 6 data points for minimal display
  const processedData = priceHistory.slice(-6);

  const labels = processedData.map((entry) => {
    const date = new Date(entry.date);
    return format(date, "MMM"); // Just month names
  });

  const data = processedData.map((entry) => entry.price);

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: "3",
      strokeWidth: "2",
      stroke: "#4bc0c0",
    },
    propsForLabels: {
      fontSize: 11,
    },
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View>
      <Text style={styles.header}>Price History</Text>
      <View style={styles.container}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={chartHeight}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={false}
          yAxisSuffix=""
          yAxisPrefix="$"
          segments={3}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    // paddingVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 12,
  },
});

export default PriceHistoryChart;
