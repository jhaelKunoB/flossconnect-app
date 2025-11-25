// screens/ForgotPassword.tsx
import Button from "@/components/Button";
import Header from "@/components/HeaderScreen";
import OTPInput from "@/components/RegisterCom/OTPInput";
import TextInput from "@/components/TextInput";
import { useSemanticColors } from "@/hooks/useSemanticColors";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { z } from "zod";
import { ThemedView } from "@/components/themed-view"
//API
import { sendPasswordChangeCode, verifyPasswordChangeCode, resetPassword } from '@/api/services/auth';
import ModalMessage from "@/components/ModalMessage";

// Schemas de validación por paso
const emailSchema = z.object({
    email: z.string().email("Email inválido").min(1, "Email es requerido"),
});

const codeSchema = z.object({
    code: z.string().length(6, "El código debe tener 6 dígitos"),
});

const passwordSchema = z.object({
    password: z.string().min(8, "Mínimo 8 caracteres")
        .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
        .regex(/[a-z]/, "Debe tener al menos una minúscula")
        .regex(/[0-9]/, "Debe tener al menos un número"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type EmailFormData = z.infer<typeof emailSchema>;
type CodeFormData = z.infer<typeof codeSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const ForgotPassword = () => {
    const router = useRouter();
    const c = useSemanticColors();
    const [step, setStep] = useState(1); // 1: Email, 2: Código, 3: Nueva contraseña
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form para email
    const {
        control: emailControl,
        handleSubmit: handleEmailSubmit,
        formState: { errors: emailErrors },
        setError: setEmailError
    } = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
    });
    // Form para código
    const {
        control: codeControl,
        handleSubmit: handleCodeSubmit,
        formState: { errors: codeErrors },
        setError: setCodeError
    } = useForm<CodeFormData>({
        resolver: zodResolver(codeSchema),
    });
    // Form para nueva contraseña
    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });


    //Para el modal
    const [modal, setModal] = useState({
        visible: false,
        title: "",
        message: "",
        variant: "info" as "success" | "warning" | "error" | "info",
        primaryText: "",
        onPrimary: () => { }
    });
    const showModal = (opts: Partial<typeof modal>) =>
        setModal((s) => ({ ...s, visible: true, ...opts }));
    const hideModal = () =>
        setModal((s) => ({ ...s, visible: false }));


    // Enviar código de recuperación
    const sendRecoveryCode = async (data: EmailFormData) => {
        setIsLoading(true);
        const result = await sendPasswordChangeCode(data.email);
        if (!result.success) {
            showModal({
                variant: "error",
                title: "Error",
                message: result.message || "No se pudo reenviar el código",
                primaryText: "Cerrar",
                onPrimary: hideModal
            });
            setIsLoading(false);
            return;
        }
        setEmail(data.email);
        setStep(2);
        setIsLoading(false);
    };



    // Verificar código
    const verifyCode = async (data: CodeFormData) => {
        setIsLoading(true);

        const response = await verifyPasswordChangeCode(email, data.code);
        console.log("verifyCode response:", response);
        if (!response.success) {
            // ✅ Mostrar error en el input del código en lugar de Alert
            setCodeError("code", {
                type: "server",
                message: response.message || "Código inválido o expirado"
            });
            setIsLoading(false);
            return;
        }

        // ✅ Éxito - continuar al siguiente paso
        setStep(3);
        setIsLoading(false);
    };

    // Restablecer contraseña
    const resetPasswords = async (data: PasswordFormData) => {
        setIsLoading(true);
        try {
            // Aquí va tu llamada a la API
            // const response = await fetch('/api/reset-password', { ... });
            const response = await resetPassword(email, data.password);
            if (!response.success) {
                showModal({
                    variant: "error",
                    title: "Error",
                    message: response.message || "No se pudo reenviar el código",
                    primaryText: "Cerrar",
                    onPrimary: hideModal
                });
                return;
            }

            showModal({
                variant: "success",
                title: "¡Listo!",
                message: "Tu contraseña ha sido restablecida exitosamente.",
                primaryText: "Iniciar sesión",
                onPrimary: () => { hideModal(); router.replace("/"); }
            });
        } catch (error) {
            Alert.alert("Error", "No se pudo restablecer la contraseña.");
        } finally {
            setIsLoading(false);
        }
    };

    // Reenviar código
    const resendCode = async () => {
        setIsLoading(true);
        const result = await sendPasswordChangeCode(email);
        if (!result.success) {
            showModal({
                variant: "error",
                title: "Error",
                message: result.message || "No se pudo reenviar el código",
                primaryText: "Cerrar",
                onPrimary: hideModal
            });
            setIsLoading(false);
            return;
        }

        showModal({
            variant: "success",
            title: "Código reenviado",
            message: "Revisa tu correo nuevamente",
            primaryText: "Continuar",
            onPrimary: hideModal
        });
        setIsLoading(false);
    };


    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            router.back();
        }
    };

    const getStepInfo = () => {
        switch (step) {
            case 1:
                return {
                    title: "Recuperar Contraseña",
                    icon: "mail-outline" as const,
                    subtitle: "Ingresa tu correo electrónico",
                    description: "Te enviaremos un código de verificación para restablecer tu contraseña",
                };
            case 2:
                return {
                    title: "Verificar Código",
                    icon: "shield-checkmark-outline" as const,
                    subtitle: "Código de verificación",
                    description: `Ingresa el código de 6 dígitos enviado a ${email}`,
                };
            case 3:
                return {
                    title: "Nueva Contraseña",
                    icon: "lock-closed-outline" as const,
                    subtitle: "Crea una nueva contraseña",
                    description: "Asegúrate de que sea segura y fácil de recordar",
                };
            default:
                return {
                    title: "Recuperar Contraseña",
                    icon: "mail-outline" as const,
                    subtitle: "",
                    description: "",
                };
        }
    };

    const stepInfo = getStepInfo();

    return (
        <ThemedView style={{ flex: 1 }}>

            <Header title={stepInfo.title} onBack={handleBack} backgroundColor={c.surface} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        {/* Indicador de pasos */}
                        <View style={styles.stepIndicator}>
                            {[1, 2, 3].map((s) => (
                                <View
                                    key={s}
                                    style={[
                                        styles.stepDot,
                                        {
                                            backgroundColor: s <= step ? c.primary : c.border,
                                        },
                                    ]}
                                />
                            ))}
                        </View>

                        {/* Icono y descripción */}
                        <View style={styles.headerSection}>
                            <View
                                style={[
                                    styles.iconCircle,
                                    { backgroundColor: c.primary + "15" },
                                ]}
                            >
                                <Ionicons name={stepInfo.icon} size={40} color={c.primary} />
                            </View>
                            <Text style={[styles.subtitle, { color: c.textPrimary }]}>
                                {stepInfo.subtitle}
                            </Text>
                            <Text style={[styles.description, { color: c.textSecondary }]}>
                                {stepInfo.description}
                            </Text>
                        </View>

                        {/* Paso 1: Email */}
                        {step === 1 && (
                            <>
                                <Controller
                                    control={emailControl}
                                    name="email"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            label="Correo electrónico"
                                            placeholder="correo@ejemplo.com"
                                            value={value}
                                            onChangeText={onChange}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            leftIcon={
                                                <Ionicons
                                                    name="mail-outline"
                                                    size={20}
                                                    color={c.textSecondary}
                                                />
                                            }
                                            error={emailErrors.email?.message}
                                        />
                                    )}
                                />

                                <Button
                                    title={isLoading ? "Enviando..." : "Enviar código"}
                                    onPress={handleEmailSubmit(sendRecoveryCode)}
                                    variant="primary"
                                    disabled={isLoading}
                                    style={styles.submitButton}
                                />
                            </>
                        )}

                        {/* Paso 2: Código de verificación */}
                        {step === 2 && (
                            <>
                                <Controller
                                    control={codeControl}
                                    name="code"
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <OTPInput
                                                length={6}
                                                value={value || ""}
                                                onChangeText={onChange}
                                                error={codeErrors.code?.message}
                                            />
                                            {codeErrors.code && (
                                                <Text style={styles.errorText}>
                                                    {codeErrors.code.message}
                                                </Text>
                                            )}
                                        </>
                                    )}
                                />

                                <Button
                                    title={isLoading ? "Verificando..." : "Verificar código"}
                                    onPress={handleCodeSubmit(verifyCode)}
                                    variant="primary"
                                    disabled={isLoading}
                                    style={styles.submitButton}
                                />

                                <TouchableOpacity
                                    onPress={resendCode}
                                    disabled={isLoading}
                                    style={styles.resendButton}
                                >
                                    <Ionicons
                                        name="refresh"
                                        size={16}
                                        color={isLoading ? c.textSecondary : c.primary}
                                    />
                                    <Text
                                        style={[
                                            styles.resendText,
                                            {
                                                color: isLoading
                                                    ? c.textSecondary
                                                    : c.primary,
                                            },
                                        ]}
                                    >
                                        {isLoading ? "Enviando..." : "Reenviar código"}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {/* Paso 3: Nueva contraseña */}
                        {step === 3 && (
                            <>
                                <Controller
                                    control={passwordControl}
                                    name="password"
                                    render={({ field: { onChange, value } }) => (
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                label="Nueva contraseña"
                                                placeholder="Mínimo 8 caracteres"
                                                value={value}
                                                onChangeText={onChange}
                                                secureTextEntry={!showPassword} // Controla visibilidad
                                                leftIcon={
                                                    <Ionicons
                                                        name="lock-closed-outline"
                                                        size={20}
                                                        color={c.textSecondary}
                                                    />
                                                }
                                                error={passwordErrors.password?.message}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowPassword(!showPassword)}
                                                style={styles.toggleIcon}
                                                accessibilityLabel="Alternar visibilidad de contraseña"
                                                accessibilityHint={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                            >
                                                <Ionicons
                                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                                    size={20}
                                                    color={c.textSecondary}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />

                                <Controller
                                    control={passwordControl}
                                    name="confirmPassword"
                                    render={({ field: { onChange, value } }) => (
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                label="Confirmar contraseña"
                                                placeholder="Repite tu contraseña"
                                                value={value}
                                                onChangeText={onChange}
                                                secureTextEntry={!showConfirmPassword} // Controla visibilidad
                                                leftIcon={
                                                    <Ionicons
                                                        name="lock-closed-outline"
                                                        size={20}
                                                        color={c.textSecondary}
                                                    />
                                                }
                                                error={passwordErrors.confirmPassword?.message}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={styles.toggleIcon}
                                                accessibilityLabel="Alternar visibilidad de confirmar contraseña"
                                                accessibilityHint={showConfirmPassword ? "Ocultar confirmar contraseña" : "Mostrar confirmar contraseña"}
                                            >
                                                <Ionicons
                                                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                                    size={20}
                                                    color={c.textSecondary}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />

                                <Button
                                    title={
                                        isLoading
                                            ? "Restableciendo..."
                                            : "Restablecer contraseña"
                                    }
                                    onPress={handlePasswordSubmit(resetPasswords)}
                                    variant="primary"
                                    disabled={isLoading}
                                    style={styles.submitButton}
                                />
                            </>
                        )}

                        {/* Link para volver al login */}
                        {step === 1 && (
                            <TouchableOpacity
                                onPress={() => {
                                    router.replace("/");
                                }}
                                style={styles.backToLoginButton}
                            >
                                <Ionicons
                                    name="arrow-back"
                                    size={16}
                                    color={c.textSecondary}
                                />
                                <Text style={[styles.backToLoginText, { color: c.textSecondary }]}>
                                    Volver al inicio de sesión
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <ModalMessage
                visible={modal.visible}
                title={modal.title}
                message={modal.message}
                variant={modal.variant}
                primaryText={modal.primaryText}
                onPrimary={modal.onPrimary}
                //onRequestClose={hideModal}
            />

        </ThemedView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        paddingVertical: 24,
    },
    container: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 16,
    },
    stepIndicator: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 24,
        gap: 8,
    },
    stepDot: {
        width: 40,
        height: 6,
        borderRadius: 3,
    },
    headerSection: {
        alignItems: "center",
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
        textAlign: "center",
    },
    description: {
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
        maxWidth: 300,
    },
    submitButton: {
        width: "100%",
        maxWidth: 320,
        marginTop: 8,
    },
    resendButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 16,
        padding: 8,
    },
    resendText: {
        fontSize: 14,
        fontWeight: "600",
    },
    backToLoginButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 24,
        padding: 8,
    },
    backToLoginText: {
        fontSize: 14,
        fontWeight: "500",
    },
    errorText: {
        color: "#EF4444",
        fontSize: 12,
        textAlign: "center",
        marginTop: -8,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        maxWidth: 320,
        marginVertical: 5,
    },
    toggleIcon: {
        position: "absolute",
        right: 12,
        top: 50,
    }
});

export default ForgotPassword;