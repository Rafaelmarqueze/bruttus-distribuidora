"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Container = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

const Header = styled.div`
  display:flex;
  justify-content: space-between;
  align-items:center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin:0;
  font-size:20px;
  color:#2C1810;
`;

const Controls = styled.div`
  display:flex;
  gap:8px;
  align-items:center;
`;

const FilterButton = styled.button`
  padding:8px 12px;
  background: ${(p) => (p.active ? '#ff6b35' : 'transparent')};
  color: ${(p) => (p.active ? 'white' : '#333')};
  border: 1px solid #eee;
  border-radius: 6px;
  cursor: pointer;
  font-weight:600;
  &:hover { opacity:0.95; }
`;

const InputMonth = styled.input`
  padding:8px 10px;
  border-radius:6px;
  border:1px solid #eaeaea;
  background: #fff;
`;

const ActionButton = styled.button`
  padding:8px 12px;
  background:#6b4f3f;
  color:white;
  border:none;
  border-radius:6px;
  cursor:pointer;
  font-weight:600;
`;

const KPIGrid = styled.div`
  display:grid;
  grid-template-columns: repeat(4,1fr);
  gap:16px;
  margin-bottom:18px;
`;

const KPICard = styled.div`
  padding:14px;
  border-radius:8px;
  background: linear-gradient(180deg,#fff,#f9f7f2);
  text-align:left;
  box-shadow: 0 6px 18px rgba(43,31,24,0.06);
`;

const KPIValue = styled.div`
  font-size:18px;
  font-weight:700;
  margin-top:8px;
  color:#2C1810;
`;

const ChartsSection = styled.div`
  display:flex;
  flex-direction:column;
  gap:16px;
  align-items:stretch;
`;

const ChartCard = styled.div`
  padding:12px;
  border-radius:8px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(43,31,24,0.04);
`;

export default function AdminReports() {
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const [month, setMonth] = useState(defaultMonth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [month]);

  async function load() {
    setLoading(true);
    try {
    const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/reports?month=${month}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  const formatCurrency = (v) => `R$ ${Number(v || 0).toFixed(2)}`;

  const mergedDaily = () => {
    if (!data) return [];
    const map = {};
    const thisArr = Array.isArray(data.dailyThis) ? data.dailyThis : [];
    const prevArr = Array.isArray(data.dailyPrev) ? data.dailyPrev : [];
    thisArr.forEach((d) => { if (d && d.date) map[d.date] = { date: d.date, this: d.total || 0 }; });
    prevArr.forEach((d) => { if (d && d.date) map[d.date] = { ...(map[d.date] || { date: d.date }), prev: d.total || 0 }; });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  };

  const cumulativeSeries = (arr) => {
    let sum = 0;
    return (arr || []).map((r) => {
      sum += Number(r.this || 0);
      return { ...r, cumulative: sum };
    });
  };

  const merged = mergedDaily();
  const mergedWithCum = cumulativeSeries(merged);

  const pieData = (() => {
    if (!data || !Array.isArray(data.paymentBreakdown)) return [];
    const total = data.paymentBreakdown.reduce((s, p) => s + (Number(p.value) || 0), 0) || 1;
    const mapLabel = (k) => {
      if (k === 'cartao') return 'Cartão de Crédito';
      if (k === 'parcelado') return 'Parcelado';
      if (k === 'pix') return 'PIX';
      if (k === 'avista') return 'À vista';
      return k;
    };
    return data.paymentBreakdown.map((p) => ({ name: mapLabel(p.method), value: Number(p.value) || 0, percent: ((Number(p.value) || 0) / total) * 100 }));
  })();

  const COLORS = ['#FF6B35', '#6B4F3F', '#F4C542', '#4FC3F7', '#C8C8C8'];

  return (
    <Container>
      <Header>
        <Title>Relatório de Faturamento</Title>
        <Controls>
          <FilterButton onClick={() => setMonth(defaultMonth)}>Mês Atual</FilterButton>
          <FilterButton onClick={() => {
            const [y, m] = month.split('-').map(Number);
            const dt = new Date(y, m-2, 1); // previous
            setMonth(`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`);
          }}>Último Mês</FilterButton>
          <InputMonth type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          <ActionButton onClick={load}>Atualizar</ActionButton>
        </Controls>
      </Header>

      {loading && <p>Carregando...</p>}
      {!loading && data && (
        <>
          <KPIGrid>
            <KPICard>
              <div>Faturamento</div>
              <KPIValue>{formatCurrency(data.monthTotal)}</KPIValue>
            </KPICard>
            <KPICard>
              <div>Faturamento (Mês anterior)</div>
              <KPIValue>{formatCurrency(data.prevTotal)}</KPIValue>
            </KPICard>
            <KPICard>
              <div>Ticket Médio</div>
              <KPIValue>{formatCurrency(data.avgTicket)}</KPIValue>
            </KPICard>
            <KPICard>
              <div>Volume de Pedidos</div>
              <KPIValue>{data.ordersCount}</KPIValue>
            </KPICard>
          </KPIGrid>

          <ChartsSection>
            <ChartCard>
              <h3 style={{ margin: '0 0 10px 0' }}>Faturamento Diário e Acumulado</h3>
              <div style={{ height: 340 }}>
                <ResponsiveContainer>
                  <LineChart data={mergedWithCum} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff6b35" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#ff6b35" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(d)=>d.slice(8,10)} />
                    <YAxis tickFormatter={(v)=>`R$${Number(v).toFixed(0)}`} />
                    <Tooltip formatter={(v)=>formatCurrency(v)} />
                    <Legend />
                    <Line type="monotone" dataKey="this" name="Faturamento Diário" stroke="#ff6b35" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="cumulative" name="Faturamento Acumulado" stroke="#6b4f3f" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard>
              <h3 style={{ margin: '0 0 10px 0' }}>Faturamento Diário (barras)</h3>
              <div style={{ height: 340 }}>
                <ResponsiveContainer>
                  <BarChart data={merged} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(d)=>d.slice(8,10)} />
                    <YAxis tickFormatter={(v)=>`R$${Number(v).toFixed(0)}`} />
                    <Tooltip formatter={(v)=>formatCurrency(v)} />
                    <Bar dataKey="this" name="Faturamento Diário" fill="#ff6b35" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* <ChartCard>
              <h3 style={{ margin: '0 0 10px 0' }}>Percentual por Método de Pagamento</h3>
              <div style={{ height: 300, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label={(entry) => `${entry.name}: ${entry.percent.toFixed(1)}%`}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard> */}
          </ChartsSection>
        </>
      )}
    </Container>
  );
}
