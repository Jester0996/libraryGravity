export function getErrorMessage(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Этот email уже зарегистрирован";
    case "auth/weak-password":
      return "Пароль слишком простой";
    case "auth/invalid-email":
      return "Некорректный email";
    case "auth/user-not-found":
      return "Пользователь не найден";
    case "auth/wrong-password":
      return "Неверный пароль";
    case "permission-denied":
      return "Нет прав доступа";
    default:
      return "Произошла ошибка. Попробуйте снова.";
  }
}
