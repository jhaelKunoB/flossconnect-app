import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, getErrorMessage } from '@/api/client';

// Ajusta a la respuesta REAL de tu backend
export type User = {
    id: number;
    name: string;
    email?: string;
    role?: string;
    fisrtname?: string;
    lastname?: string;
};

export type AuthResponse = {
    accessToken?: string;   // si tu API usa este nombre
    token?: string;         // o este
    user: User;
};

export async function loginEmail(params: { email: string; password: string }): Promise<AuthResponse> {
    const { data: raw } = await api.post('/dev/auth/loginEmail', {
        email: params.email.trim(),
        password: params.password,
    });

    const container = raw?.data ?? raw;

    const accessToken: string | undefined =
        container?.accessToken ?? container?.token;

    const user: User | undefined = container?.user;

    if (!accessToken || !user) {
        console.log('Login response shape:', JSON.stringify(raw, null, 2));
        throw new Error('Respuesta inválida: faltan credenciales');
    }

    return { accessToken, user };

}

export async function saveSession(auth: AuthResponse) {
    const token = auth.accessToken ?? auth.token;
    if (!token) throw new Error('La API no devolvió token');
    await AsyncStorage.multiSet([
        ['token', String(token)],
        ['user', JSON.stringify(auth.user)],
    ]);
}

export async function logout() {
    await AsyncStorage.multiRemove(['token', 'user']);
}

export async function getStoredUser(): Promise<User | null> {
    const raw = await AsyncStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
}

export async function checkEmailExists(email: string): Promise<boolean> {
    const { data: raw } = await api.post('/dev/auth/checkEmailExists', { email: email.trim() });
    return raw?.data.exists ?? false;
}
export async function sendVerificationCode(email: string): Promise<boolean> {
    try {
        const {data: res} = await api.post('/dev/auth/sendRegisterCode', { email: email.trim() });
        console.log("sendVerificationCode response:", res.data.success);
        return res.data.success === true;
    } catch (error: any) {
        console.error("Error sending verification code:", error);
        // Re-lanzar el error para que el componente pueda manejarlo
        throw error;
    }
}


export async function verifyRegisterCode(email: string, code: string): Promise<boolean> {
    try {
        const {data: res} = await api.post('/dev/auth/verifyRegisterCode', { email: email.trim(), code: code.trim() });
        console.log("verifyRegisterCode response:", res.data);
        return res.data === true;
    } catch (error: any) {
        console.error("Error verifying code:", error);
        // Re-lanzar el error para que el componente pueda manejarlo
        throw error;
    }
}



//para cambio de contrasenia
export async function sendPasswordChangeCode(email: string): Promise<{ success: boolean; message?: string }> {
    try {
        const {data: res} = await api.post('/dev/auth/sendPasswordChangeCode', { 
            email: email.trim(), 
            role: 'Paciente' 
        });
        
        return {success: res.data.success === true};
    } catch (error: any) {
        return {
            success: false,
            message: getErrorMessage(error)
        };
    }
}

export async function verifyPasswordChangeCode(email: string, code: string): Promise<{ success: boolean; message?: string }> {
    try {
        const {data: res} = await api.post('/dev/auth/verifyPasswordChangeCode', { 
            email: email.trim(), 
            code: code.trim(), 
            role: 'Paciente' 
        });
        console.log("verifyPasswordChangeCode API response:", res);
        
        return {
            success: res.success === true
        };
    } catch (error: any) {
        return {
            success: false,
            message: getErrorMessage(error)
        };
    }
}

export async function resetPassword(email: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
        const {data: res} = await api.post('/dev/auth/resetPassword', { 
            email: email.trim(), 
            newPassword: newPassword
        });
        console.log("resetPassword API response:", res);
        
        return {
            success: res.success === true
        };
    }
    catch (error: any) {
        return {
            success: false,
            message: getErrorMessage(error)
        };
    }
}   
