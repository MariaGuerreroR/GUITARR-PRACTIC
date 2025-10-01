import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Target, Clock, TrendingUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  // Datos simulados de progreso
  const stats = {
    totalScore: 1250,
    patternsLearned: 6,
    totalPatterns: 10,
    practiceTime: 45, // en minutos
    streak: 7, // días consecutivos
  };

  const achievements = [
    { id: 1, title: 'Primer Rasgueo', description: 'Completaste tu primer patrón', earned: true },
    { id: 2, title: 'Ritmo Constante', description: 'Practica 7 días seguidos', earned: true },
    { id: 3, title: 'Explorador Musical', description: 'Aprende 5 patrones diferentes', earned: true },
    { id: 4, title: 'Velocista', description: 'Completa un patrón en menos de 30 segundos', earned: false },
    { id: 5, title: 'Maestro del Ritmo', description: 'Domina todos los patrones', earned: false },
  ];

  const recentActivity = [
    { pattern: 'Rasgueo Básico', score: 80, date: 'Hoy' },
    { pattern: 'Rock Clásico', score: 95, date: 'Ayer' },
    { pattern: 'Pop Moderno', score: 75, date: 'Hace 2 días' },
  ];

  const StatCard = ({ icon, title, value, subtitle }: any) => (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const AchievementItem = ({ achievement }: { achievement: any }) => (
    <View style={[styles.achievementItem, achievement.earned && styles.achievementEarned]}>
      <Trophy 
        size={24} 
        color={achievement.earned ? '#D97706' : '#9CA3AF'} 
      />
      <View style={styles.achievementText}>
        <Text style={[styles.achievementTitle, achievement.earned && styles.achievementTitleEarned]}>
          {achievement.title}
        </Text>
        <Text style={styles.achievementDescription}>
          {achievement.description}
        </Text>
      </View>
      {achievement.earned && (
        <View style={styles.earnedBadge}>
          <Text style={styles.earnedText}>✓</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FEF3E2', '#F5F4F0']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TrendingUp size={32} color="#92400E" />
          <Text style={styles.title}>Tu Progreso</Text>
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statsGrid}>
            <StatCard
              icon={<Target size={24} color="#10B981" />}
              title="Puntuación Total"
              value={stats.totalScore}
            />
            <StatCard
              icon={<Trophy size={24} color="#F59E0B" />}
              title="Patrones"
              value={`${stats.patternsLearned}/${stats.totalPatterns}`}
              subtitle="Aprendidos"
            />
            <StatCard
              icon={<Clock size={24} color="#3B82F6" />}
              title="Tiempo"
              value={`${stats.practiceTime}m`}
              subtitle="Esta semana"
            />
            <StatCard
              icon={<TrendingUp size={24} color="#EF4444" />}
              title="Racha"
              value={`${stats.streak} días`}
              subtitle="Consecutivos"
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Logros</Text>
            <View style={styles.achievementsList}>
              {achievements.map((achievement) => (
                <AchievementItem key={achievement.id} achievement={achievement} />
              ))}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Actividad Reciente</Text>
            <View style={styles.activityList}>
              {recentActivity.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityPattern}>{activity.pattern}</Text>
                    <Text style={styles.activityDate}>{activity.date}</Text>
                  </View>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{activity.score}</Text>
                    <Text style={styles.scoreLabel}>pts</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.motivationalSection}>
            <Text style={styles.motivationalTitle}>¡Sigue así!</Text>
            <Text style={styles.motivationalText}>
              Has progresado mucho en tu aprendizaje de guitarra. 
              ¡Continúa practicando para desbloquear más logros!
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    gap: 10,
  },
  statCard: {
    backgroundColor: 'white',
    width: (width - 50) / 2,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    color: '#78716C',
    textAlign: 'center',
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 15,
  },
  achievementsList: {
    gap: 10,
  },
  achievementItem: {
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 15,
  },
  achievementEarned: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  achievementTitleEarned: {
    color: '#92400E',
  },
  achievementDescription: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  earnedBadge: {
    backgroundColor: '#10B981',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityList: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityInfo: {
    flex: 1,
  },
  activityPattern: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  motivationalSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  motivationalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 10,
  },
  motivationalText: {
    fontSize: 14,
    color: '#78716C',
    textAlign: 'center',
    lineHeight: 20,
  },
});