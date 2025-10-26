import React from 'react';
import { Card as PaperCard } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: object;
  onPress?: () => void;
}

export function Card({ children, title, style, onPress }: CardProps) {
  return (
    <PaperCard style={[styles.card, style]} onPress={onPress}>
      {title && <PaperCard.Title title={title} />}
      <PaperCard.Content>{children}</PaperCard.Content>
    </PaperCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
});