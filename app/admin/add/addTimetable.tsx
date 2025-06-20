import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig.js";

const classesList = ["MCA Morning", "MCA Evening", "MSc Computer Science"];
const daysList = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AddTimetable = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      const q = query(collection(db, "users"), where("role", "==", "teacher"));
      const snapshot = await getDocs(q);
      const fetchedTeachers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeachers(fetchedTeachers);
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    setSelectedSubject("");
  }, [selectedTeacher]);

  const handleSubmit = async () => {
    if (
      !selectedTeacher ||
      !selectedDay ||
      !selectedClass ||
      !selectedSubject ||
      !startTime ||
      !endTime
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "timetable"), {
        teacherId: selectedTeacher.id,
        teacherName: selectedTeacher.name,
        day: selectedDay,
        className: selectedClass.toLowerCase(), // ✅ Convert class name to lowercase
        subject: selectedSubject.toLowerCase(), // ✅ Convert subject to lowercase for consistency
        startTime,
        endTime,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Timetable entry added successfully");
      setSelectedTeacher(null);
      setSelectedDay("");
      setSelectedClass("");
      setSelectedSubject("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      Alert.alert("Error", "Failed to add timetable");
      console.error(error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Add Timetable</Text>

      <Text style={styles.label}>Select Teacher</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          style={styles.picker}
          selectedValue={selectedTeacher?.id || ""}
          onValueChange={(itemValue) => {
            const teacher = teachers.find((t) => t.id === itemValue);
            setSelectedTeacher(teacher || null);
          }}
          dropdownIconColor="#007bff"
        >
          <Picker.Item label="-- Select Teacher --" value="" />
          {teachers.map((teacher) => (
            <Picker.Item
              key={teacher.id}
              label={teacher.name}
              value={teacher.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Select Day</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          style={styles.picker}
          selectedValue={selectedDay}
          onValueChange={setSelectedDay}
          dropdownIconColor="#007bff"
        >
          <Picker.Item label="-- Select Day --" value="" />
          {daysList.map((day) => (
            <Picker.Item key={day} label={day} value={day} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Select Class</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          style={styles.picker}
          selectedValue={selectedClass}
          onValueChange={setSelectedClass}
          dropdownIconColor="#007bff"
        >
          <Picker.Item label="-- Select Class --" value="" />
          {classesList.map((cls) => (
            <Picker.Item key={cls} label={cls} value={cls} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Select Subject</Text>
      <View
        style={[
          styles.pickerWrapper,
          !selectedTeacher && styles.disabledPicker,
        ]}
      >
        <Picker
          style={styles.picker}
          selectedValue={selectedSubject}
          enabled={!!selectedTeacher}
          onValueChange={setSelectedSubject}
          dropdownIconColor={selectedTeacher ? "#007bff" : "#aaa"}
        >
          <Picker.Item
            label={
              selectedTeacher
                ? "-- Select Subject --"
                : "Select a teacher first"
            }
            value=""
          />
          {selectedTeacher?.subjects?.map((sub: string, index: number) => (
            <Picker.Item key={index} label={sub} value={sub} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Start Time</Text>
      <TextInput
        value={startTime}
        onChangeText={setStartTime}
        placeholder="e.g. 09:00 AM"
        style={styles.input}
        keyboardType="default"
      />

      <Text style={styles.label}>End Time</Text>
      <TextInput
        value={endTime}
        onChangeText={setEndTime}
        placeholder="e.g. 10:00 AM"
        style={styles.input}
        keyboardType="default"
      />

      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.button}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Add Timetable</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddTimetable;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "500",
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    color: "#000",
  },
  disabledPicker: {
    backgroundColor: "#f0f0f0",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
