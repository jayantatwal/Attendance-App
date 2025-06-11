import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig.js";

const EditTimetableScreen = () => {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);

  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    fetchTimetable();
    fetchTeachers();
  }, [selectedDay]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "timetable"),
        where("day", "==", selectedDay)
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClasses(results);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch timetable.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const teacherDocs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user: any) => user.role === "teacher");
      setTeachers(teacherDocs);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const openEditModal = (classItem: any) => {
    setEditingClass(classItem);
    setSubject(classItem.subject);
    setStartTime(classItem.startTime);
    setEndTime(classItem.endTime);
    setSelectedTeacherId(classItem.teacherId || "");
    const teacher = teachers.find((t) => t.id === classItem.teacherId);
    setAvailableSubjects(teacher?.subjects || []);
    setEditModalVisible(true);
  };

  const handleTeacherChange = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    const selected = teachers.find((t) => t.id === teacherId);
    setAvailableSubjects(selected?.subjects || []);
    setSubject(""); // Reset subject if teacher changes
  };

  const saveChanges = async () => {
    if (!editingClass) return;
    if (!selectedTeacherId || !subject || !startTime || !endTime) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const ref = doc(db, "timetable", editingClass.id);
      await updateDoc(ref, {
        subject,
        startTime,
        endTime,
        teacherId: selectedTeacherId,
      });
      Alert.alert("Success", "Class updated.");
      setEditModalVisible(false);
      fetchTimetable();
    } catch (err) {
      Alert.alert("Error", "Failed to update class.");
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Timetable</Text>

      <Picker
        selectedValue={selectedDay}
        onValueChange={(value) => setSelectedDay(value)}
        style={styles.pickerInput}
      >
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (
          <Picker.Item key={day} label={day} value={day} />
        ))}
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : classes.length === 0 ? (
        <Text style={styles.noData}>No classes for {selectedDay}.</Text>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => openEditModal(item)}
            >
              <Text style={styles.cardText}>
                {item.className.toUpperCase()}
              </Text>
              <Text>{item.subject}</Text>
              <Text>
                {item.startTime} - {item.endTime}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Class</Text>

            <Text style={styles.label}>Teacher</Text>
            <Picker
              selectedValue={selectedTeacherId}
              onValueChange={handleTeacherChange}
              style={styles.pickerInput}
            >
              <Picker.Item label="Select Teacher" value="" />
              {teachers.map((teacher) => (
                <Picker.Item
                  key={teacher.id}
                  label={teacher.name}
                  value={teacher.id}
                />
              ))}
            </Picker>

            <Text style={styles.label}>Subject</Text>
            <Picker
              selectedValue={subject}
              onValueChange={setSubject}
              style={styles.pickerInput}
            >
              <Picker.Item label="Select Subject" value="" />
              {availableSubjects.map((subj, index) => (
                <Picker.Item key={index} label={subj} value={subj} />
              ))}
            </Picker>

            <TextInput
              value={startTime}
              onChangeText={setStartTime}
              placeholder="Start Time (e.g., 10:00)"
              style={styles.input}
            />
            <TextInput
              value={endTime}
              onChangeText={setEndTime}
              placeholder="End Time (e.g., 11:00)"
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditTimetableScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  pickerInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    height: 50,
    justifyContent: "center",
  },
  card: {
    padding: 12,
    backgroundColor: "#e9f0ff",
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: { fontSize: 18, fontWeight: "bold" },
  noData: { textAlign: "center", marginTop: 30 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  label: { fontWeight: "bold", marginBottom: 4 },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  saveBtn: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold" },
  cancelBtn: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  cancelBtnText: { fontWeight: "bold" },
});
