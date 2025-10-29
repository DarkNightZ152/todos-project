import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import TrpcProvider from '@repo/trpc/TrpcProvider';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native';
import { AuthProvider, useAuth } from './auth/AuthContext';

function AppContent() {
  const colorScheme = useColorScheme();
  const { token, isLoading } = useAuth();
  const trpcUrl = process.env.EXPO_PUBLIC_TRPC_URL || 'http://localhost:3001/trpc';

  if (isLoading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TrpcProvider url={trpcUrl} token={token}>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signin" options={{ title: 'Sign In' }} />
            <Stack.Screen name="auth/signup" options={{ title: 'Sign Up' }} />
            <Stack.Screen name="index" options={{ title: 'Todos' }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SafeAreaView>
      </TrpcProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
