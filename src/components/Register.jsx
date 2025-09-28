// import { useState } from "react";
// import { auth, db } from "../firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { getErrorMessage } from "../utils/errors";

// // Компонент формы регистрации
// export default function Register() {
//   // Локальное состояние для хранения значений формы
//   const [email, setEmail] = useState(""); // email пользователя
//   const [password, setPassword] = useState(""); // пароль пользователя
//   const [role, setRole] = useState("User"); // Роль по умолчанию - "User"
//   const [error, setError] = useState(null); // для хранения ошибок

//   // Обработчик события регистрации
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       // 1. Создаем пользователя в Firebase Authentication
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       // 2. Сохраняем данные о пользователе в Firestore
//       await setDoc(doc(db, "users", user.uid), { email, role });

//       // 3. Очищаем форму
//       setEmail("");
//       setPassword("");
//       setRole("User");

//       alert("Пользователь зарегистрирован!");
//     } catch (err) {
//       console.error(err);
//       // ✅ теперь ошибки будут переведены
//       setError(getErrorMessage(err.code));
//     }
//   };

//   // Разметка формы регистрации
//   return (
//     <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition mt-6">
//       <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
//         Регистрация
//       </h2>
//       <form className="space-y-4" onSubmit={handleRegister}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//         />
//         <select
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//         >
//           <option value="User">Пользователь</option>
//           <option value="Admin">Администратор</option>
//         </select>
//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
//         >
//           Зарегистрироваться
//         </button>
//       </form>
//       {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
//     </div>
//   );
// }

// import { useState } from "react";
// import { register } from "../services/authService";

// export default function Register() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       await register(email, password);
//     } catch (err) {
//       console.error(err);
//       setError("Ошибка регистрации. Попробуйте снова.");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleRegister}
//       className="max-w-sm mx-auto bg-white p-6 rounded shadow space-y-4"
//     >
//       <h2 className="text-lg font-bold">Регистрация</h2>
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
//         className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
//       >
//         Зарегистрироваться
//       </button>
//     </form>
//   );
// }
import React, { useState } from "react";
import { TextInput, PasswordInput, Button, Card } from "@gravity-ui/uikit";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        role: "User",
        createdAt: new Date().toISOString(),
      });

      alert("Регистрация прошла успешно!");
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
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Регистрация</h2>

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

        <PasswordInput
          value={confirm}
          onUpdate={setConfirm}
          placeholder="Подтверждение пароля"
          style={{ marginBottom: 15 }}
        />

        {error && <p style={{ color: "red", fontSize: 20 }}>{error}</p>}

        <Button
          view="action"
          size="l"
          width="max"
          onClick={handleRegister}
          loading={loading}
        >
          Зарегистрироваться
        </Button>
      </Card>
    </div>
  );
}
