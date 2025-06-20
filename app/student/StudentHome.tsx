import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import ScreenWrapper from "../common/ScreenWrapper.tsx";

type TimetableItem = {
  id: string;
  className: string;
  subject: string;
  teacherId: string;
  startTime: string;
  endTime: string;
};

type UserInfo = {
  name: string;
  class: string;
  rollNumber: string;
};

const StudentHomeScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [timetable, setTimetable] = useState<TimetableItem[]>([]);
  const [attendedCount, setAttendedCount] = useState<number>(0);
  const [todayClassesCount, setTodayClassesCount] = useState<number>(0);
  const [attendanceStatusMap, setAttendanceStatusMap] = useState<
    Record<string, "Present" | "Absent" | "N">
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) {
          console.error("No user logged in");
          return;
        }

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.log("Student not found.");
          return;
        }

        const user = userSnap.data() as UserInfo;
        setUserInfo(user);

        const studentClass = (user.class || "").toLowerCase();

        const today = new Date().toLocaleDateString("en-US", {
          weekday: "long",
        });

        // Get timetable
        const ttSnap = await getDocs(
          query(
            collection(db, "timetable"),
            where("className", "==", studentClass),
            where("day", "==", today)
          )
        );

        const classes: TimetableItem[] = ttSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setTimetable(classes);

        // Total attendance
        const totalAttSnap = await getDocs(
          query(collection(db, "totalAttendance"), where("uid", "==", uid))
        );

        if (!totalAttSnap.empty) {
          const att = totalAttSnap.docs[0].data();
          setAttendedCount(att.present || 0);
          setTodayClassesCount(att.total || 0);
        }

        // Class-wise status
        const statusMap: Record<string, "Present" | "Absent" | "N"> = {};

        for (const cls of classes) {
          const dateStr = new Date().toISOString().split("T")[0];

          const attSnap = await getDocs(
            query(
              collection(db, "attendance"),
              where("classId", "==", studentClass),
              where("date", "==", dateStr)
            )
          );

          const doc = attSnap.docs[0];
          const attendance = doc?.data()?.attendance || {};
          statusMap[cls.id] = attendance[uid] || "N";
        }

        setAttendanceStatusMap(statusMap);
      } catch (err) {
        console.error("Failed to fetch student data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const attendancePercent = todayClassesCount
    ? Math.round((attendedCount / todayClassesCount) * 100)
    : 0;

  if (loading) {
    return (
      <ActivityIndicator
        style={{ marginTop: 50 }}
        size="large"
        color="#007bff"
      />
    );
  }

  return (
    <ScreenWrapper gradientColors={["#f0f4f7", "#fff"]}>
      {userInfo && (
        <View style={styles.studentInfo}>
          <Text style={styles.studentInfoText}>
            Name: {userInfo.name.toUpperCase()}
          </Text>
          <Text style={styles.studentInfoText}>
            Class: {userInfo.class.toUpperCase()}
          </Text>
          <Text style={styles.studentInfoText}>
            Roll Number: {userInfo.rollNumber}
          </Text>
        </View>
      )}

      {/* Attendance Overview */}
      <View style={styles.overview}>
        <Text style={styles.overviewText}>Attended: {attendedCount}</Text>
        <Text style={styles.overviewText}>Total: {todayClassesCount}</Text>
        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBarFill, { width: `${attendancePercent}%` }]}
          />
        </View>
        <Text style={styles.overviewText}>{attendancePercent}%</Text>
      </View>

      {/* Today's Classes */}
      <FlatList
        data={timetable}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const status = attendanceStatusMap[item.id] || "N";
          let statusSymbol = "N";
          let statusColor = "#888";

          if (status === "Present") {
            statusSymbol = "✔️";
            statusColor = "#28a745";
          } else if (status === "Absent") {
            statusSymbol = "❌";
            statusColor = "#dc3545";
          }

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/student/ClassDetail",
                  params: { classId: item.className, subject: item.subject },
                })
              }
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardSubject}>{item.subject}</Text>
                <Text style={{ color: statusColor }}>{statusSymbol}</Text>
              </View>
              <Text style={styles.cardText}>
                {item.startTime} - {item.endTime}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default StudentHomeScreen;

const styles = StyleSheet.create({
  studentInfo: {
    padding: 12,
    backgroundColor: "#ddeeff",
    borderRadius: 10,
    marginBottom: 10,
  },
  studentInfoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginVertical: 2,
  },
  overview: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#eef3f8",
    borderRadius: 10,
  },
  overviewText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 4,
  },
  progressBarBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#ddd",
    borderRadius: 6,
    marginVertical: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#28a745",
    borderRadius: 6,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardSubject: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    color: "#555",
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 30,
    padding: 12,
    backgroundColor: "#dc3545",
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
