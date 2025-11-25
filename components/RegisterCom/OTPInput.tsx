// components/OTPInput.tsx
import { useSemanticColors } from "@/hooks/useSemanticColors";
import React, { useRef, useState } from "react";
import {
    NativeSyntheticEvent,
    StyleSheet,
    TextInput,
    TextInputKeyPressEventData,
    View,
} from "react-native";

interface OTPInputProps {
    length?: number;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({
    length = 5,
    value,
    onChangeText,
    error,
}) => {
    const c = useSemanticColors();
    const inputRefs = useRef<TextInput[]>([]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // Divide el valor en array de dígitos
    const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

    const handleChange = (text: string, index: number) => {
        // Solo permite números
        if (text && !/^\d+$/.test(text)) return;

        // Si se pega más de un dígito (código completo)
        if (text.length > 1) {
            handlePaste(text);
            return;
        }

        // Toma solo el último dígito
        const digit = text.slice(-1);

        // Actualiza el valor
        const newDigits = [...digits];
        newDigits[index] = digit;
        const newValue = newDigits.join("").replace(/\s/g, "");
        onChangeText(newValue);

        // Avanza al siguiente campo si hay un dígito
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number
    ) => {
        // Si presiona backspace en campo vacío, retrocede
        if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (text: string) => {
        // Maneja pegar código completo
        const pastedDigits = text.replace(/\D/g, "").slice(0, length);
        onChangeText(pastedDigits);

        // Enfoca el último campo o el siguiente vacío
        const nextIndex = Math.min(pastedDigits.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
    };

    return (
        <View style={styles.container}>
            {digits.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => {
                        if (ref) {
                            inputRefs.current[index] = ref;
                        }
                    }}
                    style={[
                        styles.input,
                        {
                            borderColor: error
                                ? "#EF4444"
                                : focusedIndex === index
                                ? c.primary
                                : c.border,
                            backgroundColor: "#FFF",
                        },
                    ]}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    // Para pegar código, usar onChangeText en lugar de onPaste
                    // (onPaste no existe en React Native TextInput)
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        marginVertical: 16,
    },
    input: {
        width: 48,
        height: 56,
        borderWidth: 2,
        borderRadius: 12,
        textAlign: "center",
        fontSize: 24,
        fontWeight: "600",
    },
});

export default OTPInput;