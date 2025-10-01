import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { StrummingPattern } from '@/data/strummingPatterns';

interface PatternSelectorProps {
  patterns: StrummingPattern[];
  selectedPattern: StrummingPattern;
  onSelectPattern: (pattern: StrummingPattern) => void;
}

export function PatternSelector({ 
  patterns, 
  selectedPattern, 
  onSelectPattern 
}: PatternSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona un Patrón</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {patterns.map((pattern) => (
          <TouchableOpacity
            key={pattern.id}
            style={[
              styles.patternCard,
              selectedPattern.id === pattern.id && styles.selectedCard
            ]}
            onPress={() => onSelectPattern(pattern)}
          >
            <Text style={[
              styles.patternName,
              selectedPattern.id === pattern.id && styles.selectedText
            ]}>
              {pattern.name}
            </Text>
            
            <View style={styles.difficultyContainer}>
              {Array.from({ length: 5 }, (_, i) => (
                <Text
                  key={i}
                  style={[
                    styles.star,
                    i < pattern.difficulty && styles.filledStar
                  ]}
                >
                  ★
                </Text>
              ))}
            </View>
            
            <View style={styles.patternPreview}>
              {pattern.pattern.slice(0, 4).map((direction, index) => (
                <Text key={index} style={styles.previewArrow}>
                  {direction === 'down' ? '↓' : '↑'}
                </Text>
              ))}
              {pattern.pattern.length > 4 && (
                <Text style={styles.moreIndicator}>...</Text>
              )}
            </View>
            
            <Text style={styles.bpmText}>{pattern.bpm} BPM</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  scrollView: {
    paddingLeft: 20,
  },
  scrollContent: {
    paddingRight: 20,
    gap: 12,
  },
  patternCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#D97706',
    backgroundColor: '#FEF3E2',
  },
  patternName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  selectedText: {
    color: '#92400E',
  },
  difficultyContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  star: {
    fontSize: 12,
    color: '#E5E7EB',
  },
  filledStar: {
    color: '#F59E0B',
  },
  patternPreview: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 8,
  },
  previewArrow: {
    fontSize: 16,
    color: '#D97706',
    fontWeight: 'bold',
  },
  moreIndicator: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  bpmText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
});