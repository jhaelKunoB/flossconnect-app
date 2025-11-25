import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSemanticColors } from "@/hooks/useSemanticColors";

// 👇 NUEVO: imports del flujo simple con Axios
import { loginEmail, saveSession } from '@/api/services/auth';
import { getErrorMessage } from '@/api/client';

const Logo = require("@/assets/images/logo.png");

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const c = useSemanticColors();
  const router = useRouter();
  const { login } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false); // 👈 NUEVO

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });


  const onSubmit = async ({ email, password }: FormData) => {
    try {
      setLoading(true);
      const { accessToken, user } = await loginEmail({ email: email.trim(), password });
      if (!accessToken) {
        throw new Error('Token faltante en la respuesta del servidor');
      }
      await login({ token: accessToken, user });    // tu hook de auth
      router.replace("/(tabs)");
    } catch (e: any) {
      const msg = getErrorMessage(e) || "Credenciales inválidas";
      setError("root", { type: "server", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>


      <View style={{ marginTop: 60, marginLeft: 30 }}>
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
          <MaterialIcons name="arrow-back-ios-new" size={24} color={c.textPrimary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Bienvenido de nuevo</Text>
        <Text style={styles.subtitle}>Introduzca sus datos para iniciar sesión.</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <TextInput
              label="Email"
              value={value}
              onChangeText={onChange}
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
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <View style={{ width: "100%", maxWidth: 320 }}>
              <View style={{ position: "relative" }}>
                <TextInput
                  label="Contraseña"
                  placeholder="••••••••"
                  secureTextEntry={!showPass}
                  value={value}
                  onChangeText={(t) => onChange(t.replace(/\s/g, ""))}
                  onBlur={onBlur}
                  error={error?.message}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  style={{ paddingRight: 44 }}
                />
                <TouchableOpacity
                  onPress={() => setShowPass((v) => !v)}
                  accessibilityRole="button"
                  accessibilityLabel={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                  style={styles.eyeBtn}
                >
                  <Ionicons name={showPass ? "eye-off" : "eye"} size={20} color="#707f86" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <TouchableOpacity style={styles.forgot} onPress={() => router.push("/(Auth)/ForgotPassword")}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {!!errors.root?.message && <Text style={styles.error}>{errors.root?.message}</Text>}

        <Button
          title={loading ? "Entrando..." : "Entrar"}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={!isValid || loading}
          variant="primary"
        />

        <View style={styles.containerLine}>
          <View style={[styles.line, { backgroundColor: c.border }]} />
          <Text style={[styles.textLine, { color: c.primary }]}>o entra con</Text>
          <View style={[styles.line, { backgroundColor: c.border }]} />
        </View>

        <Button
          title="Continuar con Google"
          onPress={() => { }}
          variant="outline"
          icon={<Ionicons name="logo-google" size={20} color={c.primary} />}
        />

        <View style={styles.register}>
          <Text>No tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => router.push("/(Auth)/RegisterScreen")}>
            <Text style={styles.textRegister}> Regístrate</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 5, color: "#222" },
  subtitle: { fontSize: 14, marginBottom: 35, color: "#666" },
  eyeBtn: { position: "absolute", right: 10, top: 42, height: 28, width: 28, alignItems: "center", justifyContent: "center" },
  forgot: { width: "100%", maxWidth: 320, marginBottom: 10 },
  forgotText: { color: "#0d6fd8ff", textAlign: "right" },
  error: { color: "#d00", marginBottom: 8, alignSelf: "flex-start", maxWidth: 320 },
  logo: { width: 110, height: 100, resizeMode: "contain", marginBottom: 20 },
  register: { flexDirection: "row", marginTop: 30 },
  textRegister: { color: "#0d6fd8ff" },
  containerLine: { flexDirection: "row", alignItems: "center", width: "100%", maxWidth: 320, marginVertical: 20 },
  line: { flex: 1, height: 1 },
  textLine: { marginHorizontal: 12, fontSize: 14, fontWeight: "500" },
});
