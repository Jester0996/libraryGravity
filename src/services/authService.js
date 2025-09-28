import * as authApi from "../api/authApi";

/**
 * Вход пользователя
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
  return await authApi.loginUser(email, password);
}

/**
 * Регистрация пользователя
 * @param {string} email
 * @param {string} password
 */
export async function register(email, password) {
  return await authApi.registerUser(email, password);
}

/**
 * Выход пользователя
 */
export async function logout() {
  return await authApi.logoutUser();
}

/**
 * Подписка на изменения авторизации
 * @param {function} callback
 * @returns {function} unsubscribe
 */
export function subscribeAuth(callback) {
  return authApi.subscribeToAuthChanges(callback);
}
