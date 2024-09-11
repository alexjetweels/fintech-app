import { defaultStyles } from '@/constants/Styles';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export default function VerifyPhone() {
  const { phone, signin } = useLocalSearchParams<{
    phone: string;
    signin?: string;
  }>();

  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();

  const [code, setCode] = useState('');

  useEffect(() => {
    if (code.length === 6) {
      if (signin === 'true') {
        verifySignIn();
      } else {
        verifyCode();
      }
    }
  }, [code]);

  const verifyCode = async () => {};

  const verifySignIn = async () => {};

  console.log(phone);

  return (
    <View style={defaultStyles.container}>
      <Text>Phone</Text>
    </View>
  );
}
