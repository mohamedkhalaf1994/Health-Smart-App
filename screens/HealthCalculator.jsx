import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HealthCalculator() { 
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [result, setResult] = useState(null);

    const handleCalculate = () => {
        const w = parseFloat(weight);
        const h = parseFloat(height);
        const a = parseFloat(age);
        
        if (w > 0 && h > 0 && a > 0) {
            const heightInMeters = h / 100;
            const bmi = (w / (heightInMeters * heightInMeters)).toFixed(1);

            let category = "";
            let color = "";

            if (bmi < 18.5) {
                category = "Underweight";
                color = "#0288d1";
            } else if (bmi >= 18.5 && bmi <= 24.9) {
                category = 'Normal weight';
                color = '#2e7d32'; 
            } else if (bmi >= 25 && bmi <= 29.9) {
                category = 'Overweight';
                color = '#ed6c02'; 
            } else {
                category = 'Obesity';
                color = '#d32f2f'; 
            }

            const water = (w * 0.033).toFixed(1);

            let bmrValue = 0;
            if (gender === "male") {
                bmrValue = (10 * w) + (6.25 * h) - (5 * a) + 5;
            } else {
                bmrValue = (10 * w) + (6.25 * h) - (5 * a) - 161;
            }

            setResult({
                bmi: bmi,
                category: category,
                color: color,
                bmr: bmrValue.toFixed(0),
                water: water
            });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.headerTitle}>Health Calculator</Text>
                
                <View style={styles.card}>
                    {/* اختيار الجنس */}
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.genderRow}>
                        <TouchableOpacity 
                            style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]} 
                            onPress={() => setGender('male')}
                        >
                            <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>Male</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]} 
                            onPress={() => setGender('female')}
                        >
                            <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>Female</Text>
                        </TouchableOpacity>
                    </View>

                    {/* المدخلات */}
                    <Text style={styles.label}>Age (years)</Text>
                    <TextInput 
                        style={styles.input} 
                        keyboardType="numeric" 
                        value={age} 
                        onChangeText={setAge} 
                        placeholder="e.g. 25"
                    />

                    <Text style={styles.label}>Weight (kg)</Text>
                    <TextInput 
                        style={styles.input} 
                        keyboardType="numeric" 
                        value={weight} 
                        onChangeText={setWeight} 
                        placeholder="e.g. 70"
                    />

                    <Text style={styles.label}>Height (cm)</Text>
                    <TextInput 
                        style={styles.input} 
                        keyboardType="numeric" 
                        value={height} 
                        onChangeText={setHeight} 
                        placeholder="e.g. 175"
                    />

                    <TouchableOpacity style={styles.calcButton} onPress={handleCalculate}>
                        <Text style={styles.calcButtonText}>Calculate</Text>
                    </TouchableOpacity>
                </View>

                {/* عرض النتائج */}
                {result && (
                    <View style={styles.resultCard}>
                        <Text style={styles.resultTitle}>Your Results</Text>
                        
                        <View style={styles.resRow}>
                            <Text style={styles.resLabel}>BMI Index:</Text>
                            <Text style={[styles.resValue, { color: result.color }]}>{result.bmi} ({result.category})</Text>
                        </View>

                        <View style={styles.resRow}>
                            <Text style={styles.resLabel}>Daily BMR (Calories):</Text>
                            <Text style={styles.resValue}>{result.bmr} kcal</Text>
                        </View>

                        <View style={styles.resRow}>
                            <Text style={styles.resLabel}>Water Intake:</Text>
                            <Text style={styles.resValue}>{result.water} Liters/day</Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
    container: { padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#0F172A', marginBottom: 20, textAlign: 'center' },
    card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, elevation: 3 },
    label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 6, marginTop: 10 },
    input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 12, fontSize: 16, backgroundColor: '#F8FAFC' },
    genderRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    genderButton: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, alignItems: 'center' },
    genderButtonActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
    genderText: { color: '#475569', fontWeight: '600' },
    genderTextActive: { color: '#FFFFFF' },
    calcButton: { backgroundColor: '#6366F1', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    calcButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    resultCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginTop: 20, elevation: 3 },
    resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#0F172A' },
    resRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    resLabel: { fontSize: 14, color: '#64748B' },
    resValue: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' }
});