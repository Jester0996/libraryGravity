// import { useState, useEffect } from "react";
// import { fetchBooks } from "../api/booksApi"; // работа с Firestore
// import { Roles } from "../constants/roles"; // enum ролей

// export default function BooksList({ userRole }) {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadBooks = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const allBooks = await fetchBooks(); // получаем все книги

//         const filteredBooks = allBooks.filter((book) => {
//           const access = book.access || [];

//           // Книги без ограничений видны всем
//           if (access.length === 0) return true;

//           // Админ видит все книги
//           if (userRole === Roles.Admin) return true;

//           // Пользователь видит книги по своей роли
//           if (userRole && access.includes(userRole)) return true;

//           // Гость не видит книги с ограничением
//           return false;
//         });

//         setBooks(filteredBooks);
//       } catch (err) {
//         console.error("Ошибка при загрузке книг:", err);
//         setError("Не удалось загрузить книги. Попробуйте позже.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadBooks();
//   }, [userRole]);

//   if (loading) {
//     return (
//       <p className="text-center text-gray-500 text-lg mt-6">Загрузка книг...</p>
//     );
//   }

//   if (error) {
//     return <p className="text-center text-red-500 text-lg mt-6">{error}</p>;
//   }

//   if (books.length === 0) {
//     return (
//       <p className="text-center text-gray-500 text-lg mt-6">Книг пока нет.</p>
//     );
//   }

//   return (
//     <div className="mt-6">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">Список книг</h2>

//       {!userRole && (
//         <p className="text-gray-500 mb-4">
//           Войдите, чтобы видеть книги с ограниченным доступом.
//         </p>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {books.map((book) => (
//           <div
//             key={book.id}
//             className="bg-white rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-5 flex flex-col justify-between"
//           >
//             <div>
//               <h3 className="text-xl font-semibold text-blue-600 mb-1">
//                 {book.title || "Без названия"}
//               </h3>
//               <p className="text-gray-700 mb-2">
//                 {book.author || "Автор неизвестен"}
//               </p>
//               <p className="text-gray-600">{book.description || ""}</p>
//             </div>

//             {book.access && book.access.length > 0 && (
//               <span className="mt-3 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
//                 Только для: {book.access.join(", ")}
//               </span>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Card, TextInput, Table } from "@gravity-ui/uikit";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Roles } from "../constants/roles";

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooksAndRole = async () => {
      try {
        // Получаем книги
        const booksSnapshot = await getDocs(collection(db, "books"));
        const allBooks = booksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Получаем роль текущего пользователя
        let role = null;
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            role = userDoc.data().role || null;
          }
        }

        setUserRole(role);

        // Фильтруем книги сразу по роли
        const filteredBooks = allBooks.filter((book) => {
          const access = book.access || [];
          if (access.length === 0) return true; // для всех
          if (role === Roles.Admin) return true; // админ видит все
          if (role && access.includes(role)) return true; // доступ по роли
          return false; // гость не видит
        });

        setBooks(filteredBooks);
      } catch (err) {
        console.error("Ошибка загрузки книг:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksAndRole();
  }, []);

  // Фильтрация по поиску
  const filteredBySearch = books.filter((book) =>
    book.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p style={{ textAlign: "center" }}>Загрузка книг...</p>;
  if (filteredBySearch.length === 0)
    return <p style={{ textAlign: "center" }}>Книг пока нет.</p>;

  return (
    <div style={{ padding: 20 }}>
      <Card style={{ padding: 20 }}>
        <h2 style={{ marginBottom: 20 }}>Список книг</h2>

        <TextInput
          value={search}
          onUpdate={setSearch}
          placeholder="Поиск книги..."
          style={{ marginBottom: 20, width: "100%" }}
        />

        <Table
          data={filteredBySearch.map((book) => ({
            id: book.id,
            title: book.title || "Без названия",
            author: book.author || "Автор неизвестен",
            description: book.description || "Описание отсутствует",
          }))}
          columns={[
            { id: "title", name: "Название" },
            { id: "author", name: "Автор" },
            { id: "description", name: "Описание" },
          ]}
        />
      </Card>
    </div>
  );
}
