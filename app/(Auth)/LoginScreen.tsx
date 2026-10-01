import { useEffect, useRef, useState } from "react";

import { Animated, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { Controller, useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { LinearGradient } from "expo-linear-gradient";

import { useRouter } from "expo-router";

import Button from "@/components/Button";
import TextInput from "@/components/TextInput";

import { useSemanticColors } from "@/hooks/useSemanticColors";

import { usePatientAuth } from "@/hooks/useAuth";

import { loginPatient } from "@/api/services/auth";

import { getErrorMessage } from "@/api/client";

const Logo = require("@assets/images/logo.png");


/* ========================================================================== */
/*                                  SCHEMA                                    */
/* ========================================================================== */

const schema = z.object({
  email: z.string().trim().min(1, "Ingresa tu correo electrónico").email("Ingresa un correo válido"),

  password: z.string().min(1, "Ingresa tu contraseña").min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

/* ========================================================================== */
/*                              LOGIN SCREEN                                  */
/* ========================================================================== */

export default function LoginScreen() {
  const router = useRouter();

  const c = useSemanticColors();

  const { login } = usePatientAuth();

  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);

  const errorAnimation = useRef(new Animated.Value(0)).current;

  const {
    control,

    handleSubmit,

    setError,

    clearErrors,

    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    mode: "onChange",

    defaultValues: {
      email: "",

      password: "",
    },
  });

  /* ====================================================================== */
  /* ERROR BANNER ANIMATION                                                 */
  /* ====================================================================== */

  useEffect(() => {
    if (errors.root?.message) {
      Animated.spring(errorAnimation, {
        toValue: 1,

        useNativeDriver: true,

        friction: 7,

        tension: 60,
      }).start();
    } else {
      errorAnimation.setValue(0);
    }
  }, [errors.root?.message, errorAnimation]);

  /* ====================================================================== */
  /* LOGIN                                                                  */
  /* ====================================================================== */

  const onSubmit = async ({ email, password }: FormData) => {
    try {
      setLoading(true);

      clearErrors("root");

      const { accessToken, user } = await loginPatient({
        email: email.trim(),
        password,
      });

      if (!accessToken) {
        throw new Error("No se recibió una sesión válida");
      }

      if (user.role !== "Paciente") {
        throw new Error("Esta aplicación es exclusiva para pacientes");
      }

      await login({
        token: accessToken,
        user,
      });

      router.replace("/(tabs)");
    } catch (e: any) {
      const message = getErrorMessage(e) || "No pudimos iniciar sesión. Revisa tus datos e inténtalo nuevamente.";

      setError("root", {
        type: "server",

        message,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ====================================================================== */
  /* VIEW                                                                   */
  /* ====================================================================== */

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#F5FBFD", "#FFFFFF", "#F8FBFC"]} locations={[0, 0.45, 1]} style={styles.background}>
        {/* ================================================================ */}
        {/* DECORATIVE BACKGROUND                                            */}
        {/* ================================================================ */}

        <View pointerEvents="none" style={styles.decorations}>
          <View style={styles.glowTop} />

          <View style={styles.glowBottom} />
        </View>

        {/* ================================================================ */}
        {/* BACK BUTTON                                                      */}
        {/* ================================================================ */}

        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back-ios-new" size={18} color={c.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ================================================================ */}
        {/* KEYBOARD                                                         */}
        {/* ================================================================ */}

        <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {/* ============================================================ */}
            {/* CARD                                                         */}
            {/* ============================================================ */}

            <View style={styles.card}>
              {/* ========================================================== */}
              {/* BRAND                                                      */}
              {/* ========================================================== */}

              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <Image source={Logo} style={styles.logo} resizeMode="contain" />
                </View>

                <Text style={styles.title}>Bienvenido de nuevo</Text>

                <Text style={styles.subtitle}>Accede a tu espacio personal y mantente conectado con tu atención dental.</Text>
              </View>

              {/* ========================================================== */}
              {/* SERVER ERROR BANNER                                        */}
              {/* ========================================================== */}

              {!!errors.root?.message && (
                <Animated.View
                  style={[
                    styles.errorBanner,

                    {
                      opacity: errorAnimation,

                      transform: [
                        {
                          translateY: errorAnimation.interpolate({
                            inputRange: [0, 1],

                            outputRange: [-10, 0],
                          }),
                        },

                        {
                          scale: errorAnimation.interpolate({
                            inputRange: [0, 1],

                            outputRange: [0.97, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.errorIcon}>
                    <Ionicons name="alert-circle-outline" size={20} color="#C24141" />
                  </View>

                  <View style={styles.errorContent}>
                    <Text style={styles.errorTitle}>No pudimos iniciar sesión</Text>

                    <Text style={styles.errorText}>{errors.root?.message}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => clearErrors("root")}
                    accessibilityRole="button"
                    accessibilityLabel="Cerrar mensaje"
                    style={styles.errorClose}
                  >
                    <Ionicons name="close" size={18} color="#9F4545" />
                  </TouchableOpacity>
                </Animated.View>
              )}

              {/* ========================================================== */}
              {/* EMAIL                                                      */}
              {/* ========================================================== */}

              <View style={styles.form}>
                <Controller
                  control={control}
                  name="email"
                  render={({
                    field: { value, onChange, onBlur },

                    fieldState: { error },
                  }) => (
                    <TextInput
                      label="Correo electrónico"
                      value={value}
                      onChangeText={(text) => {
                        clearErrors("root");

                        onChange(text);
                      }}
                      onBlur={() => {
                        onChange(value?.trim() ?? "");

                        onBlur();
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="emailAddress"
                      autoComplete="email"
                      placeholder="tu@email.com"
                      error={error?.message}
                      returnKeyType="next"
                    />
                  )}
                />

                {/* ======================================================== */}
                {/* PASSWORD                                                 */}
                {/* ======================================================== */}

                <Controller
                  control={control}
                  name="password"
                  render={({
                    field: { value, onChange, onBlur },

                    fieldState: { error },
                  }) => (
                    <View style={styles.passwordWrapper}>
                      <View style={styles.passwordContainer}>
                        <TextInput
                          label="Contraseña"
                          placeholder="••••••••"
                          secureTextEntry={!showPass}
                          value={value}
                          onChangeText={(text) => {
                            clearErrors("root");

                            onChange(text.replace(/\s/g, ""));
                          }}
                          onBlur={onBlur}
                          error={error?.message}
                          autoCapitalize="none"
                          autoCorrect={false}
                          textContentType="password"
                          autoComplete="password"
                          returnKeyType="done"
                          onSubmitEditing={handleSubmit(onSubmit)}
                          style={{
                            paddingRight: 48,
                          }}
                        />

                        <TouchableOpacity
                          onPress={() => setShowPass((current) => !current)}
                          activeOpacity={0.7}
                          accessibilityRole="button"
                          accessibilityLabel={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                          style={styles.eyeButton}
                        >
                          <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={20} color="#64748B" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />

                {/* ======================================================== */}
                {/* FORGOT PASSWORD                                          */}
                {/* ======================================================== */}

                <TouchableOpacity style={styles.forgot} activeOpacity={0.7} onPress={() => router.push("/(Auth)/ForgotPassword")}>
                  <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                {/* ======================================================== */}
                {/* LOGIN BUTTON                                             */}
                {/* ======================================================== */}

                <View style={styles.loginButton}>
                  <Button
                    title={loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    onPress={handleSubmit(onSubmit)}
                    loading={loading}
                    disabled={!isValid || loading}
                    variant="primary"
                  />
                </View>
              </View>

              {/* ========================================================== */}
              {/* DIVIDER                                                    */}
              {/* ========================================================== */}

              <View style={styles.divider}>
                <View
                  style={[
                    styles.dividerLine,

                    {
                      backgroundColor: c.border,
                    },
                  ]}
                />

                <Text style={styles.dividerText}>o</Text>

                <View
                  style={[
                    styles.dividerLine,

                    {
                      backgroundColor: c.border,
                    },
                  ]}
                />
              </View>

              {/* ========================================================== */}
              {/* GOOGLE                                                     */}
              {/* ========================================================== */}

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  /*
                   * Implementaremos Google Sign-In
                   * cuando conectemos ese endpoint.
                   */
                }}
                style={styles.googleButton}
              >
                <View style={styles.googleIcon}>
                  <Ionicons name="logo-google" size={19} color="#005482" />
                </View>

                <Text style={styles.googleText}>Continuar con Google</Text>
              </TouchableOpacity>

              {/* ========================================================== */}
              {/* REGISTER                                                   */}
              {/* ========================================================== */}

              <View style={styles.register}>
                <Text style={styles.registerLabel}>¿Aún no tienes una cuenta?</Text>

                <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/(Auth)/RegisterScreen")}>
                  <Text style={styles.registerLink}>Crear cuenta</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ============================================================ */}
            {/* FOOTER                                                       */}
            {/* ============================================================ */}

            <View style={styles.footer}>
              <Ionicons name="shield-checkmark-outline" size={14} color="#94A3B8" />

              <Text style={styles.footerText}>Tu información se mantiene protegida</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

/* ========================================================================== */
/*                                  STYLES                                    */
/* ========================================================================== */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,

    backgroundColor: "#F5FBFD",
  },

  background: {
    flex: 1,
  },

  decorations: {
    //...StyleSheet.absoluteFillObject,

    overflow: "hidden",
  },

  glowTop: {
    position: "absolute",

    width: 330,

    height: 330,

    borderRadius: 999,

    backgroundColor: "rgba(51, 196, 219, 0.10)",

    top: -170,

    right: -130,
  },

  glowBottom: {
    position: "absolute",

    width: 280,

    height: 280,

    borderRadius: 999,

    backgroundColor: "rgba(0, 84, 130, 0.07)",

    bottom: -140,

    left: -150,
  },

  /* -------------------------------------------------------------------- */
  /* TOP                                                                  */
  /* -------------------------------------------------------------------- */

  topBar: {
    paddingTop: Platform.OS === "android" ? 18 : 8,

    paddingHorizontal: 20,

    zIndex: 10,
  },

  backButton: {
    width: 42,

    height: 42,

    borderRadius: 14,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "rgba(255,255,255,0.92)",

    borderWidth: 1,

    borderColor: "#E7EEF1",

    shadowColor: "#0F172A",

    shadowOpacity: 0.06,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,

      height: 4,
    },

    elevation: 2,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: 20,

    paddingTop: 12,

    paddingBottom: 30,
  },

  /* -------------------------------------------------------------------- */
  /* CARD                                                                 */
  /* -------------------------------------------------------------------- */

  card: {
    width: "100%",

    maxWidth: 390,

    backgroundColor: "rgba(255,255,255,0.96)",

    borderRadius: 28,

    paddingHorizontal: 24,

    paddingTop: 25,

    paddingBottom: 24,

    borderWidth: 1,

    borderColor: "#E8F0F2",

    shadowColor: "#0F3F54",

    shadowOpacity: 0.09,

    shadowRadius: 28,

    shadowOffset: {
      width: 0,

      height: 14,
    },

    elevation: 5,
  },

  /* -------------------------------------------------------------------- */
  /* HEADER                                                               */
  /* -------------------------------------------------------------------- */

  header: {
    alignItems: "center",

    marginBottom: 26,
  },

  logoContainer: {
    width: 86,

    height: 86,

    borderRadius: 24,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "#F3FAFC",

    borderWidth: 1,

    borderColor: "#E4F1F5",

    marginBottom: 18,
  },

  logo: {
    width: 70,

    height: 70,
  },

  title: {
    fontSize: 26,

    lineHeight: 32,

    fontWeight: "700",

    color: "#0F172A",

    letterSpacing: -0.6,

    textAlign: "center",
  },

  subtitle: {
    maxWidth: 310,

    marginTop: 8,

    color: "#64748B",

    fontSize: 13.5,

    lineHeight: 20,

    textAlign: "center",
  },

  /* -------------------------------------------------------------------- */
  /* ERROR                                                                */
  /* -------------------------------------------------------------------- */

  errorBanner: {
    width: "100%",

    flexDirection: "row",

    alignItems: "flex-start",

    padding: 13,

    borderRadius: 16,

    borderWidth: 1,

    borderColor: "#F3CACA",

    backgroundColor: "#FFF5F5",

    marginBottom: 20,
  },

  errorIcon: {
    width: 32,

    height: 32,

    borderRadius: 10,

    backgroundColor: "#FDE7E7",

    alignItems: "center",

    justifyContent: "center",

    marginRight: 10,
  },

  errorContent: {
    flex: 1,

    paddingTop: 1,
  },

  errorTitle: {
    color: "#9F3636",

    fontSize: 12,

    fontWeight: "700",

    marginBottom: 2,
  },

  errorText: {
    color: "#A85454",

    fontSize: 11,

    lineHeight: 16,
  },

  errorClose: {
    padding: 3,

    marginLeft: 4,
  },

  /* -------------------------------------------------------------------- */
  /* FORM                                                                 */
  /* -------------------------------------------------------------------- */

  form: {
    width: "100%",
  },

  passwordWrapper: {
    width: "100%",

    marginTop: 2,
  },

  passwordContainer: {
    position: "relative",

    width: "100%",
  },

  eyeButton: {
    position: "absolute",

    right: 11,

    top: 40,

    width: 32,

    height: 32,

    borderRadius: 10,

    alignItems: "center",

    justifyContent: "center",
  },

  forgot: {
    alignSelf: "flex-end",

    marginTop: 2,

    marginBottom: 18,

    paddingVertical: 4,
  },

  forgotText: {
    color: "#005482",

    fontSize: 12,

    fontWeight: "600",
  },

  loginButton: {
    width: "100%",
  },

  /* -------------------------------------------------------------------- */
  /* DIVIDER                                                              */
  /* -------------------------------------------------------------------- */

  divider: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",

    marginVertical: 22,
  },

  dividerLine: {
    flex: 1,

    height: StyleSheet.hairlineWidth,
  },

  dividerText: {
    marginHorizontal: 13,

    color: "#94A3B8",

    fontSize: 12,
  },

  /* -------------------------------------------------------------------- */
  /* GOOGLE                                                               */
  /* -------------------------------------------------------------------- */

  googleButton: {
    width: "100%",

    height: 50,

    borderRadius: 14,

    borderWidth: 1,

    borderColor: "#DCE6EA",

    backgroundColor: "#FFFFFF",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    position: "relative",
  },

  googleIcon: {
    position: "absolute",

    left: 17,

    alignItems: "center",

    justifyContent: "center",
  },

  googleText: {
    color: "#334155",

    fontSize: 13,

    fontWeight: "600",
  },

  /* -------------------------------------------------------------------- */
  /* REGISTER                                                             */
  /* -------------------------------------------------------------------- */

  register: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    flexWrap: "wrap",

    gap: 5,

    marginTop: 25,
  },

  registerLabel: {
    color: "#64748B",

    fontSize: 12.5,
  },

  registerLink: {
    color: "#005482",

    fontSize: 12.5,

    fontWeight: "700",
  },

  /* -------------------------------------------------------------------- */
  /* FOOTER                                                               */
  /* -------------------------------------------------------------------- */

  footer: {
    flexDirection: "row",

    alignItems: "center",

    gap: 5,

    marginTop: 20,
  },

  footerText: {
    color: "#94A3B8",

    fontSize: 10.5,
  },
});
