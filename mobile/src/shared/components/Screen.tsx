import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

type ScreenProps = PropsWithChildren<{
  edges?: readonly Edge[];
  style?: ViewStyle;
}>;

const DEFAULT_EDGES: readonly Edge[] = ['top', 'left', 'right'];

export const Screen = ({ children, edges = DEFAULT_EDGES, style }: ScreenProps) => (
  <SafeAreaView style={styles.safeArea} edges={edges}>
    <View style={[styles.content, style]}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
