// src/api/booksApi.js
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

// Получение всех книг из Firestore
export async function fetchBooks() {
  const booksSnap = await getDocs(collection(db, "books"));
  return booksSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Добавление новой книги
export async function addBook(book) {
  await addDoc(collection(db, "books"), book);
}
