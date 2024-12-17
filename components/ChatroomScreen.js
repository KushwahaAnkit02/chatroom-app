import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { db } from "../firebaseConfig";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatroomScreen({ route }) {
  const { username } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      addDoc(collection(db, "messages"), {
        username,
        message,
        timestamp: serverTimestamp(),
      });
      setMessage("");
    }
  };

  const isSender = (msgUsername) => msgUsername === username;

  const renderMessageItem = ({ item, index }) => {
    const showDateHeader =
      index === 0 ||
      moment(item.timestamp).format("LL") !==
        moment(messages[index - 1]?.timestamp).format("LL");

    return (
      <>
        {showDateHeader && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>
              {moment(item.timestamp).format("LL")}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isSender(item.username)
              ? styles.senderBubble
              : styles.receiverBubble,
            isSender(item.username) ? styles.alignRight : styles.alignLeft,
          ]}
        >
          {!isSender(item.username) && (
            <Text style={styles.username}>{item.username}</Text>
          )}
          <View style={styles.messageContent}>
            <Text style={styles.message} numberOfLines={0}>
              {item.message}
            </Text>
            <Text style={styles.time}>
              {item.timestamp ? moment(item.timestamp).format("h:mm A") : ""}
            </Text>
          </View>
        </View>
      </>
    );
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("username");
      navigation.navigate("Login");
    } catch (error) {
      console.log("Error clearing username:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerStyle}>
        <Text style={styles.headerTitleStyle}>Chatroom</Text>
        <Pressable onPress={() => handleLogout()}>
          <MaterialIcons name="logout" size={wp("6%")} color="black" />
        </Pressable>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="gray"
          value={message}
          onChangeText={setMessage}
        />
        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <Feather name="send" size={wp("5%")} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  headerStyle: {
    backgroundColor: "#a8c5e6",
    height: hp("12%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("3%"),
    paddingTop: wp("10%"),
  },
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: wp("6%"),
  },
  messageList: { paddingVertical: hp("1%"), paddingHorizontal: wp("3%") },
  dateHeader: {
    alignSelf: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.5%"),
    marginVertical: hp("1%"),
  },
  dateText: { color: "#555", fontSize: wp("3%") },
  messageBubble: {
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    borderRadius: 15,
    marginVertical: hp("0.5%"),
    maxWidth: "80%",
  },
  senderBubble: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  receiverBubble: {
    backgroundColor: "#FFF",
    alignSelf: "flex-start",
  },
  alignRight: { alignSelf: "flex-end" },
  alignLeft: { alignSelf: "flex-start" },
  username: {
    fontSize: wp("3.5%"),
    color: "#075E54",
    marginBottom: hp("0.5%"),
  },
  message: { fontSize: wp("4%"), color: "#000" },
  time: {
    fontSize: wp("3%"),
    color: "#555",
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("3%"),
    borderTopWidth: 1,
    borderColor: "#DDD",
  },
  input: {
    flex: 1,
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("4%"),
    backgroundColor: "#F2F2F2",
    borderRadius: 25,
    fontSize: wp("4%"),
    marginRight: wp("2%"),
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    padding: wp("3%"),
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
});
