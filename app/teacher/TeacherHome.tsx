import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig.js";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import styles from "./TeacherHomeScreen.styles.tsx"; // You can style similar to admin screen

const TeacherHomeScreen = () => {
  const [classesToday, setClassesToday] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState("");
  const router = useRouter();

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const usersSnap = await getDocs(
          query(collection(db, "users"), where("uid", "==", uid))
        );
        const teacherDoc = usersSnap.docs[0];
        setTeacherName(teacherDoc?.data().name || "");

        const q = query(
          collection(db, "timetable"),
          where("teacherId", "==", uid),
          where("day", "==", today)
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClassesToday(results);
      } catch (error) {
        console.error("Error fetching timetable:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleClassPress = (classItem: any) => {
    router.push({
      pathname: "/teacher/MarkAttendance",
      params: { classId: classItem.className },
    });
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/");
            } catch (error) {
              Alert.alert("Error", "Logout failed");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#007bff"
        style={{ marginTop: 50 }}
      />
    );
  }

  return (
    <LinearGradient colors={["#f1f9ff", "#ffffff"]} style={styles.container}>
      <View style={styles.profileSection}>
        <Text style={styles.heading}>Welcome, {teacherName}</Text>
        <Text style={styles.subheading}>Your classes for {today}</Text>
      </View>

      {classesToday.length === 0 ? (
        <Text style={styles.noClasses}>No classes scheduled today.</Text>
      ) : (
        <FlatList
          data={classesToday}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleClassPress(item)}
            >
              <Text style={styles.classText}>{item.className}</Text>
              <Text>{item.subject}</Text>
              <Text>
                {item.startTime} - {item.endTime}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}> Logout</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default TeacherHomeScreen;
