import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { UserProvider } from "../context/UserContext";

export default function RootLayout() {
  return (
      <UserProvider>
    <AuthProvider>
        <Stack>
          <Stack.Screen name="(login)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
    </AuthProvider>
      </UserProvider>
  );
}