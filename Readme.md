# Chatroom App

This is a React Native application that allows users to join a chatroom and send real-time messages. The app uses Firebase Firestore for real-time data and AsyncStorage for local storage of user credentials.

## Features

- **User Login**: Users can enter a username to join the chatroom.
- **Real-time Messaging**: Messages are sent and received in real-time using Firebase Firestore.
- **Persistent Login**: The app remembers the last logged-in user using AsyncStorage.
- **Modern UI**: Clean and intuitive interface with dynamic styling for sender and receiver messages.

## Installation

### Prerequisites

1. Ensure you have the following installed:
   - Node.js
   - npm or yarn
   - Expo CLI (`npm install -g expo-cli`)
2. Create a Firebase project and enable Firestore.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/KushwahaAnkit02/chatroom-app.git
   cd chatroom-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the app:
   ```bash
   expo start
   ```

## Usage

1. On the login screen, enter your username and press "Join Chatroom."
2. The app navigates to the chatroom screen where you can send and receive messages.
3. Your username is saved locally, and you will be logged in automatically next time.

## File Structure

```
chatroom-app/
├── App.js               # Entry point of the app
├── screens/
│   ├── LoginScreen.js   # User login screen
│   └── ChatroomScreen.js# Real-time chatroom screen
├── firebaseConfig.js    # Firebase configuration (to be created by the user)
├── assets/              # App assets (e.g., images, icons)
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

## Technologies Used

- **React Native**: Frontend framework for building mobile apps.
- **Firebase Firestore**: Backend for real-time messaging.
- **AsyncStorage**: Local storage for saving user data.
- **Expo**: Framework for developing React Native apps.
