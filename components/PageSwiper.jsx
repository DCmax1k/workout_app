import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";

const PageSwiper = forwardRef(({ width, height, children, style, ...props }, ref) => {
    const [currentPage, setCurrentPage] = useState(0);
    const flatListRef = useRef(null);

    const pages = React.Children.toArray(children);

    const handleScroll = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / width);
        setCurrentPage(index);
    };

    // Expose goToPage to parent
    useImperativeHandle(ref, () => ({
        goToPage: (index, animated = true) => {
        if (flatListRef.current && index >= 0 && index < pages.length) {
            flatListRef.current.scrollToIndex({ index, animated });
            setCurrentPage(index);
        }
        },
        getCurrentPage: () => currentPage
    }));

  return (
    <View style={[{ width, height }, style]} {...props}>
      {/* Pages */}
      <FlatList
        ref={flatListRef}
        data={pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ width, height, justifyContent: "flex-start", alignItems: "center" }}>
            {item}
          </View>
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { opacity: currentPage === index ? 1 : 0.15 }
            ]}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    marginHorizontal: 4,
  },
});

export default PageSwiper;
