import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type ScreenWrapperProps = {
  children: React.ReactNode;
  gradientColors?: [string, string, ...string[]]; // At least 2 colors
  style?: ViewStyle;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  gradientColors = ["#e0f7fa", "#ffffff"],
  style,
}) => {
  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <View style={[styles.content, style]}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 80, // ensures bottom elements are tappable
  },
});

export default ScreenWrapper;
