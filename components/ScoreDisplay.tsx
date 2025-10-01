import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Trophy } from 'lucide-react-native';

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <View style={styles.container}>
      <Trophy size={20} color="#D97706" />
      <Text style={styles.scoreText}>{score}</Text>
      <Text style={styles.label}>pts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
  },
  label: {
    fontSize: 12,
    color: '#78716C',
    fontWeight: '600',
  },
});