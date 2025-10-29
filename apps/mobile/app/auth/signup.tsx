import { trpc } from '@repo/trpc/client';
import { useRouter } from 'expo-router';
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

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useAuth();
  const router = useRouter();

  const signUpMutation = trpc.auth.signUp.useMutation({
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      router.replace('/');
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    signUpMutation.mutate({ name, email, password });
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
            Sign Up
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            autoCapitalize="words"
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
            placeholder="Password (min 6 characters)"
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
            disabled={signUpMutation.isPending}
            style={{
              backgroundColor: signUpMutation.isPending ? '#9ca3af' : '#2563eb',
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
              {signUpMutation.isPending ? 'Signing up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ textAlign: 'center', color: '#6b7280' }}>
              Already have an account?{' '}
              <Text style={{ color: '#2563eb', fontWeight: '600' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
