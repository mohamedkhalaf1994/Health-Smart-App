import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
export default function FoodAnalyzer() {
    const [image, setImage] = useState(null);
    const [load, setLoad] = useState(false);
    const [result, setResult] = useState(null);

    
    const pickImage = async () => {
        let res = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            base64: true,
            quality: 0.5
        });

        if (!res.canceled) {
            setImage(res.assets[0]);
            setResult(null); // clear the old result when a new photo is taken
        }
    };

    const anlayzFood = async () => {
        if (!image) {
            Alert.alert("تنبيه", "الرجاء التقاط صورة أولاً");
            return;
        }

        setLoad(true);
        setResult(null);

        try {
            const url = `https://api.groq.com/openai/v1/chat/completions`;
            const promptText = "حلل هذه الصورة وأرجع لي الناتج بتنسيق JSON فقط يحتوي على الأسماء التالية بالتحديد: mealName, calories, protein, carbs, fats. لا تكتب أي كلام آخر خارج الـ JSON.";

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "qwen/qwen3.6-27b",
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: promptText },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: `data:image/jpeg;base64,${image.base64}`
                                    }
                                }
                            ]
                        }
                    ]
                })
            });

            const data = await response.json();
            console.log("Full server response:", JSON.stringify(data, null, 2));

            if (data.error) {
                Alert.alert("خطأ من السيرفر", data.error.message);
                return;
            }

            if (data.choices && data.choices[0]?.message?.content) {
                const rawText = data.choices[0].message.content;
                const cleanJson = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
                const parsedData = JSON.parse(cleanJson);

                setResult(parsedData);
            }

        } catch (error) {
            console.error("Analysis error:", error);
            Alert.alert("خطأ", "فشل تحليل الصورة، تأكد من الاتصال بالإنترنت.");
        } finally {
            setLoad(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.eyebrow}>FOOD ANALYZER</Text>
                <Text style={styles.title}>What's on your plate?</Text>
            </View>

            {image ? (
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
            ) : (
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>No picture has been taken yet.</Text>
                </View>
            )}

            <TouchableOpacity style={styles.primaryButton} onPress={pickImage} activeOpacity={0.85}>
                <Text style={styles.primaryButtonText}>
                    {image ? "التقط صورة" : "التقط صورة للوجبة"}
                </Text>
            </TouchableOpacity>

            {image && (
                <TouchableOpacity
                    style={[styles.analyzeButton, load && styles.analyzeButtonDisabled]}
                    onPress={anlayzFood}
                    activeOpacity={0.85}
                    disabled={load}
                >
                    <Text style={styles.analyzeButtonText}>
                        {load ? "بيتحلل..." : "حلّل الوجبة"}
                    </Text>
                </TouchableOpacity>
            )}

            {load && (
                <ActivityIndicator size="large" color="#2F5233" style={{ marginTop: 24 }} />
            )}

            {result && (
                <View style={styles.factsCard}>
                    <Text style={styles.factsHeader}>NUTRITION FACTS</Text>
                    <View style={styles.thickRule} />

                    <Text style={styles.mealName}>{result.mealName}</Text>
                    <View style={styles.thinRule} />

                    <View style={styles.caloriesRow}>
                        <Text style={styles.caloriesLabel}>السعرات</Text>
                        <Text style={styles.caloriesValue}>{result.calories}</Text>
                    </View>
                    <View style={styles.thickRule} />

                    <FactRow label="بروتين" value={result.protein} unit="g" />
                    <FactRow label="كاربوهيدرات" value={result.carbs} unit="g" />
                    <FactRow label="دهون" value={result.fats} unit="g" />
                </View>
            )}
        </ScrollView>
    );
}

// small helper component so each macro row shares the same layout
function FactRow({ label, value, unit }) {
    return (
        <View style={styles.factRow}>
            <Text style={styles.factLabel}>{label}</Text>
            <Text style={styles.factValue}>{value}{unit}</Text>
        </View>
    );
}

const INK = "#1C1C1C";
const PAPER = "#F5F7F0";
const FOREST = "#2F5233";
const TOMATO = "#C1440E";
const GOLD = "#E8A33D";

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: PAPER,
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 48,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    eyebrow: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 3,
        color: FOREST,
        marginBottom: 6,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: INK,
    },
    placeholder: {
        width: 240,
        height: 240,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#D8DACF',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    placeholderText: {
        color: '#9A9C8E',
        fontSize: 14,
    },
    previewImage: {
        width: 240,
        height: 240,
        borderRadius: 16,
        marginBottom: 20,
    },
    primaryButton: {
        backgroundColor: INK,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    analyzeButton: {
        backgroundColor: TOMATO,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginTop: 12,
    },
    analyzeButtonDisabled: {
        opacity: 0.6,
    },
    analyzeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    factsCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: INK,
        borderRadius: 4,
        padding: 16,
        marginTop: 28,
    },
    factsHeader: {
        fontSize: 22,
        fontWeight: '900',
        color: INK,
        letterSpacing: 0.5,
    },
    thickRule: {
        height: 6,
        backgroundColor: INK,
        marginVertical: 8,
    },
    thinRule: {
        height: 1,
        backgroundColor: '#C9CBBE',
        marginVertical: 8,
    },
    mealName: {
        fontSize: 16,
        fontWeight: '700',
        color: INK,
    },
    caloriesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingVertical: 4,
    },
    caloriesLabel: {
        fontSize: 20,
        fontWeight: '800',
        color: INK,
    },
    caloriesValue: {
        fontSize: 28,
        fontWeight: '900',
        color: GOLD,
    },
    factRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E6DA',
    },
    factLabel: {
        fontSize: 15,
        color: INK,
    },
    factValue: {
        fontSize: 15,
        fontWeight: '700',
        color: INK,
    },
});
