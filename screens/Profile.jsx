import React, { useState , useEffect } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() { 

    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [isEditing, setIsEditing] = useState(true);
    const saveProfile = async () => {
        try {
            const userProfile = {height, age, gender, weight};
            await AsyncStorage.setItem("user_profile", JSON.stringify(userProfile));
            setIsEditing(false);

        } catch (error) {
            console.log("Error saving data", error)
        }
    }

    const loadProfile = async () => {
        try {
            const savedData = await AsyncStorage.getItem("user_profile");
            if (savedData !== null) {
                const parsedData = JSON.parse(savedData);
                setHeight(parsedData.height);
                setWeight(parsedData.weight);
                setAge(parsedData.age);
                setGender(parsedData.gender);
                setIsEditing(false);
            }
        } catch (error) {
            console.log("Error loading data", error);
        }
    };
    useEffect(() => {
        loadProfile();
    }, []);






    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Personal data</Text>
                {isEditing ? (
        <View style={styles.form}>
        <Text style={styles.label}>الطول (سم):</Text>
        <TextInput
            style={styles.input}
            placeholder="أدخل طولك"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
        />
        <Text style={styles.label}>الوزن (كجم):</Text>
        <TextInput
            style={styles.input}
            placeholder="أدخل وزنك"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
        />

        <Text style={styles.label}>العمر:</Text>
        <TextInput
            style={styles.input}
            placeholder="أدخل عمرك"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
        />
        <Text style={styles.label}>الجنس:</Text>
        <View style={styles.genderContainer}>
            <TouchableOpacity 
                style={[styles.genderButton, gender === 'Male' && styles.genderSelected]}
                onPress={() => setGender('Male')}
            >
                <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.genderButton, gender === 'Female' && styles.genderSelected]}
                onPress={() => setGender('Female')}
            >
                <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>

    </View>
) : (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>بياناتك المحفوظة</Text>
        <Text style={styles.cardText}>الطول: {height} سم</Text>
        <Text style={styles.cardText}>الوزن: {weight} كجم</Text>
        <Text style={styles.cardText}>العمر: {age} سنة</Text>
        <Text style={styles.cardText}>الجنس: {gender}</Text>

        <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => setIsEditing(true)}
        >
            <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
    </View>
)}       
                

            </ScrollView>
        </KeyboardAvoidingView>
    );

 }

 const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    form: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        marginTop: 10,
        color: '#444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 20,
    },
    genderButton: {
        flex: 0.48,
        padding: 12,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 8,
        alignItems: 'center',
    },
    genderSelected: {
        backgroundColor: '#007AFF',
    },
    genderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#007AFF',
    },
    cardText: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
    editButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        marginTop: 15,
        width: '100%',
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});