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

const Table = styled.table`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
`;

export default function AdminPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await fetch("/api/purchases");
      const data = await res.json();
      setPurchases(data || []);
    } catch (err) {
      console.error("Erro ao carregar compras:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  return (
    <Container>
      <SectionTitle>Compras</SectionTitle>
      {loading ? (
        <EmptyState>Carregando compras...</EmptyState>
      ) : purchases.length === 0 ? (
        <EmptyState>Nenhuma compra registrada.</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>CNPJ</th>
              <th>Total</th>
              <th>Status</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.cnpj || "-"}</td>
                <td>R$ {Number(p.total).toFixed(2)}</td>
                <td>{p.status}</td>
                <td>{formatDate(p.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
