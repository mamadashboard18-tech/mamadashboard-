import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const REMEMBER_ME_KEY = "mama_remember_me";

// Controla si la sesión sobrevive a cerrar el navegador (localStorage) o no
// (sessionStorage). Por defecto se recuerda, salvo que el usuario haya
// destildado "Recordarme" explícitamente la última vez que inició sesión.
export function setRememberMe(remember) {
  try {
    localStorage.setItem(REMEMBER_ME_KEY, remember ? "1" : "0");
  } catch {
    // localStorage no disponible (modo privado, etc.) — no bloquea el login
  }
}

function shouldRemember() {
  try {
    const value = localStorage.getItem(REMEMBER_ME_KEY);
    return value === null ? true : value === "1";
  } catch {
    return true;
  }
}

const hybridStorage = {
  getItem: (key) => {
    try {
      return (shouldRemember() ? localStorage : sessionStorage).getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      (shouldRemember() ? localStorage : sessionStorage).setItem(key, value);
    } catch {
      // noop
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch {
      // noop
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { storage: hybridStorage },
});
