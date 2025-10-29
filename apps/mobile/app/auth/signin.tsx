import { trpc } from '@repo/trpc/client';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from './AuthContext';
import { useRouter } from 'expo-router';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useAuth();
  const router = useRouter();

  const signInMutation = trpc.auth.signIn.useMutation({
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      router.replace('/');
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    signInMutation.mutate({ email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          padding: 20,
          backgroundColor: '#f9fafb',
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            padding: 24,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 24,
              color: '#1f2937',
            }}
          >
            Sign In
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 16,
            }}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 8,
              marginBottom: 20,
              fontSize: 16,
            }}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={signInMutation.isPending}
            style={{
              backgroundColor: signInMutation.isPending ? '#9ca3af' : '#2563eb',
              paddingVertical: 14,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              {signInMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/auth/signup' as any)}>
            <Text style={{ textAlign: 'center', color: '#6b7280' }}>
              Don&apos;t have an account?{' '}
              <Text style={{ color: '#2563eb', fontWeight: '600' }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
