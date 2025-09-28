// import { useState } from "react";
// import { auth } from "../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { getErrorMessage } from "../utils/errors"; // импортируем переводчик ошибок

// // Компонент формы входа
// export default function Login() {
//   const [email, setEmail] = useState(""); // email пользователя
//   const [password, setPassword] = useState(""); // пароль пользователя
//   const [error, setError] = useState(null); // ошибка (если есть)

//   // Обработчик входа
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(null); // сбрасываем старую ошибку

//     try {
//       // 1. Пытаемся авторизоваться через Firebase Authentication
//       await signInWithEmailAndPassword(auth, email, password);

//       // 2. Если успех — очищаем поля
//       setEmail("");
//       setPassword("");
//       setError(null);
//       alert("Вы успешно вошли!");
//     } catch (err) {
//       console.error(err);
//       // ✅ тут переводим код ошибки в понятное сообщение
//       setError(getErrorMessage(err.code));
//     }
//   };

//   // Разметка формы
//   return (
//     <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition mt-6">
//       <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
//         Вход
//       </h2>
//       <form className="space-y-4" onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <input
//           type="password"
//           placeholder="Пароль"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//         >
//           Войти
//         </button>
//       </form>
//       {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
//     </div>
//   );
// }

import React, { useState } from "react";
import { TextInput, PasswordInput, Button, Card } from "@gravity-ui/uikit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // только auth

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Успешный вход!"); // потом заменим на Toast
    } catch (err) {
      setError("Ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
      }}
    >
      <Card style={{ width: 350, padding: 20 }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Вход</h2>

        <TextInput
          value={email}
          onUpdate={setEmail}
          placeholder="Email"
          style={{ marginBottom: 15 }}
        />

        <PasswordInput
          value={password}
          onUpdate={setPassword}
          placeholder="Пароль"
          style={{ marginBottom: 15 }}
        />

        {error && (
          <p style={{ color: "red", fontSize: 20, marginBottom: 10 }}>
            {error}
          </p>
        )}

        <Button
          view="action"
          size="l"
          width="max"
          onClick={handleLogin}
          loading={loading}
        >
          Войти
        </Button>
      </Card>
    </div>
  );
}

// import { useState } from "react";
// import { login } from "../services/authService";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       await login(email, password);
//     } catch (err) {
//       console.error(err);
//       setError("Ошибка входа. Проверьте данные.");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleLogin}
//       className="max-w-sm mx-auto bg-white p-6 rounded shadow space-y-4"
//     >
//       <h2 className="text-lg font-bold">Вход</h2>
//       {error && <p className="text-red-500">{error}</p>}
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Email"
//         className="w-full p-2 border rounded"
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Пароль"
//         className="w-full p-2 border rounded"
//       />
//       <button
//         type="submit"
//         className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//       >
//         Войти
//       </button>
//     </form>
//   );
// }
