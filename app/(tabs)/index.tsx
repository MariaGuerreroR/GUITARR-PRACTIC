import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { strummingPatterns } from '@/data/strummingPatterns';
import { GuitarStrings } from '@/components/GuitarStrings';
import { PatternSelector } from '@/components/PatternSelector';
import { ScoreDisplay } from '@/components/ScoreDisplay';

const { width, height } = Dimensions.get('window');

export default function PracticeScreen() {
  const [selectedPattern, setSelectedPattern] = useState(strummingPatterns[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userPattern, setUserPattern] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  const fadeAnim = new Animated.Value(1);

  const startRecording = () => {
    setIsRecording(true);
    setIsPracticeMode(true);
    setUserPattern([]);
    setCurrentStep(0);
    setFeedback('¡Sigue el patrón!');
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPracticeMode(false);
    checkPattern();
  };

  const handleStringStrum = (direction: 'down' | 'up') => {
    if (!isRecording) return;
    
    const newPattern = [...userPattern, direction];
    setUserPattern(newPattern);
    
    if (newPattern.length >= selectedPattern.pattern.length) {
      setIsRecording(false);
      checkPattern();
    }
  };

  const checkPattern = () => {
    if (userPattern.length === 0) return;

    const isCorrect = userPattern.every(
      (move, index) => move === selectedPattern.pattern[index]
    );

    if (isCorrect && userPattern.length === selectedPattern.pattern.length) {
      setScore(score + selectedPattern.difficulty * 10);
      setFeedback('¡Perfecto! 🎸');
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setFeedback('');
        setUserPattern([]);
      }, 2000);
    } else {
      setFeedback('Inténtalo de nuevo 💪');
      setTimeout(() => {
        setFeedback('');
        setUserPattern([]);
      }, 1500);
    }
  };

  const resetPractice = () => {
    setUserPattern([]);
    setCurrentStep(0);
    setIsRecording(false);
    setIsPracticeMode(false);
    setFeedback('');
  };

  // Simplified horizontal practice view
  if (isPracticeMode) {
    return (
      <SafeAreaView style={styles.practiceContainer}>
        <LinearGradient
          colors={['#8B5A3C', '#A0522D']}
          style={styles.practiceGradient}
        >
          <View style={styles.practicePatternHeader}>
            <Text style={styles.practicePatternName}>{selectedPattern.name}</Text>
            <View style={styles.practicePatternVisualization}>
              {selectedPattern.pattern.map((direction, index) => (
                <View key={index} style={styles.practicePatternStep}>
                  <Text style={styles.practicePatternArrow}>
                    {direction === 'down' ? '↓' : '↑'}
                  </Text>
                  <View
                    style={[
                      styles.practiceStepIndicator,
                      userPattern[index] && {
                        backgroundColor: userPattern[index] === direction
                          ? '#10B981'
                          : '#EF4444'
                      }
                    ]}
                  />
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.exitButton}
              onPress={stopRecording}
            >
              <Text style={styles.exitButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.practiceGuitarArea}>
            <GuitarStrings
              onStrum={handleStringStrum}
              isRecording={isRecording}
              isHorizontal={true}
            />
          </View>

          {feedback && (
            <View style={styles.minimalFeedback}>
              <Text style={styles.minimalFeedbackText}>{feedback}</Text>
            </View>
          )}
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FEF3E2', '#F5F4F0']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Práctica de Rasgueos</Text>
          <ScoreDisplay score={score} />
        </View>

        <PatternSelector
          patterns={strummingPatterns}
          selectedPattern={selectedPattern}
          onSelectPattern={setSelectedPattern}
        />

        <View style={styles.patternDisplay}>
          <Text style={styles.patternName}>{selectedPattern.name}</Text>
          <Text style={styles.patternDescription}>
            {selectedPattern.description}
          </Text>
          
          <View style={styles.patternVisualization}>
            {selectedPattern.pattern.map((direction, index) => (
              <View key={index} style={styles.patternStep}>
                <Text style={styles.patternArrow}>
                  {direction === 'down' ? '↓' : '↑'}
                </Text>
                <View 
                  style={[
                    styles.stepIndicator,
                    userPattern[index] && {
                      backgroundColor: userPattern[index] === direction 
                        ? '#10B981' 
                        : '#EF4444'
                    }
                  ]} 
                />
              </View>
            ))}
          </View>
        </View>

        <GuitarStrings
          onStrum={handleStringStrum}
          isRecording={isRecording}
          isHorizontal={false}
        />

        <View style={styles.controls}>
          {!isRecording ? (
            <TouchableOpacity
              style={styles.startButton}
              onPress={startRecording}
            >
              <Text style={styles.startButtonText}>Comenzar Práctica</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopRecording}
            >
              <Text style={styles.stopButtonText}>Terminar</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetPractice}
          >
            <Text style={styles.resetButtonText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>

        {feedback ? (
          <Animated.View style={[styles.feedback, showSuccess && styles.successFeedback]}>
            <Text style={[styles.feedbackText, showSuccess && styles.successText]}>
              {feedback}
            </Text>
          </Animated.View>
        ) : null}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#92400E',
  },
  patternDisplay: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  patternName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 8,
  },
  patternDescription: {
    fontSize: 14,
    color: '#78716C',
    textAlign: 'center',
    marginBottom: 15,
  },
  patternVisualization: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  patternStep: {
    alignItems: 'center',
    gap: 8,
  },
  patternArrow: {
    fontSize: 24,
    color: '#D97706',
    fontWeight: 'bold',
  },
  stepIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  startButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flex: 1,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stopButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flex: 1,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedback: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D97706',
  },
  successFeedback: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  feedbackText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  successText: {
    color: '#065F46',
  },
  practiceContainer: {
    flex: 1,
    transform: [{ rotate: '90deg' }],
    width: height,
    height: width,
    position: 'absolute',
    top: (height - width) / 2,
    left: (width - height) / 2,
  },
  practiceGradient: {
    flex: 1,
  },
  practicePatternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  practicePatternName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEF3C7',
  },
  practicePatternVisualization: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'center',
  },
  practicePatternStep: {
    alignItems: 'center',
    gap: 6,
  },
  practicePatternArrow: {
    fontSize: 24,
    color: '#FEF3C7',
    fontWeight: 'bold',
  },
  practiceStepIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  exitButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  practiceGuitarArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minimalFeedback: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  minimalFeedbackText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#FEF3C7',
  },
});