import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Touchable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { z } from 'zod';
import CountryPhoneSelection from '@/components/CountryPhoneSelection';

const schema = z.object({
  phoneNumber: z.string(),
  countryCode: z.string(),
});

type FormFields = z.infer<typeof schema>;

export default function SignUp() {
  const [countryCode, setCountryCode] = useState('+84');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const { signUp } = useSignUp();

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;

  const handleSubmit = async () => {
    const fullPhoneNumber = countryCode + phoneNumber;

    try {
      await signUp?.create({
        phoneNumber: countryCode + phoneNumber,
      });

      // router.push('/verify/[phone]', {
      //   phone: countryCode + phoneNumber,
      // });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior='padding'
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's get started</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number. We will send you a confirmation code there
        </Text>

        <View style={styles.inputContainer}>
          <View style={styles.input}>
            <CountryPhoneSelection
              value={countryCode}
              onChange={setCountryCode}
            />
          </View>

          <TextInput
            placeholderTextColor={Colors.gray}
            style={[styles.input, { flex: 1 }]}
            placeholder='Mobile number'
            keyboardType='numeric'
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <Link href={'/login'} replace asChild>
          <TouchableOpacity style={defaultStyles.pillButton}>
            <Text style={defaultStyles.textLink}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </Link>

        <View style={{ flex: 1 }}></View>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            { marginTop: 20 },
            phoneNumber ? styles.enable : styles.disabled,
          ]}
          onPress={handleSubmit}
        >
          <Text style={defaultStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: 'row',
  },

  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10,
  },
  enable: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});
