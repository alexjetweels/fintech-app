import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { Controller, useForm } from 'react-hook-form';

const schema = z.object({
  phoneNumber: z.string().min(9, { message: 'Phone number is required' }),
  countryPhoneCode: z.string().min(1, { message: 'Country code is required' }),
});

type FormFields = z.infer<typeof schema>;

export default function SignUp() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      countryPhoneCode: '+84',
      phoneNumber: '',
    },
  });

  const phoneNumber = watch('phoneNumber');

  const router = useRouter();

  const { signUp } = useSignUp();

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;

  const onSubmit = async (data: FormFields) => {
    const { countryPhoneCode, phoneNumber } = data;

    const fullPhoneNumber = countryPhoneCode + phoneNumber;

    try {
      await signUp?.create({
        phoneNumber: fullPhoneNumber,
      });

      router.push({
        pathname: '/verify/[phone]',
        params: {
          phone: fullPhoneNumber,
        },
      });
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

        <View style={{ marginVertical: 40 }}>
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <Controller
                control={control}
                name='countryPhoneCode'
                render={({ field: { onChange, value } }) => (
                  <CountryPhoneSelection value={value} onChange={onChange} />
                )}
              />
            </View>

            <Controller
              control={control}
              name='phoneNumber'
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholderTextColor={Colors.gray}
                  style={[styles.input, { flex: 1 }]}
                  placeholder='Mobile number'
                  keyboardType='numeric'
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {errors.phoneNumber && (
            <Text style={{ color: 'red' }}>{errors.phoneNumber.message}</Text>
          )}
          {errors.countryPhoneCode && (
            <Text style={{ color: 'red' }}>
              {errors.countryPhoneCode.message}
            </Text>
          )}
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
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={defaultStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginVertical: 10,
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
