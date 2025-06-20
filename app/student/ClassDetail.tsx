import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { auth, db } from "../../firebaseConfig.js";
import { collection, query, where, getDocs } from "firebase/firestore";

const ClassDetail = () => {
  const { classId, subject } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchAttendanceDetails = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid || !classId || !subject) return;

        const attendanceQuery = query(
          collection(db, "attendance"),
          where("classId", "==", (classId as string).toLowerCase()),
          where("subject", "==", subject)
        );

        const snapshot = await getDocs(attendanceQuery);

        let present = 0;
        let absent = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          const status = data.attendance?.[uid];

          if (status === "Present") present++;
          else if (status === "Absent") absent++;
        });

        setPresentCount(present);
        setAbsentCount(absent);
        setTotalCount(present + absent);
      } catch (err) {
        console.error("Failed to fetch class details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceDetails();
  }, [classId, subject]);

  if (loading) {
    return (
      <ActivityIndicator
        style={{ marginTop: 40 }}
        size="large"
        color="#007bff"
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {(subject as string).toUpperCase()} - Attendance Summary
      </Text>
      <Text style={styles.info}>Total Classes: {totalCount}</Text>
      <Text style={styles.info}>Present: {presentCount}</Text>
      <Text style={styles.info}>Absent: {absentCount}</Text>
    </ScrollView>
  );
};

export default ClassDetail;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  info: {
    fontSize: 18,
    marginVertical: 8,
    color: "#333",
  },
});
