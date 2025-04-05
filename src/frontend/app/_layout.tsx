import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { UserProvider } from "../context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false}}>
          <Stack.Screen name="(login)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </UserProvider>
  );
}