import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
    // بيانات تجريبية (يمكن ربطها لاحقاً بـ Context أو Redux لربط الشاشات ببعضها)
    const [userData, setUserData] = useState({
        name: 'mohamed',
        avatar: 'https://via.placeholder.com/150', // أو صورة المستخدم
    });

    const [stats, setStats] = useState({
        steps: 6420,
        stepGoal: 10000,
        lastBpm: 72,
        bpmStatus: 'Normal',
        waterIntake: 1.8, // لتر
        caloriesBurned: 350,
    });

    // حساب نسبة تقدم الخطوات
    const stepProgress = Math.min((stats.steps / stats.stepGoal) * 100, 100).toFixed(0);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                
                {/* 1. الهيدر: بيانات المستخدم والترحيب */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greetingText}>مرحباً بك 👋</Text>
                        <Text style={styles.userName}>{userData.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* 2. ملخص اليوم الرئيسي (بطاقة الخطوات) */}
                <View style={styles.mainCard}>
                    <View style={styles.mainCardHeader}>
                        <Text style={styles.mainCardTitle}>خطوات اليوم 🚶‍♂️</Text>
                        <Text style={styles.mainCardSub}>{stats.steps} / {stats.stepGoal} خطوة</Text>
                    </View>
                    
                    {/* شريط التقدم */}
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: `${stepProgress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>حققت {stepProgress}% من هدفك اليومي</Text>
                </View>

                {/* 3. كروت الإحصائيات السريعة (Grid) */}
                <Text style={styles.sectionTitle}>الملخص الصحي</Text>
                
                <View style={styles.statsGrid}>
                    {/* كارت نبضات القلب */}
                    <TouchableOpacity 
                        style={[styles.statCard, { borderLeftColor: '#EF4444', borderLeftWidth: 4 }]}
                        onPress={() => navigation.navigate('HeartRate')}
                    >
                        <Text style={styles.statIcon}>❤️</Text>
                        <Text style={styles.statLabel}>آخر قياس نبض</Text>
                        <Text style={styles.statValue}>{stats.lastBpm} <Text style={styles.unitText}>BPM</Text></Text>
                        <Text style={[styles.statusBadge, { color: '#10B981' }]}>{stats.bpmStatus}</Text>
                    </TouchableOpacity>

                    {/* كارت السعرات الحرارية */}
                    <TouchableOpacity 
                        style={[styles.statCard, { borderLeftColor: '#F59E0B', borderLeftWidth: 4 }]}
                        onPress={() => navigation.navigate('ActivityTracker')}
                    >
                        <Text style={styles.statIcon}>🔥</Text>
                        <Text style={styles.statLabel}>الحرق اليومي</Text>
                        <Text style={styles.statValue}>{stats.caloriesBurned} <Text style={styles.unitText}>kcal</Text></Text>
                        <Text style={styles.subDetail}>مستوى نشاط جيد</Text>
                    </TouchableOpacity>
                </View>

                {/* 4. الوصول السريع للميزات (Quick Actions) */}
                <Text style={styles.sectionTitle}>الخدمات السريعة</Text>
                
                <View style={styles.quickActionsContainer}>
                    {/* زر تحليل الطعام بالذكاء الاصطناعي */}
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('FoodAnalyzer')}
                    >
                        <View style={[styles.actionIconBg, { backgroundColor: '#EEF2FF' }]}>
                            <Text style={styles.actionIcon}>🥗</Text>
                        </View>
                        <Text style={styles.actionText}>تحليل الوجبة (AI)</Text>
                    </TouchableOpacity>

                    {/* زر الحاسبة الصحية */}
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('HealthCalculator')}
                    >
                        <View style={[styles.actionIconBg, { backgroundColor: '#F0FDF4' }]}>
                            <Text style={styles.actionIcon}>🧮</Text>
                        </View>
                        <Text style={styles.actionText}>حاسبة الصحة</Text>
                    </TouchableOpacity>

                    {/* زر تتبع النشاط والخطوات */}
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('ActivityTracker')}
                    >
                        <View style={[styles.actionIconBg, { backgroundColor: '#FEF3C7' }]}>
                            <Text style={styles.actionIcon}>👟</Text>
                        </View>
                        <Text style={styles.actionText}>تتبع الخطوات</Text>
                    </TouchableOpacity>

                    {/* زر قياس النبض */}
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('HeartRate')}
                    >
                        <View style={[styles.actionIconBg, { backgroundColor: '#FEE2E2' }]}>
                            <Text style={styles.actionIcon}>💓</Text>
                        </View>
                        <Text style={styles.actionText}>قياس النبض</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    container: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greetingText: {
        fontSize: 14,
        color: '#64748B',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    mainCard: {
        backgroundColor: '#6366F1',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        elevation: 4,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    mainCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    mainCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    mainCardSub: {
        fontSize: 14,
        color: '#E0E7FF',
    },
    progressBarBackground: {
        height: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
    },
    progressText: {
        fontSize: 12,
        color: '#E0E7FF',
        textAlign: 'right',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 15,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 25,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 15,
        elevation: 2,
    },
    statIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    unitText: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#64748B',
    },
    statusBadge: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    subDetail: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 4,
    },
    quickActionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 20,
    },
    actionButton: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 15,
        alignItems: 'center',
        elevation: 2,
    },
    actionIconBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionIcon: {
        fontSize: 24,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },
});