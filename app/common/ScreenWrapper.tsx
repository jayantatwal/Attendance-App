import React from "react";
import { ScrollView, ViewStyle, StyleSheet } from "react-native";
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
      <ScrollView
        contentContainerStyle={[styles.scrollContent, style]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // ensures bottom elements are tappable
  },
});

export default ScreenWrapper;
