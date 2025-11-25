// components/DatePickerInput.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useSemanticColors } from '@/hooks/useSemanticColors';

interface DatePickerInputProps {
    label?: string;
    value: string; // formato "DD/MM/YYYY"
    onChange: (date: string) => void;
    error?: string;
    placeholder?: string;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
    label,
    value,
    onChange,
    error,
    placeholder = 'Selecciona una fecha',
}) => {
    const c = useSemanticColors();
    const [show, setShow] = useState(false);
    const [tempDate, setTempDate] = useState(
        value ? new Date(value.split("/").reverse().join("-")) : new Date()
    );

    const handleIOSConfirm = () => {
        onChange(tempDate.toLocaleDateString("es-ES"));
        setShow(false);
    };

    const handleAndroidChange = (event: any, date?: Date) => {
        setShow(false);
        if (date && event.type === 'set') {
            onChange(date.toLocaleDateString("es-ES"));
        }
    };

    return (
        <View style={styles.container}>
            {label && (
                <Text style={[styles.label, { color: c.textPrimary }]}>
                    {label}
                </Text>
            )}

            <TouchableOpacity
                style={[
                    styles.input,
                    {
                        borderColor: error ? '#EF4444' : c.border,
                        backgroundColor: '#FFF',
                    },
                ]}
                onPress={() => setShow(true)}
                activeOpacity={0.7}
            >
                   <Ionicons name="calendar-outline" size={20} color={c.textSecondary} />
                <Text
                    style={[
                        styles.dateText,
                        { color: value ? c.textPrimary : c.textSecondary },
                    ]}
                >
                    {value || placeholder}
                </Text>
             
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Android */}
            {Platform.OS === 'android' && show && (
                <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    onChange={handleAndroidChange}
                    locale="es-ES"
                />
            )}

            {/* iOS */}
            {Platform.OS === 'ios' && show && (
                <Modal
                    visible={show}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShow(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: c.backdrop }]}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity
                                    onPress={() => setShow(false)}
                                    style={styles.modalButton}
                                >
                                    <Text style={[styles.buttonText, { color: c.textSecondary }]}>
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>
                                <Text style={[styles.modalTitle, { color: c.textPrimary }]}>
                                    {label || 'Seleccionar fecha'}
                                </Text>
                                <TouchableOpacity
                                    onPress={handleIOSConfirm}
                                    style={styles.modalButton}
                                >
                                    <Text style={[styles.buttonText, { color: c.primary }]}>
                                        Confirmar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <DateTimePicker
                                value={tempDate}
                                mode="date"
                                display="spinner"
                                onChange={(event, date) => date && setTempDate(date)}
                                textColor={c.textPrimary}
                                accentColor={c.primary}
                                themeVariant="light"
                                locale="es-ES"
                                style={styles.picker}
                            />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 320,
        marginVertical: 9,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'space-between',
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
    },
    dateText: {
        fontSize: 16,
        marginLeft:10
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
        paddingLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        minWidth: 80,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    picker: {
        height: 200,
    },
});

export default DatePickerInput;