import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function VerifyPhone() {
  const { phone } = useLocalSearchParams<{ phone: string }>();

  console.log(phone);

  return (
    <View>
      <Text>Phone</Text>
    </View>
  );
}
