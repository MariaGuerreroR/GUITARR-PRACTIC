export interface StrummingPattern {
  id: number;
  name: string;
  description: string;
  pattern: string[]; // 'down' or 'up'
  difficulty: number; // 1-5
  difficultyLabel: 'Principiante' | 'Fácil' | 'Intermedio' | 'Avanzado' | 'Experto';
  bpm: number;
  timeLimit: number; // segundos para completar
  targetSpeed: number; // milisegundos entre rasgueos
  instructions: string;
  tips: string[];
}

export const strummingPatterns: StrummingPattern[] = [
  {
    id: 1,
    name: 'Rasgueo Básico',
    description: 'El patrón fundamental para comenzar',
    pattern: ['down', 'down', 'down', 'down'],
    difficulty: 1,
    difficultyLabel: 'Principiante',
    bpm: 80,
    timeLimit: 45,
    targetSpeed: 750,
    instructions: 'Rasguea hacia abajo 4 veces de forma constante. Mantén el ritmo y la presión uniforme en todas las cuerdas.',
    tips: [
      'Usa la muñeca, no todo el brazo',
      'Mantén un ritmo constante',
      'Presiona ligeramente las cuerdas'
    ]
  },
  {
    id: 2,
    name: 'Alternado Simple',
    description: 'Combinación básica de rasgueos arriba y abajo',
    pattern: ['down', 'up', 'down', 'up'],
    difficulty: 2,
    difficultyLabel: 'Fácil',
    bpm: 90,
    timeLimit: 40,
    targetSpeed: 667,
    instructions: 'Alterna entre rasgueos hacia abajo y hacia arriba. El movimiento debe ser fluido y continuo.',
    tips: [
      'No pares el movimiento entre rasgueos',
      'El rasgueo hacia arriba es más suave',
      'Practica despacio primero'
    ]
  },
  {
    id: 3,
    name: 'Rock Clásico',
    description: 'Patrón típico del rock y pop',
    pattern: ['down', 'down', 'up', 'up', 'down', 'up'],
    difficulty: 3,
    difficultyLabel: 'Intermedio',
    bpm: 120,
    timeLimit: 35,
    targetSpeed: 500,
    instructions: 'Patrón muy usado en rock. Dos rasgueos hacia abajo, seguidos de dos hacia arriba, uno abajo y uno arriba.',
    tips: [
      'Acentúa el primer tiempo',
      'Mantén el groove constante',
      'Ideal para canciones de rock clásico'
    ]
  },
  {
    id: 4,
    name: 'Pop Moderno',
    description: 'Patrón popular en música contemporánea',
    pattern: ['down', 'up', 'down', 'up', 'down', 'down', 'up'],
    difficulty: 3,
    difficultyLabel: 'Intermedio',
    bpm: 110,
    timeLimit: 38,
    targetSpeed: 545,
    instructions: 'Patrón rítmico moderno con énfasis en el groove. Combina rasgueos alternados con dobles hacia abajo.',
    tips: [
      'Escucha la música pop para familiarizarte',
      'El timing es crucial',
      'Practica con metrónomo'
    ]
  },
  {
    id: 5,
    name: 'Balada Romántica',
    description: 'Suave y melódico para baladas',
    pattern: ['down', 'down', 'up', 'down', 'up'],
    difficulty: 2,
    difficultyLabel: 'Fácil',
    bpm: 70,
    timeLimit: 50,
    targetSpeed: 857,
    instructions: 'Patrón suave y expresivo. Perfecto para canciones lentas y emotivas.',
    tips: [
      'Toca con suavidad',
      'Deja que las cuerdas resuenen',
      'Perfecto para canciones de amor'
    ]
  },
  {
    id: 6,
    name: 'Reggae Básico',
    description: 'El clásico upstroke del reggae',
    pattern: ['up', 'down', 'up', 'down'],
    difficulty: 3,
    difficultyLabel: 'Intermedio',
    bpm: 140,
    timeLimit: 30,
    targetSpeed: 429,
    instructions: 'Empieza con rasgueo hacia arriba. Típico del reggae, con énfasis en los contratiempos.',
    tips: [
      'Acentúa los rasgueos hacia arriba',
      'Mantén un groove relajado',
      'Escucha reggae para entender el feeling'
    ]
  },
  {
    id: 7,
    name: 'Country Swing',
    description: 'Patrón con swing típico del country',
    pattern: ['down', 'down', 'up', 'down', 'up', 'down'],
    difficulty: 4,
    difficultyLabel: 'Avanzado',
    bpm: 130,
    timeLimit: 32,
    targetSpeed: 462,
    instructions: 'Patrón con swing característico del country. Requiere buen timing y control dinámico.',
    tips: [
      'Siente el swing en el ritmo',
      'Varía la intensidad',
      'Practica con canciones country'
    ]
  },
  {
    id: 8,
    name: 'Funk Groove',
    description: 'Patrón rítmico del funk con silencios',
    pattern: ['down', 'up', 'down', 'up'],
    difficulty: 4,
    difficultyLabel: 'Avanzado',
    bpm: 100,
    timeLimit: 35,
    targetSpeed: 600,
    instructions: 'Patrón de funk con técnica de palm muting. Incluye silencios y acentos marcados.',
    tips: [
      'Usa palm muting para los silencios',
      'Acentúa los contratiempos',
      'El groove es lo más importante'
    ]
  },
  {
    id: 9,
    name: 'Bossa Nova',
    description: 'Patrón suave y sofisticado',
    pattern: ['down', 'up', 'down', 'down', 'up', 'down', 'up'],
    difficulty: 5,
    difficultyLabel: 'Experto',
    bpm: 120,
    timeLimit: 28,
    targetSpeed: 500,
    instructions: 'Patrón sofisticado de bossa nova. Requiere sutileza y control dinámico preciso.',
    tips: [
      'Toca con mucha sutileza',
      'Siente el swing brasileño',
      'Escucha João Gilberto para referencia'
    ]
  },
  {
    id: 10,
    name: 'Flamenco Básico',
    description: 'Introducción al rasgueo flamenco',
    pattern: ['down', 'up', 'down', 'up', 'down', 'down', 'up', 'down'],
    difficulty: 5,
    difficultyLabel: 'Experto',
    bpm: 140,
    timeLimit: 25,
    targetSpeed: 429,
    instructions: 'Patrón básico de flamenco. Requiere técnica especial con los dedos y gran precisión.',
    tips: [
      'Usa los dedos para el rasgueo',
      'Practica la técnica flamenca',
      'Busca un maestro de flamenco',
      'La posición de la mano es crucial'
    ]
  }
];