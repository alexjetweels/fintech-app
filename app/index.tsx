import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useAssets } from 'expo-asset';
import { ResizeMode, Video } from 'expo-av';
import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Index() {
  const [assets] = useAssets([require('@/assets/videos/intro.mp4')]);
  return (
    <View style={styles.container}>
      {assets && (
        <Video
          resizeMode={ResizeMode.COVER}
          isMuted
          isLooping
          shouldPlay
          source={{ uri: assets[0].uri }}
          style={styles.video}
        />
      )}

      <View style={styles.header}>
        <Text style={styles.headerText}>
          Ready to change the way you money?
        </Text>
      </View>

      <View style={styles.button}>
        <Link
          href={'/login'}
          asChild
          style={[
            defaultStyles.pillButton,
            { flex: 1, backgroundColor: Colors.dark },
          ]}
        >
          <TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '500' }}>
              Log in
            </Text>
          </TouchableOpacity>
        </Link>

        <Link
          href={'/sign-up'}
          asChild
          style={[
            defaultStyles.pillButton,
            { flex: 1, backgroundColor: 'white' },
          ]}
        >
          <TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: '500' }}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  header: {
    padding: 20,
    marginTop: 80,
  },

  headerText: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    textTransform: 'uppercase',
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 60,
    paddingHorizontal: 20,
  },
});
