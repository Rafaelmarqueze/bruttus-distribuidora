"use client";
import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  margin: 0 0 10px 0;
  color: #333;
  text-align: center;
  font-size: 28px;
`;

const Subtitle = styled.p`
  color: #666;
  text-align: center;
  margin: 0 0 30px 0;
  font-size: 14px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #333;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 14px;
`;

const Input = styled.textarea`
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: monospace;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #5568d3;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  border-radius: 8px;
  background: ${(props) => (props.valid ? "#d4edda" : "#f8d7da")};
  border: 1px solid ${(props) => (props.valid ? "#c3e6cb" : "#f5c6cb")};
`;

const ResultTitle = styled.h3`
  margin: 0 0 15px 0;
  color: ${(props) => (props.valid ? "#155724" : "#721c24")};
  font-size: 18px;
`;

const ResultText = styled.p`
  margin: 8px 0;
  color: ${(props) => (props.valid ? "#155724" : "#721c24")};
  font-size: 14px;
`;

const ResultCode = styled.code`
  background: rgba(0, 0, 0, 0.05);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
  margin: 8px 0;
  word-break: break-all;
`;

export default function VerifyCoupon() {
  const [coupon, setCoupon] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!coupon.trim()) {
      alert("Por favor, cole o código do cupom");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/verifyCoupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coupon: coupon.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          valid: true,
          cnpj: data.coupon.cnpj,
          expiresAt: data.expiresAt,
          freeTrialDays: data.coupon.freeTrialDays,
          issuedAt: data.coupon.issuedAt,
        });
      } else {
        setResult({
          valid: false,
          error: data.error,
        });
      }
    } catch (error) {
      console.error("Erro:", error);
      setResult({
        valid: false,
        error: "Erro ao verificar cupom. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container>
      <Card>
        <Title>🎟️ Verificar Cupom</Title>
        <Subtitle>Valide seu cupom de 30 dias grátis</Subtitle>

        <form onSubmit={handleVerify}>
          <FormGroup>
            <Label htmlFor="coupon">Cole seu código de cupom:</Label>
            <Input
              id="coupon"
              placeholder="Copie e cole o código JWT aqui..."
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              disabled={loading}
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? "Verificando..." : "Verificar Cupom"}
          </Button>
        </form>

        {result && (
          <ResultContainer valid={result.valid}>
            {result.valid ? (
              <>
                <ResultTitle valid={true}>✓ Cupom Válido!</ResultTitle>
                <ResultText>
                  <strong>CNPJ:</strong> <ResultCode>{result.cnpj}</ResultCode>
                </ResultText>
                <ResultText>
                  <strong>Dias Grátis:</strong> {result.freeTrialDays} dias
                </ResultText>
                <ResultText>
                  <strong>Emitido em:</strong> {formatDate(result.issuedAt)}
                </ResultText>
                <ResultText>
                  <strong>Válido até:</strong> {formatDate(result.expiresAt)}
                </ResultText>
                <ResultText style={{ marginTop: "15px", fontSize: "12px" }}>
                  Este cupom pode ser utilizado para ativar 30 dias de acesso grátis.
                </ResultText>
              </>
            ) : (
              <>
                <ResultTitle valid={false}>✗ Cupom Inválido</ResultTitle>
                <ResultText>{result.error}</ResultText>
                <ResultText style={{ marginTop: "10px", fontSize: "12px" }}>
                  Se o problema persistir, entre em contato com o suporte.
                </ResultText>
              </>
            )}
          </ResultContainer>
        )}
      </Card>
    </Container>
  );
}
