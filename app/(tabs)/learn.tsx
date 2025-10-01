import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { strummingPatterns } from '@/data/strummingPatterns';
import { Play, BookOpen } from 'lucide-react-native';

export default function LearnScreen() {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const PatternCard = ({ pattern, index }: { pattern: any; index: number }) => (
    <TouchableOpacity
      style={styles.patternCard}
      onPress={() => setSelectedLesson(selectedLesson === index ? null : index)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Text style={styles.patternName}>{pattern.name}</Text>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              {'★'.repeat(pattern.difficulty)}
            </Text>
          </View>
        </View>
        <Play size={20} color="#D97706" />
      </View>
      
      <Text style={styles.patternDescription}>{pattern.description}</Text>
      
      <View style={styles.patternPreview}>
        {pattern.pattern.map((direction: string, idx: number) => (
          <Text key={idx} style={styles.patternArrow}>
            {direction === 'down' ? '↓' : '↑'}
          </Text>
        ))}
      </View>

      {selectedLesson === index && (
        <View style={styles.lessonDetails}>
          <Text style={styles.lessonTitle}>Cómo tocar este rasgueo:</Text>
          <Text style={styles.lessonText}>{pattern.instructions}</Text>
          
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Consejos:</Text>
            {pattern.tips.map((tip: string, tipIndex: number) => (
              <Text key={tipIndex} style={styles.tipText}>• {tip}</Text>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FEF3E2', '#F5F4F0']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <BookOpen size={32} color="#92400E" />
          <Text style={styles.title}>Aprende Rasgueos</Text>
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.introduction}>
            <Text style={styles.introTitle}>¡Bienvenido al curso de rasgueos!</Text>
            <Text style={styles.introText}>
              Aprende diferentes patrones de rasgueo paso a paso. Cada patrón incluye
              instrucciones detalladas y consejos para mejorar tu técnica.
            </Text>
          </View>
          {strummingPatterns.map((pattern, index) => (
            <PatternCard key={index} pattern={pattern} index={index} />
          ))}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ¡Practica cada patrón hasta dominarlo antes de pasar al siguiente!
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#92400E',
  },
  content: {
    flex: 1,
  },
  introduction: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 10,
  },
  introText: {
    fontSize: 16,
    color: '#78716C',
    lineHeight: 24,
  },
  patternCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  patternName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
  },
  difficultyBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: 'bold',
  },
  patternDescription: {
    fontSize: 14,
    color: '#78716C',
    marginBottom: 15,
    lineHeight: 20,
  },
  patternPreview: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
  },
  patternArrow: {
    fontSize: 20,
    color: '#D97706',
    fontWeight: 'bold',
  },
  lessonDetails: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 10,
  },
  lessonText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 15,
  },
  tipsContainer: {
    backgroundColor: '#F0F9FF',
    padding: 15,
    borderRadius: 10,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0369A1',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 4,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#78716C',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});