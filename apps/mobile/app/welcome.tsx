import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from './auth/AuthContext';

export default function Welcome() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/' as any);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9fafb',
      }}
    >
      <Text
        style={{
          fontSize: 36,
          fontWeight: 'bold',
          marginBottom: 12,
          color: '#1f2937',
        }}
      >
        Welcome to Todos
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: '#6b7280',
          marginBottom: 48,
          textAlign: 'center',
        }}
      >
        Manage your tasks efficiently
      </Text>

      <TouchableOpacity
        onPress={() => router.push('/auth/signin' as any)}
        style={{
          backgroundColor: '#2563eb',
          paddingVertical: 16,
          paddingHorizontal: 48,
          borderRadius: 8,
          marginBottom: 16,
          width: '80%',
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          Sign In
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/auth/signup' as any)}
        style={{
          backgroundColor: '#fff',
          paddingVertical: 16,
          paddingHorizontal: 48,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#2563eb',
          width: '80%',
        }}
      >
        <Text
          style={{
            color: '#2563eb',
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}
