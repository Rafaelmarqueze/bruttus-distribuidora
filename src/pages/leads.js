"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 40px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background: #f5f5f5;
    padding: 12px;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
    text-align: left;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #eee;
  }

  tr:hover {
    background: #fafafa;
  }
`;

const Empty = styled.div`
  text-align: center;
  color: #666;
  padding: 40px;
`;

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar leads:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("pt-BR");

  return (
    <Container>
      <h1>Leads</h1>
      {loading ? (
        <Empty>Carregando...</Empty>
      ) : leads.length === 0 ? (
        <Empty>Nenhum lead encontrado.</Empty>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>CNPJ</th>
              <th>Status</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <td>{l.name}</td>
                <td>{l.email}</td>
                <td>{l.cnpj || "-"}</td>
                <td>{l.status}</td>
                <td>{formatDate(l.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
