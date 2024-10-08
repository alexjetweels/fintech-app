import CountryPhoneSelection from '@/components/CountryPhoneSelection';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
  Alert,
} from 'react-native';

enum SignInType {
  Phone,
  Email,
  Google,
  Apple,
}

export default function Login() {
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  const router = useRouter();
  const { signIn } = useSignIn();

  const handleSubmit = async (type: SignInType) => {
    if (type === SignInType.Phone) {
      try {
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;

        const signInResponse = await signIn?.create({
          identifier: fullPhoneNumber,
        });

        const firstPhoneFactor = signInResponse?.supportedFirstFactors?.find(
          (factor) => factor.strategy === 'phone_code'
        );

        if (firstPhoneFactor?.phoneNumberId) {
          await signIn?.prepareFirstFactor({
            strategy: 'phone_code',
            phoneNumberId: firstPhoneFactor.phoneNumberId,
          });

          router.push({
            pathname: '/verify/[phone]',
            params: { phone: fullPhoneNumber, signin: 'true' },
          });
        }
      } catch (error) {
        console.error('error', JSON.stringify(error, null, 2));

        if (isClerkAPIResponseError(error)) {
          if (error.errors[0].code === 'form_identifier_not_found') {
            Alert.alert('Error', error.errors[0].message);
          }
        }
      }
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

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            phoneNumber ? styles.enable : styles.disabled,
          ]}
          onPress={() => handleSubmit(SignInType.Phone)}
        >
          <Text style={defaultStyles.buttonText}>
            {phoneNumber ? 'Log in' : 'Enter your phone'}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            marginTop: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />

          <Text style={{ color: Colors.gray, fontSize: 20 }}>or</Text>

          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => handleSubmit(SignInType.Email)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              gap: 16,
              marginTop: 20,
              backgroundColor: '#fff',
            },
          ]}
        >
          <Ionicons name='mail' size={24} color={'#000'} />
          <Text style={[defaultStyles.buttonText, { color: '#000' }]}>
            Continue with email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSubmit(SignInType.Google)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              gap: 16,
              marginTop: 20,
              backgroundColor: '#fff',
            },
          ]}
        >
          <Ionicons name='logo-google' size={24} color={'red'} />
          <Text style={[defaultStyles.buttonText, { color: '#000' }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSubmit(SignInType.Apple)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              gap: 16,
              marginTop: 20,
              backgroundColor: '#fff',
            },
          ]}
        >
          <Ionicons name='logo-apple' size={24} color={'#000'} />
          <Text style={[defaultStyles.buttonText, { color: '#000' }]}>
            Continue with Apple
          </Text>
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
