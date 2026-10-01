type AuthExpiredListener = () => void;

let authExpiredListener: AuthExpiredListener | null = null;

export function setAuthExpiredListener(listener: AuthExpiredListener | null) {
  authExpiredListener = listener;
}

export function notifyAuthExpired() {
  authExpiredListener?.();
}
