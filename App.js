import React, { useEffect, useState, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./components/LoginScreen";
import ChatroomScreen from "./components/ChatroomScreen";
import { StatusBar } from "expo-status-bar";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";

const Stack = createStackNavigator();

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState(null);

  //   import * as Notifications from 'expo-notifications';
  // import { useEffect } from 'react';

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    return token;
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    const registerForPushNotifications = async () => {
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          Alert.alert(
            "Error",
            "Failed to get push token for push notifications"
          );
          return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);
        console.log("Expo Push Token:", token);
      } catch (error) {
        console.error("Error getting push notification permissions:", error);
      }
    };

    registerForPushNotifications();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification Received:", notification);
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification Response:", response);
        // Ensure you're passing navigation correctly to the screens
        if (response.notification.request.content.data.screen === "Chatroom") {
          response.navigation.navigate("Chatroom");
        }
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const sendPushNotification = useCallback(async () => {
    if (!expoPushToken) return; // Only send when token is available

    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Your Notification Title", // Customize title
      body: "Notification body", // Customize body
      data: { screen: "Chatroom" },
    };

    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      console.log("Notification sent successfully:", result);
    } catch (error) {
      console.error("Error sending push notification:", error);
      
    }
  }, [expoPushToken]);

  useEffect(() => {
    if (expoPushToken) {
      sendPushNotification();
    }
  }); // Trigger notification only when expoPushToken is set

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chatroom"
          component={ChatroomScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
