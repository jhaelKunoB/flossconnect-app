import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import Header from "@/components/IndexCom/HeaderApp"
import { useAuth } from '@/hooks/useAuth';


export default function Index() {
  const { user, logout } = useAuth();

  return (
    <ThemedView>
        <Header
        avatar={require("@/assets/images/avatar.jpeg")}
        name={user?.firstname + " " + user?.lastname}
        badgeCount={3}
        onPressBell={() => logout()}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
