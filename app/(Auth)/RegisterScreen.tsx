import Button from "@/components/Button";
import Header from "@/components/HeaderScreen";
import TextInput from "@/components/TextInput";
import { useSemanticColors } from "@/hooks/useSemanticColors";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

//Componentes
import { checkEmailExists, loginPatient, sendVerificationCode, verifyRegisterCode } from "@/api/services/auth";
import { getClinics } from "@/api/services/clinic";
import { getDepartments } from "@/api/services/department";
import { createPatient } from "@/api/services/patient";
import { getSpecialitys } from "@/api/services/speciality";
import DatePickerInput from "@/components/DatePickerInput";
import ModalMessage from "@/components/ModalMessage";
import OTPInput from "@/components/RegisterCom/OTPInput";
import StepHeader from "@/components/RegisterCom/StepHeaderProps";
import { usePatientAuth } from "@/hooks/useAuth";
import { Clinic } from "@/types/clinic";
import { Department } from "@/types/department";
import { RegisterPatientRequest } from "@/types/patient";
import { Specialty } from "@/types/speciality";
import { Image } from "expo-image";

const dentist = require("@assets/anim/dentist.gif");

// Schema de validación
const schema = z
  .object({
    firstName: z.string().min(1, "Nombres son requeridos"),
    firstLastName: z.string().min(1, "Primer apellido es requerido"),
    secondLastName: z.string().min(1, "Segundo apellido es requerido"),
    gender: z.enum(["M", "F"], {
      required_error: "Género es requerido",
      invalid_type_error: "Selecciona un género válido",
    }),
    dateOfBirth: z.string().min(1, "Fecha de nacimiento es requerida"),
    ci: z.string().min(7, "CI debe tener al menos 7 dígitos").regex(/^\d+$/, "CI debe contener solo números"),
    departmentId: z.string().min(1, "Departamento es requerido"),
    department: z.string().min(1, "Departamento es requerido"),
    address: z.string().min(1, "Dirección es requerida"),
    email: z.string().min(1, "Email es requerido").email("Email inválido"),
    phone: z.string().regex(/^\+?\d{8,}$/, "Teléfono debe tener al menos 8 dígitos"),
    verificationCode: z
      .string()
      .min(5, "El código debe tener 6 dígitos")
      .regex(/^\d{6}$/, "El código debe ser numérico"),
    password: z.string(),
    // .min(8, "La contraseña debe tener al menos 8 caracteres")
    // .regex(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    //     "La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales"
    // ),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
    clinic: z.number({
      required_error: "Debes seleccionar una clínica",
      invalid_type_error: "Selecciona una clínica válida",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const RegisterScreen = () => {
  const { login } = usePatientAuth();
  const router = useRouter();
  //const navigation = useNavigation();
  const c = useSemanticColors();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const clinicSheetRef = useRef<ActionSheetRef>(null);
  const departmentSheetRef = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();

  //Para el modal
  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as "success" | "warning" | "error" | "info",
    primaryText: "",
  });
  const showModal = (opts: Partial<typeof modal>) => setModal((s) => ({ ...s, visible: true, ...opts }));
  const hideModal = () => setModal((s) => ({ ...s, visible: false }));
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
    setValue,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      firstLastName: "",
      secondLastName: "",
      gender: undefined,
      dateOfBirth: "",
      ci: "",
      departmentId: "",
      department: "",
      address: "",
      email: "",
      phone: "",
      verificationCode: "",
      password: "",
      confirmPassword: "",
    },
  });
  const gender = watch("gender");
  const department = watch("department");
  const departmentId = watch("departmentId");
  // Animación
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [step]);

  // Cargar especialidades al montar el componente
  useEffect(() => {
    loadSpecialties();
    loadDepartments();
    loadClinics();
  }, []);

  // Mock API calls (replace with real API)
  const checkEmail = async (email: string): Promise<boolean> => {
    const exists = await checkEmailExists(email);
    return exists;
  };
  const sendVerification = async (email: string): Promise<boolean> => {
    const res = await sendVerificationCode(email);
    return res;
  };

  //------------------------------
  const verifyCode = async (code: string, email: string): Promise<boolean> => {
    const res = await verifyRegisterCode(email, code);
    return res;
  };

  // Función para cargar especialidades desde el API
  const [specialties, setSpecialties] = useState<Specialty[]>([]); // Estado para especialidades dinámicas
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const loadSpecialties = async () => {
    try {
      setLoadingSpecialties(true);
      const response = await getSpecialitys();
      setSpecialties(response);
    } catch (error) {
      console.error("❌ Error cargando especialidades:", error);
    } finally {
      setLoadingSpecialties(false);
    }
  };
  const [departments, setDepartments] = useState<Department[]>([]); // Estado para departamentos dinámicos
  const loadDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response);
    } catch (error) {
      console.error("❌ Error cargando departamentos:", error);
    }
  };
  const [clinics, setClinics] = useState<Clinic[]>([]); // Estado para clínicas dinámicas
  const loadClinics = async () => {
    try {
      const response = await getClinics();
      setClinics(response);
    } catch (error) {
      console.error("Error cargando clínicas:", error);
    }
  };
  //--------------------------------------

  const getDepartmentById = (id: string): Department | undefined => {
    return departments.find((dept) => dept.id.toString() === id);
  };

  const validateStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    if (step === 1) {
      fieldsToValidate = ["firstName", "firstLastName", "secondLastName", "gender", "dateOfBirth", "ci", "departmentId", "address", "email", "phone"];
    } else if (step === 2) {
      fieldsToValidate = ["verificationCode"];
    } else if (step === 3) {
      fieldsToValidate = ["password", "confirmPassword"];
    } else if (step === 4) {
      fieldsToValidate = ["clinic"];
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  // Manejar el paso siguiente
  const handleNext = async () => {
    setIsLoading(true);
    try {
      const isValid = await validateStep();
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      if (step === 1) {
        const emailExists = await checkEmail(watch("email"));
        if (emailExists) {
          showModal({
            variant: "error",
            title: "Correo registrado",
            message: "El correo electrónico ya está registrado.",
          });
          setError("email", {
            type: "server",
            message: "Este email ya está registrado",
          });
          setIsLoading(false);
          return;
        }
        const codeSent = await sendVerification(watch("email"));
        if (!codeSent) {
          showModal({
            variant: "error",
            title: "Error",
            message: "No se pudo enviar el código de verificación.",
          });
          setIsLoading(false);
          return;
        }
      } else if (step === 2) {
        const isCodeValid = await verifyCode(watch("verificationCode"), watch("email"));
        if (!isCodeValid) {
          setError("verificationCode", {
            type: "server",
            message: "Este código expirado o inválido",
          });
          setIsLoading(false);
          return;
        }
      }

      if (step < 4) {
        fadeAnim.setValue(0);
        setStep(step + 1);
      } else {
        handleSubmit(onSubmit)();
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Enviar formulario
  const onSubmit = async (data: FormData) => {
    Alert.alert("Éxito", "Registro completado!");
    console.log("Form Data:", data);

    // Ejemplo de cómo acceder a los datos:
    console.log("Nombre:", data.firstName);
    console.log("Primer Apellido:", data.firstLastName);
    console.log("Segundo Apellido:", data.secondLastName);
    console.log("Género:", data.gender); // Ahora será "M" o "F"
    console.log("ID del Departamento:", data.departmentId); // Este es el ID que necesitas para la BD
    console.log("Nombre del Departamento:", data.department); // Este es el nombre para mostrar

    // Obtener el objeto departamento completo usando las funciones helper:
    const selectedDepartment = getDepartmentById(data.departmentId);
    if (selectedDepartment) {
      console.log("Departamento completo:", selectedDepartment);
      console.log("ID del departamento:", selectedDepartment.id);
      console.log("Nombre del departamento:", selectedDepartment.name);
    }

    // Aquí harías tu llamada a la API para guardar el usuario
    // Ejemplo de objeto que enviarías a tu API:
    const userRegistrationData: RegisterPatientRequest = {
      firstName: data.firstName,
      firstLastName: data.firstLastName,
      secondLastName: data.secondLastName,
      gender: data.gender, // Ahora será "M" o "F"
      dateOfBirth: data.dateOfBirth,
      ci: data.ci,
      departmentId: parseInt(data.departmentId), // Convertir a número si tu API lo requiere
      address: data.address,
      email: data.email,
      phone: data.phone,
      password: data.password,
      clinicId: data.clinic, // Ahora siempre tendrá valor porque es obligatorio
      clinicName: clinics.find((c) => c.id === data.clinic)?.name,
    };

    console.log("Datos para enviar a API:", userRegistrationData);
    // Llamada a la API (descomenta y ajusta según tu API)
    await createPatient(userRegistrationData);

    //para iniciar sesión automático después del registro, descomenta y ajusta según tu API
    const { accessToken, user } = await loginPatient({ email: data.email.trim(), password: data.password });
    if (!accessToken) {
      throw new Error("Token faltante en la respuesta del servidor");
    }
    await login({ token: accessToken, user }); // tu hook de auth
    router.replace("/(tabs)"); // Redirigir a la pantalla principal después del registro
  };

  const handleBack = () => {
    if (step > 1) {
      fadeAnim.setValue(0);
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const STEP_CONFIG = {
    1: {
      icon: "person" as const,
      title: "Datos Personales",
      subtitle: "Completa tu información básica",
    },
    2: {
      icon: "mail" as const,
      title: "Verificación de Email",
      subtitle: "Te enviaremos un código a tu correo",
    },
    3: {
      icon: "lock-closed" as const,
      title: "Crear Contraseña",
      subtitle: "Protege tu cuenta con una contraseña segura",
    },
    4: {
      icon: "medical" as const,
      title: "Seleccionar Clínica",
      subtitle: "Debes elegir una clínica para completar tu registro",
    },
  } as const;

  const stepInfo = STEP_CONFIG[step as keyof typeof STEP_CONFIG];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

  // Usar los departamentos de la API para el filtro
  // Los departamentos ya se cargan desde getDepartments() en el useEffect

  // Filtrar clínicas basado en búsqueda, departamento y especialidad
  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch =
      !searchQuery ||
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.department?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (clinic.phone && clinic.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (clinic.specialities && clinic.specialities.some((spec) => spec.name.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCity = !selectedCity || clinic.department?.name === selectedCity;

    // Filtrar por especialidad - verificar si la clínica tiene la especialidad seleccionada
    const matchesSpecialty = !selectedSpecialty || (clinic.specialities && clinic.specialities.some((spec) => spec.name === selectedSpecialty));

    return matchesSearch && matchesCity && matchesSpecialty;
  });

  // Determinar si mostrar las clínicas (solo si hay búsqueda o filtros activos)
  const shouldShowClinics = searchQuery || selectedCity; // || selectedSpecialty; // Filtro especialidad deshabilitado

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: c.surface }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Header title="Crea tu cuenta" onBack={() => handleBack()} backgroundColor="white" />

        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          {stepInfo && <StepHeader icon={stepInfo.icon} title={stepInfo.title} subtitle={stepInfo.subtitle} numStep={step} />}

          <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Nombres"
                      placeholder="Nombres"
                      placeholderTextColor={c.textSecondary}
                      value={value}
                      onChangeText={onChange}
                      accessibilityLabel="Nombres"
                      error={errors.firstName?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="firstLastName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Primer Apellido"
                      placeholder="Primer apellido"
                      placeholderTextColor={c.textSecondary}
                      value={value}
                      onChangeText={onChange}
                      accessibilityLabel="Primer apellido"
                      error={errors.firstLastName?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="secondLastName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Segundo Apellido"
                      placeholder="Segundo apellido"
                      placeholderTextColor={c.textSecondary}
                      value={value}
                      onChangeText={onChange}
                      accessibilityLabel="Segundo apellido"
                      error={errors.secondLastName?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="gender"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.genderContainer}>
                      <Text style={[styles.label, { color: c.textPrimary }]}>Género</Text>
                      <View style={styles.genderCards}>
                        <TouchableOpacity
                          style={[
                            styles.genderCard,
                            { borderColor: c.border, backgroundColor: "#FFF" },
                            value === "M" && {
                              backgroundColor: c.primary + "15",
                              borderColor: c.primary,
                              borderWidth: 2,
                            },
                          ]}
                          onPress={() => onChange("M")}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.iconContainer, { backgroundColor: value === "M" ? c.primary : c.border + "30" }]}>
                            <Ionicons name="male" size={18} color={value === "M" ? "#FFF" : c.textSecondary} />
                          </View>
                          <Text style={[styles.genderCardText, { color: value === "M" ? c.primary : c.textPrimary }]}>Masculino</Text>
                          {value === "M" && <Ionicons name="checkmark-circle" size={16} color={c.primary} style={styles.checkmark} />}
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.genderCard,
                            { borderColor: c.border, backgroundColor: "#FFF" },
                            value === "F" && {
                              backgroundColor: c.primary + "15",
                              borderColor: c.primary,
                              borderWidth: 2,
                            },
                          ]}
                          onPress={() => onChange("F")}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.iconContainer, { backgroundColor: value === "F" ? c.primary : c.border + "30" }]}>
                            <Ionicons name="female" size={18} color={value === "F" ? "#FFF" : c.textSecondary} />
                          </View>
                          <Text style={[styles.genderCardText, { color: value === "F" ? c.primary : c.textPrimary }]}>Femenino</Text>
                          {value === "F" && <Ionicons name="checkmark-circle" size={16} color={c.primary} style={styles.checkmark} />}
                        </TouchableOpacity>
                      </View>
                      {errors.gender && <Text style={styles.errorText}>{errors.gender.message}</Text>}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="dateOfBirth"
                  render={({ field: { onChange, value } }) => (
                    <DatePickerInput
                      label="Fecha de nacimiento"
                      placeholder="DD/MM/YYYY"
                      value={value}
                      onChange={onChange}
                      error={errors.dateOfBirth?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="ci"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Cédula de Identidad"
                      placeholder="CI (Cédula de Identidad)"
                      placeholderTextColor={c.textSecondary}
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      accessibilityLabel="Cédula de Identidad"
                      error={errors.ci?.message}
                      leftIcon={<Ionicons name="card-outline" size={20} color={c.textSecondary} />}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="department"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.inputContainer}>
                      <TouchableOpacity
                        style={[
                          styles.input,
                          {
                            backgroundColor: c.surface,
                            borderColor: errors.department ? "#FF6B6B" : c.border,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingVertical: 16,
                            paddingHorizontal: 16,
                          },
                        ]}
                        onPress={() => departmentSheetRef.current?.show()}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                          <Ionicons name="map-outline" size={20} color={c.textSecondary} style={{ marginRight: 10 }} />
                          <Text
                            style={{
                              fontSize: 16,
                              color: value ? c.textPrimary : c.textSecondary,
                              flex: 1,
                            }}
                          >
                            {value || "Selecciona tu departamento"}
                          </Text>
                        </View>
                        <Ionicons name="chevron-down" size={20} color={c.textSecondary} />
                      </TouchableOpacity>
                      {errors.department && <Text style={styles.errorText}>{errors.department.message}</Text>}
                    </View>
                  )}
                />
                <Controller
                  control={control}
                  name="address"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Dirección"
                      placeholder="Dirección"
                      placeholderTextColor={c.textSecondary}
                      value={value}
                      onChangeText={onChange}
                      accessibilityLabel="Dirección"
                      error={errors.address?.message}
                      leftIcon={<Ionicons name="location-outline" size={20} color={c.textSecondary} />}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Email"
                      placeholder="Correo electrónico"
                      placeholderTextColor={c.textSecondary}
                      value={value}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      accessibilityLabel="Correo electrónico"
                      error={errors.email?.message}
                      leftIcon={<Ionicons name="mail-outline" size={20} color={c.textSecondary} />}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Teléfono"
                      placeholder="Teléfono"
                      placeholderTextColor={c.textSecondary}
                      value={value}
                      onChangeText={onChange}
                      keyboardType="phone-pad"
                      accessibilityLabel="Teléfono"
                      error={errors.phone?.message}
                      leftIcon={<Ionicons name="call-outline" size={20} color={c.textSecondary} />}
                    />
                  )}
                />
              </>
            )}

            {/* Step 2: Email Verification */}
            {step === 2 && (
              <>
                <View style={styles.emailInfoContainer}>
                  <Ionicons name="mail" size={20} color={c.primary} />
                  <Text style={[styles.infoText, { color: c.textPrimary }]}>Código enviado a</Text>
                </View>
                <Text style={[styles.emailText, { color: c.primary }]}>{watch("email")}</Text>
                <Text style={[styles.instructionText, { color: c.textSecondary }]}>Ingresa el código de 6 dígitos</Text>

                <Controller
                  control={control}
                  name="verificationCode"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <OTPInput length={6} value={value || ""} onChangeText={onChange} error={errors.verificationCode?.message} />
                      {errors.verificationCode && <Text style={styles.errorTextCode}>{errors.verificationCode.message}</Text>}
                    </>
                  )}
                />

                <TouchableOpacity
                  onPress={async () => {
                    setIsLoading(true);
                    const codeSent = await sendVerificationCode(watch("email"));
                    setIsLoading(false);
                    if (codeSent) {
                      Alert.alert("Éxito", "Código reenviado.");
                    } else {
                      Alert.alert("Error", "No se pudo reenviar el código.");
                    }
                  }}
                  disabled={isLoading}
                  style={styles.resendButton}
                >
                  <Ionicons name="refresh" size={16} color={isLoading ? c.textSecondary : c.primary} />
                  <Text style={[styles.resendText, { color: isLoading ? c.textSecondary : c.primary }]}>
                    {isLoading ? "Enviando..." : "Reenviar código"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Step 3: Password Creation */}
            {step === 3 && (
              <>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.inputContainer}>
                      <TextInput
                        label="Contraseña"
                        placeholder="Contraseña"
                        placeholderTextColor={c.textSecondary}
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={!showPassword}
                        accessibilityLabel="Contraseña"
                        error={errors.password?.message}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleIcon}>
                        <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color={c.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  )}
                />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.inputContainer}>
                      <TextInput
                        label="Confirmar contraseña"
                        placeholder="Confirmar contraseña"
                        placeholderTextColor={c.textSecondary}
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={!showConfirmPassword}
                        accessibilityLabel="Confirmar contraseña"
                        error={errors.confirmPassword?.message}
                      />
                      <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.toggleIcon}>
                        <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={20} color={c.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </>
            )}

            {/* Step 4: Clinic Selection (Optional) */}
            {step === 4 && (
              <>
                {/* Buscador */}
                <View style={styles.searchContainer}>
                  <TextInput
                    placeholder="Buscar tu clinica ideal"
                    placeholderTextColor={c.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                    accessibilityLabel="Buscar clínica"
                    leftIcon={<Ionicons name="search" size={20} color={c.textSecondary} style={styles.searchIcon} />}
                  />
                  <TouchableOpacity onPress={() => clinicSheetRef.current?.show()} style={styles.filterButton}>
                    <Ionicons name="options-outline" size={24} color={c.primary} />
                  </TouchableOpacity>
                </View>

                {/* Filtros aplicados */}
                {(selectedCity || searchQuery || selectedSpecialty) && (
                  <View style={styles.activeFiltersContainer}>
                    <Text style={[styles.activeFiltersLabel, { color: c.textSecondary }]}>Filtros:</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.activeFiltersScroll}
                      style={styles.activeFiltersRow}
                    >
                      {selectedCity && (
                        <View style={[styles.activeFilterChip, { backgroundColor: c.primary + "15", borderColor: c.primary }]}>
                          <Ionicons name="location-outline" size={14} color={c.primary} />
                          <Text style={[styles.activeFilterText, { color: c.primary }]} numberOfLines={1}>
                            {selectedCity}
                          </Text>
                          <TouchableOpacity onPress={() => setSelectedCity("")} style={styles.removeFilterButton}>
                            <Ionicons name="close-circle" size={16} color={c.primary} />
                          </TouchableOpacity>
                        </View>
                      )}
                      {selectedSpecialty && (
                        <View style={[styles.activeFilterChip, { backgroundColor: c.primary + "15", borderColor: c.primary }]}>
                          <Ionicons name="medical-outline" size={14} color={c.primary} />
                          <Text style={[styles.activeFilterText, { color: c.primary }]} numberOfLines={1}>
                            {selectedSpecialty}
                          </Text>
                          <TouchableOpacity onPress={() => setSelectedSpecialty("")} style={styles.removeFilterButton}>
                            <Ionicons name="close-circle" size={16} color={c.primary} />
                          </TouchableOpacity>
                        </View>
                      )}
                      {searchQuery && (
                        <View style={[styles.activeFilterChip, { backgroundColor: c.primary + "15", borderColor: c.primary }]}>
                          <Ionicons name="search" size={14} color={c.primary} />
                          <Text style={[styles.activeFilterText, { color: c.primary }]} numberOfLines={1}>
                            "{searchQuery}"
                          </Text>
                          <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.removeFilterButton}>
                            <Ionicons name="close-circle" size={16} color={c.primary} />
                          </TouchableOpacity>
                        </View>
                      )}

                      {/* Botón para limpiar todos los filtros */}
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedCity("");
                          setSearchQuery("");
                          setSelectedSpecialty("");
                        }}
                        style={[styles.clearAllFiltersButton, { borderColor: c.textSecondary }]}
                      >
                        <Text style={[styles.clearAllFiltersText, { color: c.textSecondary }]}>Limpiar todo</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                )}

                <Controller
                  control={control}
                  name="clinic"
                  render={({ field: { onChange, value } }) => (
                    <>
                      {/* Mensaje contextual cuando no hay búsqueda activa */}
                      {!shouldShowClinics && !watch("clinic") && (
                        <View style={styles.searchPromptContainer}>
                          <Image source={dentist} style={{ width: 140, height: 140 }} />
                          <Text style={[styles.searchPromptTitle, { color: c.textPrimary }]}>Únete a tu clínica dental</Text>
                          <Text style={[styles.searchPromptText, { color: c.textSecondary }]}>
                            Regístrate en la clínica donde recibes atención y accede a todos tus servicios desde aquí
                          </Text>
                        </View>
                      )}

                      {/* Clínica seleccionada */}
                      {!shouldShowClinics && watch("clinic") && (
                        <View style={styles.selectedClinicContainer}>
                          <View style={[styles.selectedClinicBadge, { backgroundColor: c.primary + "15", borderColor: c.primary }]}>
                            {/* <Ionicons name="checkmark-circle" size={20} color={c.primary} /> */}
                            <Text style={[styles.selectedClinicText, { color: c.primary }]}>Clínica seleccionada</Text>
                          </View>
                          {(() => {
                            const selectedClinic = clinics.find((c) => c.id === watch("clinic"));
                            return selectedClinic ? (
                              <View style={styles.clinicSummary}>
                                <Text style={[styles.clinicSummaryName, { color: c.textPrimary }]}>{selectedClinic.name}</Text>
                                <View style={styles.clinicSummaryDetails}>
                                  <Ionicons name="location-outline" size={14} color={c.textSecondary} />
                                  <Text style={[styles.clinicSummaryText, { color: c.textSecondary }]}>
                                    {selectedClinic.department?.name || "Sin departamento"}
                                  </Text>
                                </View>
                                {selectedClinic.specialities && selectedClinic.specialities.length > 0 && (
                                  <View style={styles.clinicSummaryDetails}>
                                    <Ionicons name="medical-outline" size={14} color={c.textSecondary} />
                                    <Text style={[styles.clinicSummaryText, { color: c.textSecondary }]} numberOfLines={2}>
                                      {selectedClinic.specialities.map((spec) => spec.name).join(", ")}
                                    </Text>
                                  </View>
                                )}
                                <TouchableOpacity onPress={() => onChange(undefined)} style={styles.changeClinicButton}>
                                  <Text style={[styles.changeClinicText, { color: c.primary }]}>Cambiar clínica</Text>
                                </TouchableOpacity>
                              </View>
                            ) : null;
                          })()}
                        </View>
                      )}

                      {/* Lista de clínicas (solo cuando hay búsqueda o filtros) */}
                      {shouldShowClinics && (
                        <View style={styles.clinicList}>
                          {filteredClinics.length > 0 ? (
                            filteredClinics.map((item) => (
                              <TouchableOpacity
                                key={item.id}
                                style={[
                                  styles.clinicItemContainer,
                                  { borderBottomColor: c.border },
                                  value === item.id && { backgroundColor: c.primary + "10" },
                                ]}
                                onPress={() => {
                                  onChange(item.id);
                                }}
                                accessibilityLabel={item.name}
                              >
                                <View style={styles.clinicItem}>
                                  <View style={styles.clinicInfo}>
                                    <Text style={[styles.clinicName, { color: c.textPrimary }]}>{item.name}</Text>
                                    {item.department?.name && (
                                      <>
                                        <View style={styles.clinicDetail}>
                                          <Ionicons name="location-outline" size={14} color={c.textSecondary} />
                                          <Text style={[styles.clinicDetailText, { color: c.textSecondary }]}>{item.department.name}</Text>
                                        </View>
                                        {item.address && <Text style={[styles.clinicAddress, { color: c.textSecondary }]}>{item.address}</Text>}
                                        {item.phone && (
                                          <View style={styles.clinicDetail}>
                                            <Ionicons name="call-outline" size={14} color={c.textSecondary} />
                                            <Text style={[styles.clinicDetailText, { color: c.textSecondary }]}>{item.phone}</Text>
                                          </View>
                                        )}
                                        {item.specialities && item.specialities.length > 0 && (
                                          <View style={styles.clinicDetail}>
                                            <Ionicons name="medical-outline" size={14} color={c.textSecondary} />
                                            <Text style={[styles.clinicDetailText, { color: c.textSecondary }]} numberOfLines={2}>
                                              {item.specialities.map((spec) => spec.name).join(", ")}
                                            </Text>
                                          </View>
                                        )}
                                      </>
                                    )}
                                  </View>

                                  {value === item.id && <Ionicons name="checkmark-circle" size={24} color={c.primary} />}
                                </View>
                              </TouchableOpacity>
                            ))
                          ) : (
                            <View style={styles.emptyState}>
                              <Ionicons name="search" size={48} color={c.textSecondary} />
                              <Text style={[styles.emptyText, { color: c.textSecondary }]}>No se encontraron clínicas</Text>
                              <Text style={[styles.emptySubtext, { color: c.textSecondary }]}>Intenta con otros términos de búsqueda</Text>
                            </View>
                          )}
                        </View>
                      )}

                      {errors.clinic && <Text style={styles.errorText}>{errors.clinic.message}</Text>}

                      {/* ActionSheet para filtros */}
                      <ActionSheet
                        ref={clinicSheetRef}
                        gestureEnabled
                        defaultOverlayOpacity={0.3}
                        closable={true}
                        closeOnTouchBackdrop={true}
                        containerStyle={{
                          backgroundColor: "#FFF",
                          borderTopLeftRadius: 16,
                          borderTopRightRadius: 16,
                          maxHeight: "80%",
                        }}
                      >
                        <View>
                          {/* Header del Sheet */}
                          <View style={styles.sheetHeader}>
                            <Text style={[styles.sheetTitle, { color: c.textPrimary }]}>Filtros</Text>
                            <TouchableOpacity onPress={() => clinicSheetRef.current?.hide()} style={styles.closeButton}>
                              <Ionicons name="close" size={24} color={c.textSecondary} />
                            </TouchableOpacity>
                          </View>

                          {/* Opciones de filtro */}
                          <ScrollView
                            style={styles.filterOptions}
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                            keyboardShouldPersistTaps="handled"
                          >
                            {/* Filtro por especialidad - DESHABILITADO */}
                            {/* <View style={styles.filterSection}>
                                                            <Text style={[styles.filterSectionTitle, { color: c.textPrimary }]}>
                                                                Especialidad odontológica
                                                            </Text>

                                                            <View style={styles.filterChipsContainer}>
                                                                <TouchableOpacity
                                                                    style={[
                                                                        styles.cityFilterChip,
                                                                        { borderColor: c.border },
                                                                        !selectedSpecialty && { backgroundColor: c.primary, borderColor: c.primary }
                                                                    ]}
                                                                    onPress={() => setSelectedSpecialty("")}
                                                                >
                                                                    <Text style={[
                                                                        styles.cityFilterText,
                                                                        { color: !selectedSpecialty ? "#FFF" : c.textSecondary }
                                                                    ]}>
                                                                        Todo
                                                                    </Text>
                                                                </TouchableOpacity>
                                                                {specialties.map((specialty) => (
                                                                    <TouchableOpacity
                                                                        key={specialty.id}
                                                                        style={[
                                                                            styles.cityFilterChip,
                                                                            { borderColor: c.border },
                                                                            selectedSpecialty === specialty.name && { backgroundColor: c.primary, borderColor: c.primary }
                                                                        ]}
                                                                        onPress={() => setSelectedSpecialty(selectedSpecialty === specialty.name ? "" : specialty.name)}
                                                                    >
                                                                        <Text style={[
                                                                            styles.cityFilterText,
                                                                            { color: selectedSpecialty === specialty.name ? "#FFF" : c.textSecondary }
                                                                        ]}>
                                                                            {specialty.name}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                ))}
                                                            </View>
                                                        </View> */}

                            {/* Filtro por departamento */}
                            <View style={styles.filterSection}>
                              <Text style={[styles.filterSectionTitle, { color: c.textPrimary }]}>Departamento</Text>

                              <View style={styles.filterChipsContainer}>
                                <TouchableOpacity
                                  style={[
                                    styles.cityFilterChip,
                                    { borderColor: c.border },
                                    !selectedCity && { backgroundColor: c.primary, borderColor: c.primary },
                                  ]}
                                  onPress={() => setSelectedCity("")}
                                >
                                  <Text style={[styles.cityFilterText, { color: !selectedCity ? "#FFF" : c.textSecondary }]}>Todos</Text>
                                </TouchableOpacity>
                                {departments.map((department) => (
                                  <TouchableOpacity
                                    key={department.id}
                                    style={[
                                      styles.cityFilterChip,
                                      { borderColor: c.border },
                                      selectedCity === department.name && { backgroundColor: c.primary, borderColor: c.primary },
                                    ]}
                                    onPress={() => setSelectedCity(selectedCity === department.name ? "" : department.name)}
                                  >
                                    <Text style={[styles.cityFilterText, { color: selectedCity === department.name ? "#FFF" : c.textSecondary }]}>
                                      {department.name}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            </View>
                          </ScrollView>

                          <View
                            style={{
                              flexDirection: "row",
                              gap: 12,
                              paddingHorizontal: 16,
                              paddingTop: 8,
                              paddingBottom: insets.bottom + 12, // respeta área segura
                              borderTopWidth: 1,
                              borderTopColor: c.border,
                              backgroundColor: "#FFF",
                            }}
                          >
                            <TouchableOpacity
                              style={[styles.filterActionButton, { backgroundColor: "#F3F4F6", flex: 1 }]}
                              onPress={() => {
                                setSelectedCity("");
                                setSelectedSpecialty("");
                                setSearchQuery("");
                              }}
                            >
                              <Text style={[styles.filterActionText, { color: c.textPrimary }]}>Limpiar filtros</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[styles.filterActionButton, { backgroundColor: c.primary, flex: 1 }]}
                              onPress={() => clinicSheetRef.current?.hide()}
                            >
                              <Text style={[styles.filterActionText, { color: "#FFF" }]}>Aplicar</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </ActionSheet>
                    </>
                  )}
                />
              </>
            )}

            {/* ActionSheet para seleccionar departamento */}
            <ActionSheet
              ref={departmentSheetRef}
              containerStyle={{
                backgroundColor: c.surface,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
              gestureEnabled={true}
              defaultOverlayOpacity={0.3}
            >
              <View style={{ padding: 20 }}>
                <View style={[styles.sheetHeader, { borderBottomColor: c.border }]}>
                  <Text style={[styles.sheetTitle, { color: c.textPrimary }]}>Selecciona tu departamento</Text>
                  <TouchableOpacity onPress={() => departmentSheetRef.current?.hide()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={c.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
                  <View style={styles.filterSection}>
                    <View style={styles.filterChipsContainer}>
                      {departments.map((dept) => (
                        <TouchableOpacity
                          key={dept.id}
                          style={[
                            styles.cityFilterChip,
                            { borderColor: c.border, backgroundColor: "#FFF" },
                            department === dept.name && { backgroundColor: c.primary, borderColor: c.primary },
                          ]}
                          onPress={() => {
                            setValue("department", dept.name);
                            setValue("departmentId", dept.id.toString());
                            departmentSheetRef.current?.hide();
                          }}
                        >
                          <Ionicons
                            name="location"
                            size={16}
                            color={department === dept.name ? "#FFF" : c.textSecondary}
                            style={{ marginRight: 8 }}
                          />
                          <Text style={[styles.cityFilterText, { color: department === dept.name ? "#FFF" : c.textSecondary }]}>{dept.name}</Text>
                          {department === dept.name && <Ionicons name="checkmark-circle" size={16} color="#FFF" style={{ marginLeft: 8 }} />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </ActionSheet>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
              {step > 1 && <Button title="Atrás" onPress={handleBack} variant="outline" style={{ flex: 1, marginRight: 8 }} />}
              <Button title={step === 4 ? "Finalizar" : "Siguiente"} onPress={handleNext} variant="primary" style={{ flex: 1 }} loading={isLoading} />
            </View>

            {/* Separator and Social Logins (Step 1 only) */}
            {/* {step === 1 && (
                            <>
                                <View style={styles.separator}>
                                    <View style={[styles.line, { backgroundColor: c.border }]} />
                                    <Text style={[styles.separatorText, { color: c.textSecondary }]}>
                                        o entra con
                                    </Text>
                                    <View style={[styles.line, { backgroundColor: c.border }]} />
                                </View>
                            </>
                        )} */}

            {/* Login Link */}
            <TouchableOpacity style={{ marginBottom: 36 }} onPress={() => router.replace("/(Auth)/LoginScreen")}>
              <Text style={[styles.link, { color: c.primary }]}>¿Ya tienes una cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          </Animated.View>

          <ModalMessage
            visible={modal.visible}
            title={modal.title}
            message={modal.message}
            variant={modal.variant}
            primaryText={modal.primaryText}
            onPrimary={hideModal}
            onRequestClose={hideModal}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 10,
  },
  container: {
    alignItems: "center",
  },

  input: {
    width: "100%",
    maxWidth: 320,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 320,
    marginVertical: 4,
  },
  toggleIcon: {
    position: "absolute",
    right: 15,
    top: 50,
  },
  genderContainer: {
    width: "100%",
    maxWidth: 320,
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  genderCards: {
    flexDirection: "row",
    gap: 8,
  },
  genderCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    position: "relative",
    minHeight: 48,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  genderCardText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  checkmark: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 3,
    marginBottom: 8,
    width: "100%",
    maxWidth: 320,
    paddingLeft: 4,
  },
  // infoText: {
  //     fontSize: 16,
  //     textAlign: "center",
  //     marginVertical: 8,
  // },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    maxWidth: 320,
    marginTop: 16,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  link: {
    marginTop: 16,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  //para el titulo
  headerSection: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },

  //para la verificacion de Codigo

  emailInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emailText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
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
  errorTextCode: {
    color: "#EF4444",
    fontSize: 12,
    textAlign: "center",
    marginTop: -8,
    marginBottom: 8,
  },

  //para el search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 280,
    //marginVertical: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
  },
  clearButton: {
    padding: 4,
  },
  filterIcon: {
    position: "absolute",
    right: 10,
    padding: 8,
  },

  // Estilos para el ActionSheet
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },

  // Estilos para los items de clínica
  clinicItemContainer: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  clinicItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  clinicInfo: {
    flex: 1,
    marginRight: 12,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  clinicDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  clinicDetailText: {
    fontSize: 14,
    marginLeft: 4,
  },
  clinicAddress: {
    fontSize: 13,
    marginTop: 2,
    marginLeft: 18,
  },

  // Estado vacío
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },

  // Filtros por ciudad
  cityFilterContainer: {
    width: "100%",
    maxWidth: 320,
    marginVertical: 8,
  },
  cityFilterScroll: {
    paddingRight: 16,
  },
  cityFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    backgroundColor: "#FFF",
  },
  cityFilterText: {
    fontSize: 14,
    fontWeight: "500",
  },

  // Botón de filtro
  filterButton: {
    padding: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  // Lista de clínicas
  clinicList: {
    width: "100%",
    maxWidth: 320,
    marginTop: 16,
  },

  // Opciones de filtro en el ActionSheet
  filterOptions: {
    padding: 16,
    // maxHeight: 400,
  },
  filterSection: {
    marginVertical: 12,
  },
  filterChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "flex-start",
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  horizontalFilter: {
    marginBottom: 20,
  },
  filterActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  filterActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  filterActionText: {
    fontSize: 16,
    fontWeight: "600",
  },

  // Filtros activos
  activeFiltersContainer: {
    width: "100%",
    maxWidth: 340,
    //marginVertical: 0,
    //padding: 5,
    //backgroundColor: "#F8F9FA",
    //borderRadius: 8,
  },
  activeFiltersLabel: {
    fontSize: 12,
    fontWeight: "500",
    //marginBottom: 0,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  activeFiltersRow: {
    marginTop: 8,
  },
  activeFiltersScroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 16,
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: 120,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
    marginRight: 4,
    flex: 1,
  },
  removeFilterButton: {
    padding: 2,
  },
  clearAllFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "#FFF",
  },
  clearAllFiltersText: {
    fontSize: 12,
    fontWeight: "500",
  },
  searchPromptContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  searchPromptTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  searchPromptText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  searchPromptButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
  },
  searchPromptButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectedClinicContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderRadius: 12,
    marginHorizontal: 16,
  },
  selectedClinicBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    marginBottom: 12,
  },
  selectedClinicText: {
    fontSize: 12,
    fontWeight: "600",
  },
  clinicSummary: {
    gap: 8,
  },
  clinicSummaryName: {
    fontSize: 16,
    fontWeight: "600",
  },
  clinicSummaryDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clinicSummaryText: {
    fontSize: 14,
  },
  changeClinicButton: {
    alignSelf: "flex-start",
    marginTop: 8,
  },
  changeClinicText: {
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
});

export default RegisterScreen;
