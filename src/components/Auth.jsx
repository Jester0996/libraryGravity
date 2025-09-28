import React, { useState } from "react";
import { TextInput, PasswordInput, Button, Card } from "@gravity-ui/uikit";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Roles } from "../constants/roles";

export default function Auth() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    try {
      if (tab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Вход успешен!");
      } else {
        if (password !== confirm) {
          setError("Пароли не совпадают");
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          role: Roles.User,
          createdAt: new Date().toISOString(),
        });

        alert("Регистрация успешна!");
      }
    } catch (err) {
      setError(err.message);
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
        {/* Переключение вкладок через кнопки */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: 20,
          }}
        >
          <Button
            view={tab === "login" ? "action" : "outlined"}
            onClick={() => setTab("login")}
          >
            Вход
          </Button>
          <Button
            view={tab === "register" ? "action" : "outlined"}
            onClick={() => setTab("register")}
          >
            Регистрация
          </Button>
        </div>

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
        {tab === "register" && (
          <PasswordInput
            value={confirm}
            onUpdate={setConfirm}
            placeholder="Подтверждение пароля"
            style={{ marginBottom: 15 }}
          />
        )}

        {error && <p style={{ color: "red", fontSize: 20 }}>{error}</p>}

        <Button
          view="action"
          size="l"
          width="max"
          onClick={handleAuth}
          loading={loading}
        >
          {tab === "login" ? "Войти" : "Зарегистрироваться"}
        </Button>
      </Card>
    </div>
  );
}
