// import { useState, useEffect } from "react";
// import { auth, db } from "./firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// import Register from "./components/Register";
// import Login from "./components/Login";
// import BooksList from "./components/BooksList";
// import AdminPanel from "./components/AdminPanel";

// export default function App() {
//   const [user, setUser] = useState(null); // Текущий пользователь (объект Firebase User или null)
//   const [userRole, setUserRole] = useState(null); // Роль пользователя ("Admin" | "User" | null)
//   const [loading, setLoading] = useState(true); // Флаг загрузки (true — пока не знаем, кто вошёл)

//   // Отслеживание авторизации
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setUser(user);

//       if (user) {
//         try {
//           const userDoc = await getDoc(doc(db, "users", user.uid));
//           setUserRole(userDoc.data()?.role || null);
//         } catch (err) {
//           console.error("Ошибка получения роли пользователя:", err);
//           setUserRole(null);
//         }
//       } else {
//         setUserRole(null);
//       }

//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <p className="text-xl font-semibold text-gray-700">Загрузка...</p>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans">
//       <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
//         📚 Цифровая библиотека
//       </h1>

//       {!user ? (
//         <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Register />
//           <Login />
//           {/* <div className="md:col-span-2">
//             <BooksList userRole={null} />
//           </div> */}
//         </div>
//       ) : (
//         <div className="max-w-6xl mx-auto space-y-6">
//           {/* Панель приветствия и выхода */}
//           <div className="flex justify-between items-center bg-white p-4 rounded shadow-md">
//             <p className="font-semibold text-gray-800">
//               Добро пожаловать,{" "}
//               <span className="text-blue-600">{user.email}</span>!
//             </p>
//             <button
//               onClick={() => auth.signOut()}
//               className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
//             >
//               Выйти
//             </button>
//           </div>

//           {/* Список книг */}

//           {user ? (
//             <BooksList userRole={userRole} />
//           ) : (
//             <BooksList userRole={null} /> // либо не рендерить вообще
//           )}

//           {/* <BooksList userRole={userRole} /> */}
//           {/* <BooksList userRole={user ? userRole : null} /> */}

//           {/* Админ-панель */}
//           {userRole === "Admin" && <AdminPanel />}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { ThemeProvider, Button, Loader, Text } from "@gravity-ui/uikit";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import Auth from "./components/Auth";
import BooksList from "./components/BooksList";
import AdminPanel from "./components/AdminPanel";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const docSnap = await getDoc(doc(db, "users", u.uid));
        setRole(docSnap.exists() ? docSnap.data().role : null);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading)
    return (
      <ThemeProvider theme="light">
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader size="l" />
        </div>
      </ThemeProvider>
    );

  if (!user)
    return (
      <ThemeProvider theme="light">
        <Auth />
      </ThemeProvider>
    );

  return (
    <ThemeProvider theme="light">
      <div style={{ padding: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Text variant="header-1">Добро пожаловать, {user.email}</Text>
          <Button view="outlined" onClick={handleLogout}>
            Выйти
          </Button>
        </div>

        {/* Передаем роль пользователя в BooksList */}
        <BooksList userRole={role} />

        {/* Админка видна только Admin */}
        {role === "Admin" && <AdminPanel />}
      </div>
    </ThemeProvider>
  );
}

export default App;
