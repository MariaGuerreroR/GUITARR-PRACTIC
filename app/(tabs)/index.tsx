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
import { useNavigation } from 'expo-router';
import { strummingPatterns } from '@/data/strummingPatterns';
import { GuitarStrings } from '@/components/GuitarStrings';
import { PatternSelector } from '@/components/PatternSelector';
import { ScoreDisplay } from '@/components/ScoreDisplay';

const { width, height } = Dimensions.get('window');

export default function PracticeScreen() {
  const navigation = useNavigation();
  const [selectedPattern, setSelectedPattern] = useState(strummingPatterns[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userPattern, setUserPattern] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [strumTimes, setStrumTimes] = useState<number[]>([]);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);

  useEffect(() => {
    if (isPracticeMode) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({
        tabBarStyle: {
          backgroundColor: '#F5F4F0',
          borderTopColor: '#E7E5E4',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
      });
    }
  }, [isPracticeMode, navigation]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRecording(false);
            setFeedback('¡Tiempo agotado! Intenta de nuevo');
            setTimeout(() => {
              setFeedback('');
              setUserPattern([]);
              setIsRecording(true);
              setTimeLeft(selectedPattern.timeLimit);
              setStrumTimes([]);
            }, 2000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording, timeLeft, selectedPattern.timeLimit]);

  const fadeAnim = new Animated.Value(1);

  const startRecording = () => {
    setIsRecording(true);
    setIsPracticeMode(true);
    setUserPattern([]);
    setCurrentStep(0);
    setAttempts(0);
    setTimeLeft(selectedPattern.timeLimit);
    setStrumTimes([]);
    setAverageSpeed(0);
    setFeedback('¡Sigue el patrón!');
  };

  const exitPracticeMode = () => {
    setIsRecording(false);
    setIsPracticeMode(false);
    setUserPattern([]);
    setFeedback('');
    setAttempts(0);
    setTimeLeft(0);
    setStrumTimes([]);
    setAverageSpeed(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    checkPattern();
  };

  const handleStringStrum = (direction: 'down' | 'up') => {
    if (!isRecording) return;

    const currentTime = Date.now();
    const newStrumTimes = [...strumTimes, currentTime];
    setStrumTimes(newStrumTimes);

    const newPattern = [...userPattern, direction];
    setUserPattern(newPattern);

    if (newPattern.length >= selectedPattern.pattern.length) {
      setIsRecording(false);
      calculateAverageSpeed(newStrumTimes);
      checkPattern();
    }
  };

  const calculateAverageSpeed = (times: number[]) => {
    if (times.length < 2) return;
    const intervals = [];
    for (let i = 1; i < times.length; i++) {
      intervals.push(times[i] - times[i - 1]);
    }
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    setAverageSpeed(avg);
  };

  const checkPattern = () => {
    if (userPattern.length === 0) return;

    setAttempts(prev => prev + 1);

    const isCorrect = userPattern.every(
      (move, index) => move === selectedPattern.pattern[index]
    );

    const speedRating = averageSpeed <= selectedPattern.targetSpeed ? 'Excelente' :
                       averageSpeed <= selectedPattern.targetSpeed * 1.2 ? 'Buena' :
                       averageSpeed <= selectedPattern.targetSpeed * 1.5 ? 'Aceptable' : 'Lenta';

    if (isCorrect && userPattern.length === selectedPattern.pattern.length) {
      const basePoints = selectedPattern.difficulty * 10;
      const speedBonus = averageSpeed <= selectedPattern.targetSpeed ? 20 :
                        averageSpeed <= selectedPattern.targetSpeed * 1.2 ? 10 : 0;
      const timeBonus = timeLeft > selectedPattern.timeLimit / 2 ? 10 : 0;
      const totalPoints = basePoints + speedBonus + timeBonus;

      setScore(score + totalPoints);
      const attemptText = attempts + 1 === 1 ? '1 intento' : `${attempts + 1} intentos`;
      setFeedback(`¡Perfecto! 🎸\nIntentos: ${attemptText}\nVelocidad: ${speedRating}\n+${totalPoints} puntos`);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setFeedback('');
        setUserPattern([]);
        setIsRecording(true);
        setAttempts(0);
        setTimeLeft(selectedPattern.timeLimit);
        setStrumTimes([]);
      }, 3500);
    } else {
      setFeedback(`Intento ${attempts + 1} - Inténtalo de nuevo 💪`);
      setTimeout(() => {
        setFeedback('');
        setUserPattern([]);
        setIsRecording(true);
        setTimeLeft(selectedPattern.timeLimit);
        setStrumTimes([]);
      }, 1500);
    }
  };

  const resetPractice = () => {
    setUserPattern([]);
    setCurrentStep(0);
    setIsRecording(false);
    setIsPracticeMode(false);
    setFeedback('');
    setAttempts(0);
    setTimeLeft(0);
    setStrumTimes([]);
    setAverageSpeed(0);
  };

  const filteredPatterns = selectedDifficulty
    ? strummingPatterns.filter(p => p.difficulty === selectedDifficulty)
    : strummingPatterns;

  // Simplified horizontal practice view
  if (isPracticeMode) {
    return (
      <SafeAreaView style={styles.practiceContainer}>
        <LinearGradient
          colors={['#8B5A3C', '#A0522D']}
          style={styles.practiceGradient}
        >
          <View style={styles.practicePatternHeader}>
            <View style={styles.practiceHeaderLeft}>
              <Text style={styles.practicePatternName}>{selectedPattern.name}</Text>
              <View style={styles.practiceStats}>
                <View style={styles.timerContainer}>
                  <Text style={styles.timerLabel}>Tiempo:</Text>
                  <Text style={[styles.timerValue, timeLeft <= 5 && styles.timerWarning]}>
                    {timeLeft}s
                  </Text>
                </View>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyBadgeText}>{selectedPattern.difficultyLabel}</Text>
                </View>
              </View>
            </View>
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
              onPress={exitPracticeMode}
            >
              <Text style={styles.exitButtonText}>✕ Salir</Text>
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

        <View style={styles.difficultySelector}>
          <Text style={styles.difficultySelectorTitle}>Nivel de Dificultad</Text>
          <View style={styles.difficultyButtons}>
            <TouchableOpacity
              style={[styles.difficultyButton, selectedDifficulty === null && styles.difficultyButtonActive]}
              onPress={() => setSelectedDifficulty(null)}
            >
              <Text style={[styles.difficultyButtonText, selectedDifficulty === null && styles.difficultyButtonTextActive]}>
                Todos
              </Text>
            </TouchableOpacity>
            {[1, 2, 3, 4, 5].map(level => {
              const labels = ['Principiante', 'Fácil', 'Intermedio', 'Avanzado', 'Experto'];
              return (
                <TouchableOpacity
                  key={level}
                  style={[styles.difficultyButton, selectedDifficulty === level && styles.difficultyButtonActive]}
                  onPress={() => setSelectedDifficulty(level)}
                >
                  <Text style={[styles.difficultyButtonText, selectedDifficulty === level && styles.difficultyButtonTextActive]}>
                    {labels[level - 1]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <PatternSelector
          patterns={filteredPatterns}
          selectedPattern={selectedPattern}
          onSelectPattern={setSelectedPattern}
        />

        <View style={styles.patternDisplay}>
          <View style={styles.patternHeader}>
            <Text style={styles.patternName}>{selectedPattern.name}</Text>
            <View style={styles.patternDifficultyBadge}>
              <Text style={styles.patternDifficultyText}>{selectedPattern.difficultyLabel}</Text>
            </View>
          </View>
          <Text style={styles.patternDescription}>
            {selectedPattern.description}
          </Text>
          <View style={styles.patternMetadata}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Tiempo límite:</Text>
              <Text style={styles.metadataValue}>{selectedPattern.timeLimit}s</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>BPM:</Text>
              <Text style={styles.metadataValue}>{selectedPattern.bpm}</Text>
            </View>
          </View>
          
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
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patternName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400E',
  },
  patternDifficultyBadge: {
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  patternDifficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  patternMetadata: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 15,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metadataLabel: {
    fontSize: 12,
    color: '#78716C',
    fontWeight: '600',
  },
  metadataValue: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: 'bold',
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
  difficultySelector: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  difficultySelectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 10,
    textAlign: 'center',
  },
  difficultyButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  difficultyButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F4F0',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  difficultyButtonActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  difficultyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716C',
  },
  difficultyButtonTextActive: {
    color: 'white',
  },
  practicePatternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  practiceHeaderLeft: {
    flex: 1,
  },
  practiceStats: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 8,
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 5,
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FEF3C7',
  },
  timerValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  timerWarning: {
    color: '#EF4444',
  },
  difficultyBadge: {
    backgroundColor: 'rgba(217, 119, 6, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  difficultyBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
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
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitButtonText: {
    color: 'white',
    fontSize: 16,
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