import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions } from 'react-native';
import { Pedometer } from 'expo-sensors';

const { width } = Dimensions.get('window');

export default function ActivityTracker() { 

    const [isTracking, setIsTracking] = useState(false); 
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [steps, setSteps] = useState(0);
    const [second, setSecond] = useState(0);
     
    // 1. طلب الإذن والتحقق
    useEffect(() => {
        const checkSensor = async () => {
            try {
                const isAvailable = await Pedometer.isAvailableAsync();
                
                if (!isAvailable) {
                    setIsPedometerAvailable('not_available');
                    return;
                }

                const perm = await Pedometer.requestPermissionsAsync();
                
                if (perm.granted) {
                    setIsPedometerAvailable('available');
                } else {
                    setIsPedometerAvailable('permission_denied');
                }

            } catch (error) {
                console.log('Error checking pedometer:', error);
                setIsPedometerAvailable('error');
            }
        };

        checkSensor();
    }, []);

    
useEffect(() => {
    let subscription;
    let startSteps = null; 

    if (isTracking) {
        subscription = Pedometer.watchStepCount((result) => {
            if (startSteps === null) {
                startSteps = result.steps;
            }
            setSteps(result.steps - startSteps); 
        });
    }

    return () => {
        if (subscription) subscription.remove();
    };
}, [isTracking]);
    // 3. عداد الوقت
    useEffect(() => {
        let interVal;
        if (isTracking) {
            interVal = setInterval(() => {
                setSecond((prev) => prev + 1);
            }, 1000);
        } else {
            setSecond(0);
        }

        return () => {
            if (interVal) clearInterval(interVal);
        };
    }, [isTracking]);

    // تنسيق الوقت HH:MM:SS
    const formatTime = (timeInSecond) => {
        const hours = Math.floor(timeInSecond / 3600);
        const minutes = Math.floor((timeInSecond % 3600) / 60);
        const seconds = timeInSecond % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const renderStatusMessage = () => {
        switch (isPedometerAvailable) {
            case 'checking':
                return "In progress...";
            case 'permission_denied':
                return "Therefore, physical activity is not allowed!";
            case 'not_available':
                return "The phone does not support a step sensor.";
            case 'available':
                return "✅ The device is ready for tracking.";
            default:
                return "An error occurred during the scan!";
        }
    };

    return (
        <View style={styles.container}>
            {/* عنوان الشاشة */}
            <View style={styles.header}>
                <Text style={styles.title}>Follower of physical activity</Text>
                <Text style={styles.statusBadge}>{renderStatusMessage()}</Text>
            </View>

            {/* بطاقة الخطوات الرئيسية (Main Hero Card) */}
            <View style={styles.mainCard}>
                <Text style={styles.mainCardLabel}>الخطوات الحالية</Text>
                <Text style={styles.stepsCount}>{steps}</Text>
                <Text style={styles.stepsUnit}>خطوة</Text>
            </View>

            {/* شبكة الإحصائيات (Stats Grid) */}
            <View style={styles.gridContainer}>
                {/* بطاقة الوقت */}
                <View style={styles.statCard}>
                    <Text style={styles.cardIcon}>⏱️</Text>
                    <Text style={styles.cardValue}>{formatTime(second)}</Text>
                    <Text style={styles.cardLabel}>الوقت المستغرق</Text>
                </View>

                {/* بطاقة المسافة */}
                <View style={styles.statCard}>
                    <Text style={styles.cardIcon}>📍</Text>
                    <Text style={styles.cardValue}>{(steps * 0.000762).toFixed(2)}</Text>
                    <Text style={styles.cardLabel}>المسافة (كم)</Text>
                </View>

                {/* بطاقة السعرات */}
                <View style={styles.statCard}>
                    <Text style={styles.cardIcon}>🔥</Text>
                    <Text style={styles.cardValue}>{(steps * 0.04).toFixed(0)}</Text>
                    <Text style={styles.cardLabel}>السعرات (kcal)</Text>
                </View>
            </View>

            {/* زر التحكم الرئيسي */}
            <TouchableOpacity 
                activeOpacity={0.8}
                style={[
                    styles.actionButton, 
                    { backgroundColor: isTracking ? "#FF4B4B" : "#10B981" }
                ]}
                onPress={() => {
                    if (isPedometerAvailable !== 'available') {
                        Alert.alert("تنبيه", "الحساس غير متوفر أو الإذن غير مسموح");
                        return;
                    }
                    setIsTracking(!isTracking);
                }}
            >
                <Text style={styles.buttonText}>{isTracking ? "Stop tracking" : "Start tracking"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F8FAFC', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingVertical: 50,
        paddingHorizontal: 20
    },
    header: {
        alignItems: 'center',
        marginTop: 10
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#0F172A',
        marginBottom: 6 
    },
    statusBadge: { 
        fontSize: 13, 
        color: '#64748B', 
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden'
    },
    mainCard: {
        width: width * 0.85,
        height: width * 0.55,
        backgroundColor: '#6366F1',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    mainCardLabel: {
        color: '#E0E7FF',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8
    },
    stepsCount: {
        color: '#FFFFFF',
        fontSize: 54,
        fontWeight: '800'
    },
    stepsUnit: {
        color: '#C7D2FE',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    cardIcon: {
        fontSize: 22,
        marginBottom: 6
    },
    cardValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B'
    },
    cardLabel: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 2,
        fontWeight: '500'
    },
    actionButton: { 
        width: '100%', 
        paddingVertical: 18, 
        borderRadius: 16, 
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5
    },
    buttonText: { 
        color: '#FFFFFF', 
        fontWeight: 'bold', 
        fontSize: 18 
    }
});