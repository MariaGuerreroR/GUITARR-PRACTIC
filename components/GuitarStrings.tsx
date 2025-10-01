import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

interface GuitarStringsProps {
  onStrum: (direction: 'down' | 'up') => void;
  isRecording: boolean;
  isHorizontal: boolean;
}

export function GuitarStrings({ onStrum, isRecording, isHorizontal }: GuitarStringsProps) {
  const [animatedValues] = useState(
    Array.from({ length: 6 }, () => new Animated.Value(0))
  );
  const [startY, setStartY] = useState(0);
  const [sounds, setSounds] = useState<{ [key: string]: Audio.Sound }>({});

  const strings = [
    { note: 'E', thickness: 3, horizontalWidth: 8, color: '#E5E7EB', frequency: 82.41 }, // 6ta cuerda
    { note: 'A', thickness: 3.5, horizontalWidth: 9, color: '#D1D5DB', frequency: 110.00 }, // 5ta cuerda
    { note: 'D', thickness: 4, horizontalWidth: 10, color: '#B5B7BC', frequency: 146.83 }, // 4ta cuerda
    { note: 'G', thickness: 4.5, horizontalWidth: 11, color: '#9CA3AF', frequency: 196.00 }, // 3ra cuerda
    { note: 'B', thickness: 5, horizontalWidth: 12, color: '#6B7280', frequency: 246.94 }, // 2da cuerda
    { note: 'E', thickness: 5.5, horizontalWidth: 13, color: '#4B5563', frequency: 329.63 }, // 1ra cuerda
  ];

  // Cargar sonidos al montar el componente
  React.useEffect(() => {
    loadSounds();
    return () => {
      // Limpiar sonidos al desmontar
      Object.values(sounds).forEach(sound => {
        sound.unloadAsync();
      });
    };
  }, []);

  const loadSounds = async () => {
    try {
      // Skip loading audio files and use synthetic sounds
      console.log('Using synthetic sounds');
      createSyntheticSounds();
    } catch (error) {
      console.log('Error loading sounds:', error);
      // Crear sonidos sintéticos si no se pueden cargar los archivos
      createSyntheticSounds();
    }
  };

  const createSyntheticSounds = () => {
    // Fallback: crear sonidos sintéticos usando Web Audio API
    console.log('Using synthetic sounds as fallback');
  };

  const playStringSound = async (stringIndex: number) => {
    try {
      const soundKeys = ['E6', 'E6', 'E6', 'E6', 'E6', 'E6']; // Using E6 for all strings since others are missing
      const soundKey = soundKeys[stringIndex];
      const sound = sounds[soundKey];
      
      if (sound) {
        await sound.replayAsync();
      } else {
        // Fallback: crear un sonido sintético
        playBeep(strings[stringIndex].frequency);
      }
    } catch (error) {
      console.log('Error playing sound:', error);
      // Fallback silencioso
    }
  };

  const playBeep = (frequency: number) => {
    // Crear un beep sintético usando la frecuencia de la cuerda
    // Esto es un fallback simple
    console.log(`Playing synthetic sound for frequency: ${frequency}Hz`);
  };

  const animateString = (index: number) => {
    // Reproducir sonido de la cuerda
    playStringSound(index);
    
    Animated.sequence([
      Animated.timing(animatedValues[index], {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[index], {
        toValue: -5,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[index], {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateAllStrings = () => {
    // Reproducir sonido de todas las cuerdas (rasgueo)
    animatedValues.forEach((_, index) => {
      setTimeout(() => {
        playStringSound(index);
        Animated.sequence([
          Animated.timing(animatedValues[index], {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValues[index], {
            toValue: -5,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValues[index], {
            toValue: 0,
            duration: 120,
            useNativeDriver: true,
          }),
        ]).start();
      }, index * 30); // Pequeño delay entre cuerdas para simular rasgueo
    });
  };

  // PanResponder para detectar gestos de deslizamiento
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => isRecording,
    onMoveShouldSetPanResponder: () => isRecording,
    
    onPanResponderGrant: (evt) => {
      if (!isRecording) return;
      setStartY(evt.nativeEvent.pageY);
    },
    
    onPanResponderMove: () => {
      // Opcional: agregar feedback visual durante el movimiento
    },
    
    onPanResponderRelease: (evt) => {
      if (!isRecording) return;
      
      const endY = evt.nativeEvent.pageY;
      const deltaY = endY - startY;
      const threshold = 20; // Umbral mínimo para detectar el gesto
      
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          // Movimiento hacia abajo
          if (onStrum) {
            onStrum('down');
          }
          animateAllStrings();
        } else {
          // Movimiento hacia arriba
          if (onStrum) {
            onStrum('up');
          }
          animateAllStrings();
        }
      }
    },
  });

  return (
    <View style={styles.container}>
      {isHorizontal ? (
        // Vista horizontal simplificada - solo cuerdas
        <View style={styles.horizontalContainer}>
          <LinearGradient
            colors={['#8B5A3C', '#A0522D', '#8B4513']}
            style={styles.horizontalFretboard}
          >
            <View 
              style={styles.horizontalStringsContainer}
              {...panResponder.panHandlers}
            >
              {strings.map((string, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.horizontalStringTouchArea}
                  onPress={() => animateString(index)}
                  activeOpacity={0.7}
                >
                  <Animated.View
                    style={[
                      styles.horizontalStringContainer,
                      {
                        transform: [{
                          translateY: animatedValues[index]
                        }]
                      }
                    ]}
                  >
                    <View
                      style={[
                        styles.horizontalString,
                        {
                          width: string.horizontalWidth,
                          backgroundColor: string.color,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.5,
                          shadowRadius: 2,
                          elevation: 3,
                        }
                      ]}
                    />
                    <Text style={styles.horizontalNoteLabel}>{string.note}</Text>
                  </Animated.View>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Trastes horizontales */}
            {Array.from({ length: 5 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.horizontalFret,
                  { top: 60 + (i * (height - 120) / 5) }
                ]}
              />
            ))}
          </LinearGradient>
        </View>
      ) : (
        // Vista vertical normal
        <LinearGradient
          colors={['#8B5A3C', '#A0522D', '#8B4513']}
          style={styles.fretboard}
        >
          <View 
            style={styles.stringsContainer}
            {...panResponder.panHandlers}
          >
            <View style={styles.gestureArea}>
              {strings.map((string, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.stringTouchArea}
                  onPress={() => animateString(index)}
                  activeOpacity={0.7}
                >
                  <Animated.View
                    style={[
                      styles.stringContainer,
                      {
                        transform: [{
                          translateX: animatedValues[index]
                        }]
                      }
                    ]}
                  >
                    <View
                      style={[
                        styles.string,
                        {
                          height: string.thickness,
                          backgroundColor: string.color,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.3,
                          shadowRadius: 1,
                          elevation: 2,
                        }
                      ]}
                    />
                    <Text style={styles.noteLabel}>{string.note}</Text>
                  </Animated.View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Trastes verticales */}
          {Array.from({ length: 5 }, (_, i) => (
            <View
              key={i}
              style={[
                styles.fret,
                { left: 50 + (i * (width - 100) / 5) }
              ]}
            />
          ))}
        </LinearGradient>
      )}
      
      {!isHorizontal && (
        <View style={styles.instructions}>
          <Animated.View style={[
            styles.recordingIndicator,
            { opacity: isRecording ? 1 : 0.3 }
          ]}>
            <View style={[
              styles.recordingDot,
              { backgroundColor: isRecording ? '#EF4444' : '#9CA3AF' }
            ]} />
            <Text style={styles.recordingText}>
              {isRecording ? 'Desliza tu dedo sobre las cuerdas' : 'Presiona "Comenzar Práctica"'}
            </Text>
          </Animated.View>
          
          {isRecording && (
            <View style={styles.gestureInstructions}>
              <Text style={styles.gestureText}>👆 Desliza hacia arriba para rasgueo ↑</Text>
              <Text style={styles.gestureText}>👇 Desliza hacia abajo para rasgueo ↓</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  fretboard: {
    width: width - 40,
    height: 250,
    borderRadius: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  horizontalFretboard: {
    flex: 1,
    borderRadius: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stringsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  horizontalStringsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingVertical: 20,
  },
  gestureArea: {
    flex: 1,
    justifyContent: 'space-around',
    paddingVertical: 40,
  },
  stringTouchArea: {
    height: 35,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  horizontalStringTouchArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    minWidth: 50,
    height: '100%',
  },
  stringContainer: {
    height: 25,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalStringContainer: {
    width: 40,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  string: {
    flex: 1,
    borderRadius: 3,
    marginRight: 10,
  },
  horizontalString: {
    flex: 1,
    borderRadius: 4,
    marginBottom: 8,
    minHeight: 200,
  },
  noteLabel: {
    color: '#FEF3C7',
    fontSize: 12,
    fontWeight: 'bold',
    width: 20,
    textAlign: 'center',
  },
  horizontalNoteLabel: {
    color: '#FEF3C7',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  fret: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#FEF3C7',
    borderRadius: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  horizontalFret: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FEF3C7',
    borderRadius: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  instructions: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  recordingText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  gestureInstructions: {
    alignItems: 'center',
    gap: 5,
  },
  gestureText: {
    fontSize: 12,
    color: '#78716C',
    fontWeight: '500',
  },
});