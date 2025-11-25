import { useAuth } from "@/hooks/useAuth";
import { useRouter, Redirect } from "expo-router";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';


const { width } = Dimensions.get("window");

const PresentationScreen = () => {
  const router = useRouter();
  
  const { initializing, isLoggedIn } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // 👇 si ya hay sesión, no muestres nada más: redirige
  if (isLoggedIn) return <Redirect href="/(tabs)" />;


  const handleLogin = async () => {
    //await setIsLoggedIn(true);
    router.push("/(Auth)/LoginScreen");
  };

  const handleRegister = () => {
    router.push("/(Auth)/RegisterScreen");
  };

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Degradado sutil para mejorar legibilidad */}
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.2)']}
        style={styles.gradient}
      />

      {/* Logo */}
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

   
      <View style={styles.textContainer}>
        <Text style={styles.title}>Bienvenido a Floosconect</Text>
        <Text style={styles.subtitle}>Elige tu clínica de preferencia, gestiona tus citas y accede a promociones exclusivas.</Text>
      </View> 

      {/* Botones */}
      <View style={styles.buttonsContainer}>
        <BlurView intensity={90} tint="dark" style={styles.blurButton}>
          <TouchableOpacity style={styles.buttonContent} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </BlurView>

        <BlurView intensity={100} tint="light" style={styles.blurButton}>
          <TouchableOpacity style={styles.buttonContent} onPress={handleRegister}>
            <Text style={styles.buttonTextSecondary}>Crear cuenta</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </ImageBackground>
  );
};

export default PresentationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 50,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    marginTop: 60,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 200,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E0E0",
    textAlign: "center",
    lineHeight: 22,
  },
  buttonsContainer: {
    width: "85%",
    marginBottom: 40,
  },
  blurButton: {
    borderRadius: 14,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  buttonContent: {
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: "#0f1316ff",
    fontSize: 16,
    fontWeight: "600",
  },
});
