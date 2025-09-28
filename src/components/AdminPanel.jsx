import React, { useState } from "react";
import { Card, Button, TextInput, Checkbox } from "@gravity-ui/uikit";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Roles } from "../constants/roles";

export default function AdminPanel() {
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
    access: [],
  });

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author) {
      alert("Заполни все поля!");
      return;
    }
    try {
      await addDoc(collection(db, "books"), newBook);
      alert("Книга добавлена!");
      setNewBook({ title: "", author: "", description: "", access: [] });
    } catch (error) {
      console.error("Ошибка добавления книги:", error);
    }
  };

  const handleAccessChange = (role) => {
    setNewBook((prev) => {
      const access = prev.access.includes(role)
        ? prev.access.filter((r) => r !== role)
        : [...prev.access, role];
      return { ...prev, access };
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <Card style={{ padding: 20, marginBottom: 20 }}>
        <h2 style={{ marginBottom: 20 }}>Админ панель — Добавление книги</h2>

        <TextInput
          value={newBook.title}
          onUpdate={(val) => setNewBook({ ...newBook, title: val })}
          placeholder="Название книги"
          style={{ marginBottom: 10 }}
        />

        <TextInput
          value={newBook.author}
          onUpdate={(val) => setNewBook({ ...newBook, author: val })}
          placeholder="Автор книги"
          style={{ marginBottom: 10 }}
        />

        <TextInput
          value={newBook.description}
          onUpdate={(val) => setNewBook({ ...newBook, description: val })}
          placeholder="Описание книги"
          style={{ marginBottom: 10 }}
        />

        <div style={{ marginBottom: 15 }}>
          <b>Доступ для ролей:</b>
          {Object.values(Roles).map((role) => (
            <Checkbox
              key={role}
              checked={newBook.access.includes(role)}
              onUpdate={() => handleAccessChange(role)}
              label={role}
              style={{ marginLeft: 10 }}
            />
          ))}
        </div>

        <Button view="action" onClick={handleAddBook}>
          Добавить книгу
        </Button>
      </Card>
    </div>
  );
}

// import { useState } from "react";
// import { addBook } from "../api/booksApi"; // импортируем API для добавления книги
// import { Roles } from "../constants/roles"; // импортируем роли

// export default function AdminPanel() {
//   const [title, setTitle] = useState("");
//   const [author, setAuthor] = useState("");
//   const [description, setDescription] = useState("");
//   const [roles, setRoles] = useState([]);
//   const [error, setError] = useState("");

//   const handleRoleChange = (role) => {
//     setRoles((prev) =>
//       prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
//     );
//   };

//   const handleAddBook = async () => {
//     if (roles.length === 0) {
//       setError("Выберите хотя бы одну роль для доступа.");
//       return;
//     }

//     try {
//       await addBook({ title, author, description, access: roles });
//       setTitle("");
//       setAuthor("");
//       setDescription("");
//       setRoles([]);
//       setError("");
//     } catch (err) {
//       console.error("Ошибка при добавлении книги:", err);
//       setError("Не удалось добавить книгу.");
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">Добавить книгу</h2>

//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <input
//           placeholder="Название книги"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <input
//           placeholder="Автор"
//           value={author}
//           onChange={(e) => setAuthor(e.target.value)}
//           className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <input
//           placeholder="Описание"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2"
//         />

//         <div className="flex space-x-6 mt-4">
//           {Object.values(Roles).map((role) => (
//             <label key={role} className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={roles.includes(role)}
//                 onChange={() => handleRoleChange(role)}
//                 className="w-5 h-5"
//               />
//               <span className="text-gray-700 font-medium">{role}</span>
//             </label>
//           ))}
//         </div>

//         <button
//           onClick={handleAddBook}
//           className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
//         >
//           Добавить книгу
//         </button>
//         {error && <p className="text-red-500 mt-2">{error}</p>}
//       </div>
//     </div>
//   );
// }
