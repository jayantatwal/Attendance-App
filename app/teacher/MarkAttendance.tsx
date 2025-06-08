import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../../firebaseConfig.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

type Student = {
  id: string;
  name: string;
  class: string;
};

type AttendanceStatus = "Present" | "Absent" | "Not marked";

const MarkAttendance = () => {
  const { classId, subject, startTime, endTime } = useLocalSearchParams();
  const router = useRouter();

  // Basic validation of params
  if (
    !classId ||
    typeof classId !== "string" ||
    !subject ||
    typeof subject !== "string" ||
    !startTime ||
    typeof startTime !== "string" ||
    !endTime ||
    typeof endTime !== "string"
  ) {
    Alert.alert(
      "Missing parameters",
      "Class, subject, start time or end time not provided. Please go back and try again."
    );
    return null;
  }

  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadedSubject, setLoadedSubject] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  useEffect(() => {
    const fetchStudentsAndAttendance = async () => {
      setLoading(true);
      try {
        const normalizedClassId = classId.toLowerCase();

        // Query students in class
        const q = query(
          collection(db, "users"),
          where("class", "==", normalizedClassId)
        );
        const snapshot = await getDocs(q);

        const fetchedStudents = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          class: doc.data().class,
        }));

        setStudents(fetchedStudents);

        // Normalize subject and time slot for doc id
        const normalizedSubject = subject.toLowerCase().replace(/\s+/g, "_");
        const normalizedTimeSlot = `${startTime}-${endTime}`.replace(/:/g, "-");

        // Attendance doc id now includes subject and time slot
        const attendanceDocRef = doc(
          db,
          "attendance",
          `${normalizedClassId}_${todayStr}_${normalizedSubject}_${normalizedTimeSlot}`
        );

        const attendanceDocSnap = await getDoc(attendanceDocRef);

        let initialAttendance: Record<string, AttendanceStatus> = {};
        let savedSubject: string | null = null;

        if (attendanceDocSnap.exists()) {
          const data = attendanceDocSnap.data();
          initialAttendance = data.attendance || {};
          savedSubject = data.subject || null;
        } else {
          fetchedStudents.forEach((s) => {
            initialAttendance[s.id] = "Not marked";
          });
          savedSubject = subject; // Use passed subject param
        }

        setAttendance(initialAttendance);
        setLoadedSubject(savedSubject);
      } catch (err) {
        console.error("Error fetching data:", err);
        Alert.alert("Error", "Failed to load students or attendance.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndAttendance();
  }, [classId, subject, startTime, endTime, todayStr]);

  const setStudentAttendance = (
    studentId: string,
    status: AttendanceStatus
  ) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = () => {
    const notMarkedStudents = students.filter(
      (s) => attendance[s.id] === "Not marked"
    );
    if (notMarkedStudents.length > 0) {
      Alert.alert("Incomplete", "Please mark attendance for all students.");
      return;
    }

    if (!loadedSubject) {
      Alert.alert("Missing Subject", "Please provide a subject before saving.");
      return;
    }

    Alert.alert("Confirm Save", "Save attendance?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Save",
        onPress: async () => {
          setSaving(true);
          try {
            const normalizedClassId = classId.toLowerCase();
            const normalizedSubject = subject
              .toLowerCase()
              .replace(/\s+/g, "_");
            const normalizedTimeSlot = `${startTime}-${endTime}`.replace(
              /:/g,
              "-"
            );

            const attendanceDocRef = doc(
              db,
              "attendance",
              `${normalizedClassId}_${todayStr}_${normalizedSubject}_${normalizedTimeSlot}`
            );

            await setDoc(attendanceDocRef, {
              classId: normalizedClassId,
              date: todayStr,
              attendance,
              subject: loadedSubject,
              startTime,
              endTime,
            });
            Alert.alert("Success", "Attendance saved.");
            router.back();
          } catch (error) {
            console.error("Save error:", error);
            Alert.alert("Error", "Failed to save attendance.");
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  if (loading)
    return (
      <ActivityIndicator
        style={{ marginTop: 50 }}
        size="large"
        color="#007bff"
      />
    );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Mark Attendance for{" "}
        {typeof classId === "string" ? classId.toUpperCase() : ""}
        {" - "}
        {typeof loadedSubject === "string" ? loadedSubject.toUpperCase() : ""}
        {" on "}
        {todayStr} ({startTime ?? ""} - {endTime ?? ""})
      </Text>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentRow}>
            <Text style={styles.studentName}>{item.name}</Text>
            <View style={styles.buttonsRow}>
              {(["Present", "Absent", "Not marked"] as AttendanceStatus[]).map(
                (status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      attendance[item.id] === status && styles.selectedButton,
                      status === "Present" && styles.presentButton,
                      status === "Absent" && styles.absentButton,
                      status === "Not marked" && styles.notMarkedButton,
                    ]}
                    onPress={() => setStudentAttendance(item.id, status)}
                  >
                    <Text style={styles.statusButtonText}>{status[0]}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.saveButton, saving && { opacity: 0.7 }]}
        onPress={saveAttendance}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? "Saving..." : "Save Attendance"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MarkAttendance;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  studentName: { fontSize: 18, flex: 1 },
  buttonsRow: { flexDirection: "row", gap: 8 },

  statusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  selectedButton: { borderWidth: 2, borderColor: "#007bff" },
  presentButton: { backgroundColor: "#d4edda" },
  absentButton: { backgroundColor: "#f8d7da" },
  notMarkedButton: { backgroundColor: "#fff3cd" },
  statusButtonText: {
    fontWeight: "bold",
    color: "#000",
  },

  saveButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
