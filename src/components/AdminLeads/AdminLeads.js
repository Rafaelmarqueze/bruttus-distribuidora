"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 22px;
  border-bottom: 2px solid #ff6b35;
  padding-bottom: 10px;
`;

const LeadsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;

  th {
    background: #f5f5f5;
    padding: 12px;
    text-align: left;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
    color: #333;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #eee;
  }

  tr:hover {
    background: #f9f9f9;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: ${(props) => props.color || "#ff6b35"};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
`;

const ModalTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  color: #333;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #ff6b35;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CopyButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    opacity: 0.9;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
`;

const CreateLeadContainer = styled.div`
  background: #f9f9f9;
  border: 2px dashed #ff6b35;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const CreateLeadForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;
  align-items: flex-end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CreateLeadLabel = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #333;
  font-weight: bold;

  input {
    margin-top: 4px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #ff6b35;
    }
  }
`;

const CreateLeadButton = styled.button`
  padding: 8px 16px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  height: 36px;

  &:hover {
    background: #e55a1f;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CreateNewLeadBtn = styled.button`
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;

  &:hover {
    background: #218838;
  }
`;

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cnpj, setCnpj] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [purchaseLink, setPurchaseLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", cnpj: "" });
  const statuses = ["novo", "contatado", "convertido", "perdido"];

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/leads");
      const data = await response.json();
      if (Array.isArray(data)) {
        setLeads(data);
      } else {
        console.warn("API returned non-array for leads, resetting to empty", data);
        setLeads([]);
      }
    } catch (error) {
      console.error("Erro ao carregar leads:", error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePurchaseLink = (lead) => {
    setSelectedLead(lead);
    setCnpj(lead.cnpj || "");
    setShowModal(true);
  };

  const handleCreateLink = async (e) => {
    e.preventDefault();

    if (!cnpj.trim()) {
      alert("Por favor, insira o CNPJ");
      return;
    }

    // Remove pontuação do CNPJ
    const cleanCNPJ = cnpj.trim().replace(/[^\d]/g, "");

    if (cleanCNPJ.length !== 14) {
      alert("CNPJ deve conter 14 dígitos");
      return;
    }

    try {
      const response = await fetch("/api/generatePurchaseLink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cnpj: cleanCNPJ,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPurchaseLink(data.purchaseLink);

        // Update lead with clean CNPJ (sem pontuação)
        if (selectedLead) {
          const updated = leads.map((l) =>
            l.id === selectedLead.id ? { ...l, cnpj: cleanCNPJ } : l
          );
          setLeads(updated);

          // persist to backend as well
          try {
            await fetch(`/api/leads?id=${selectedLead.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cnpj: cleanCNPJ }),
            });
          } catch (err) {
            console.error("Erro ao salvar CNPJ no lead:", err);
          }
        }
      } else {
        alert("Erro ao gerar link de compra");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao gerar link de compra");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Link copiado para o clipboard!");
  };

  const handleCreateNewLead = async (e) => {
    e.preventDefault();

    if (!newLead.name || !newLead.email) {
      alert("Nome e email são obrigatórios");
      return;
    }

    try {
      const cleanCNPJ = newLead.cnpj ? newLead.cnpj.replace(/[^\d]/g, "") : "";
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newLead, status: "novo", cnpj: cleanCNPJ }),
      });

      if (response.ok) {
        const createdLead = await response.json();
        setLeads([...leads, createdLead]);
        setNewLead({ name: "", email: "", phone: "" });
        setShowNewLeadForm(false);
        alert("Lead criado com sucesso!");
      } else {
        alert("Erro ao criar lead");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar lead");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const updateLeadStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/leads?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        const updated = await response.json();
        setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
      } else {
        console.error("Falha ao atualizar status do lead");
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  if (loading) {
    return <Container><EmptyState>Carregando leads...</EmptyState></Container>;
  }

  return (
    <>
      <Container>
        <HeaderContainer>
          <SectionTitle style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>
            Leads
          </SectionTitle>
          <CreateNewLeadBtn onClick={() => setShowNewLeadForm(!showNewLeadForm)}>
            {showNewLeadForm ? "Cancelar" : "+ Novo Lead"}
          </CreateNewLeadBtn>
        </HeaderContainer>

        {showNewLeadForm && (
          <CreateLeadContainer>
            <CreateLeadForm onSubmit={handleCreateNewLead}>
              <CreateLeadLabel>
                Nome
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  required
                />
              </CreateLeadLabel>
              <CreateLeadLabel>
                Email
                <input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  required
                />
              </CreateLeadLabel>
              <CreateLeadLabel>
                WhatsApp
                <input
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                />
              </CreateLeadLabel>
              <CreateLeadLabel>
                CNPJ
                <input
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={newLead.cnpj}
                  onChange={(e) => setNewLead({ ...newLead, cnpj: e.target.value })}
                />
              </CreateLeadLabel>
              <CreateLeadButton type="submit">Criar Lead</CreateLeadButton>
            </CreateLeadForm>
          </CreateLeadContainer>
        )}

        {leads.length === 0 ? (
          <EmptyState>Nenhum lead registrado ainda. Crie um novo para testar!</EmptyState>
        ) : (
          <LeadsTable>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>CNPJ</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(leads) ? leads : []).map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone || "-"}</td>
                  <td>{lead.cnpj || "-"}</td>
                  <td>
                    <select
                      value={lead.status || "novo"}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        background: '#fff',
                        fontSize: '14px'
                      }}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{formatDate(lead.createdAt)}</td>
                  <td>
                    <ActionButtons>
                      <Button
                        onClick={() => handleGeneratePurchaseLink(lead)}
                      >
                        Gerar Link de Compra
                      </Button>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </tbody>
          </LeadsTable>
        )}
      </Container>

      {showModal && (
        <Modal onClick={() => !purchaseLink && setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {purchaseLink ? (
              <>
                <ModalTitle>✓ Link de Compra Gerado com Sucesso!</ModalTitle>
                <SuccessMessage>
                  <span>{purchaseLink}</span>
                  <CopyButton onClick={() => copyToClipboard(purchaseLink)}>
                    Copiar
                  </CopyButton>
                </SuccessMessage>
                <p style={{ color: "#666", marginBottom: "20px" }}>
                  Envie este link ao cliente para que ele possa fazer a compra.
                </p>
                <Button
                  onClick={() => {
                    setShowModal(false);
                    setPurchaseLink("");
                    setCnpj("");
                    setSelectedLead(null);
                  }}
                >
                  Fechar
                </Button>
              </>
            ) : (
              <>
                <ModalTitle>Gerar Link de Compra</ModalTitle>
                <form onSubmit={handleCreateLink}>
                  <FormGroup>
                    <Label htmlFor="cnpj">CNPJ do Cliente</Label>
                    <Input
                      id="cnpj"
                      type="text"
                      placeholder="Ex: 12.345.678/0001-00 (será removida a pontuação)"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <ButtonGroup>
                    <Button type="submit">Gerar Link</Button>
                    <Button
                      type="button"
                      color="#999"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </Button>
                  </ButtonGroup>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
