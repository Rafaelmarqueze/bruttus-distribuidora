"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import AdminLeads from "../components/AdminLeads/AdminLeads";
import AdminPurchases from "../components/AdminPurchases/AdminPurchases";
import AdminProducts from "../components/AdminProducts/AdminProducts";
import AdminReports from "../components/AdminReports/AdminReports";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("reports");
  const [loading, setLoading] = useState(false);

  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    title: "",
    message: "",
    isError: false
  });

  const closeFeedback = () => setFeedbackModal({ ...feedbackModal, open: false });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);
      } else {
        setFeedbackModal({
          open: true,
          title: "Falha no Acesso",
          message: data.message || "Usuário ou senha incorretos.",
          isError: true
        });
      }
    } catch (err) {
      setFeedbackModal({
        open: true,
        title: "Erro de Servidor",
        message: "Não foi possível conectar ao banco de dados.",
        isError: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  return (
    <>
      {/* Modal de Feedback */}
      {feedbackModal.open && (
        <ModalOverlay onClick={closeFeedback}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: feedbackModal.isError ? "#b90315" : "#25D366" }}>
              {feedbackModal.title}
            </h3>
            <p>{feedbackModal.message}</p>
            <div className="actions" style={{ marginTop: '20px' }}>
              
              <button 
                onClick={closeFeedback} 
                style={{ 
                  padding: '10px 25px', 
                  backgroundColor: '#ff6b35', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Fechar
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {!isAuthenticated ? (
        <AdminContainer>
          <AdminHeader>
            <AdminTitle>Acesso Admin</AdminTitle>
          </AdminHeader>
          <LoginForm onSubmit={handleLogin}>
            <LoginInput
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <LoginInput
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <LoginButton type="submit" disabled={loading}>
              {loading ? "Autenticando..." : "Entrar"}
            </LoginButton>
          </LoginForm>
        </AdminContainer>
      ) : (
        <AdminWrapper>
          <Sidebar>
            <Logo>BRUTTUS</Logo>
            <SidebarButton active={activeTab === "reports"} onClick={() => setActiveTab("reports")}>Dashboard</SidebarButton>
            <SidebarButton active={activeTab === "leads"} onClick={() => setActiveTab("leads")}>Leads</SidebarButton>
            <SidebarButton active={activeTab === "purchases"} onClick={() => setActiveTab("purchases")}>Compras</SidebarButton>
            <SidebarButton active={activeTab === "products"} onClick={() => setActiveTab("products")}>Produtos</SidebarButton>
            <LogoutButtonSidebar onClick={handleLogout}>Sair</LogoutButtonSidebar>
          </Sidebar>
          <Content>
            {activeTab === "reports" && <AdminReports />}
            {activeTab === "leads" && <AdminLeads />}
            {activeTab === "purchases" && <AdminPurchases />}
            {activeTab === "products" && <AdminProducts />}
          </Content>
        </AdminWrapper>
      )}
    </>
  );
}


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  h3 { margin: 0 0 15px 0; font-size: 22px; }
  p { color: #666; margin: 0; line-height: 1.5; }
`;

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
  &:focus { outline: none; border-color: #ff6b35; }
`;

const TogglePasswordBtn = styled.button`
  padding: 10px 15px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  &:hover { background: #e0e0e0; }
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
  &:disabled { background: #ccc; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #e55a1f; }
`;

const AdminWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 220px;
  background: #520109;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
`;

const SidebarButton = styled.button`
  background: ${(props) => (props.active ? "#b90315" : "transparent")};
  color: white;
  border: none;
  padding: 12px 10px;
  margin-bottom: 10px;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  &:hover { background: #b90315; }
`;

const LogoutButtonSidebar = styled.button`
  margin-top: auto;
  background: #520109;
  color: white;
  border: none;
  padding: 12px 10px;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  &:hover { background: #4a0000; }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  background: #f5f5f5;
`;