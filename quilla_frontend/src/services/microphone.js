import { Capacitor } from '@capacitor/core';

/**
 * Solicita permiso de micrófono al dispositivo/navegador.
 * En Android (Capacitor) dispara el diálogo nativo vía getUserMedia + WebView.
 */
export async function requestMicrophonePermission() {
    if (!navigator.mediaDevices?.getUserMedia) {
        return false;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        return true;
    } catch (error) {
        console.error('Permiso de micrófono denegado:', error);
        return false;
    }
}

export function isMicrophoneSupported() {
    if (Capacitor.isNativePlatform()) {
        return typeof navigator.mediaDevices?.getUserMedia === 'function';
    }

    return (
        typeof navigator.mediaDevices?.getUserMedia === 'function' &&
        ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    );
}
