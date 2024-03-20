import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3005/login",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        onLogin();
      } else {
        alert("Invalid username or password!");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        // Sunucu tarafından gönderilen hata durumları
        alert(`Server responded with an error: ${error.response.data.message}`);
      } else if (error.request) {
        // İstek gönderilirken bir hata oluştu
        alert("Request could not be sent.");
      } else {
        // Diğer hata durumları
        alert(`An error occurred during login: ${error.message}`);
      }
    }
  };

  return (
    <div className="login-container">
      <img src="phone.png" alt="phone" className="center-image" />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Kullanıcı Adı"
        className="input-field"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Şifre"
        className="input-field"
      />
      <button onClick={handleLogin} className="login-button">
        Giriş Yap
      </button>
    </div>
  );
};

export default Login;
