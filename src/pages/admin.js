"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import AdminLeads from "../components/AdminLeads/AdminLeads";

const AdminContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
`;

const AdminHeader = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const AdminTitle = styled.h1`
  margin: 0;
  color: #333;
  font-size: 28px;
`;

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    if (password === "admin123") {
      localStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      setPassword("");
    } else {
      alert("Senha inválida");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <AdminContainer>
        <AdminHeader>
          <AdminTitle>Acesso Admin</AdminTitle>
        </AdminHeader>
        <LoginForm onSubmit={handleLogin}>
          <LoginInput
            type={showPassword ? "text" : "password"}
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TogglePasswordBtn
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </TogglePasswordBtn>
          <LoginButton type="submit">Entrar</LoginButton>
        </LoginForm>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitleContainer>
          <AdminTitle>Painel Admin</AdminTitle>
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </AdminTitleContainer>
      </AdminHeader>
      <AdminLeads />
    </AdminContainer>
  );
}

const AdminTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LoginForm = styled.form`
  background: white;
  padding: 40px;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const LoginInput = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #ff6b35;
  }
`;

const TogglePasswordBtn = styled.button`
  padding: 10px 15px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const LoginButton = styled.button`
  padding: 12px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background: #e55a1f;
  }
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: #e55a1f;
  }
`;
