import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Вход
export async function loginUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

// Регистрация
export async function registerUser(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

// Выход
export async function logoutUser() {
  return await signOut(auth);
}

// Отслеживание авторизации
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}
