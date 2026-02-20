import { db } from '@/db';
import { purchases } from '@/db/schema';
import { and, gte, lt } from 'drizzle-orm';

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0, 0);
}

export default async function handler(req, res) {
  try {
    const monthParam = req.query.month; // expected YYYY-MM
    const now = new Date();
    let yearMonth;
    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
      const [y, m] = monthParam.split('-').map(Number);
      yearMonth = new Date(y, m - 1, 1);
    } else {
      yearMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const monthStart = startOfMonth(yearMonth);
    const monthEnd = endOfMonth(yearMonth);

    const prevMonth = new Date(yearMonth.getFullYear(), yearMonth.getMonth() - 1, 1);
    const prevStart = startOfMonth(prevMonth);
    const prevEnd = endOfMonth(prevMonth);

    // fetch purchases in both ranges
    const thisMonth = await db.select().from(purchases).where(and(gte(purchases.createdAt, monthStart), lt(purchases.createdAt, monthEnd)));
    const prevMonthRows = await db.select().from(purchases).where(and(gte(purchases.createdAt, prevStart), lt(purchases.createdAt, prevEnd)));

    // aggregate totals
    const monthTotal = thisMonth.reduce((s, p) => s + parseFloat(p.total || 0), 0);
    const prevTotal = prevMonthRows.reduce((s, p) => s + parseFloat(p.total || 0), 0);
    const ordersCount = thisMonth.length;
    const avgTicket = ordersCount > 0 ? monthTotal / ordersCount : 0;

    // daily series for month and previous month
    function toDateKey(value) {
      if (!value) return null;
      if (value instanceof Date) return value.toISOString().slice(0, 10);
      if (typeof value === 'string') {
        // assume ISO-ish string
        return value.slice(0, 10);
      }
      // fallback
      return new Date(value).toISOString().slice(0, 10);
    }

    function buildDailySeries(rows, start, end) {
      const days = [];
      // build map dateKey -> total for faster lookups
      const map = Object.create(null);
      (rows || []).forEach((r) => {
        const k = toDateKey(r?.createdAt);
        if (!k) return;
        map[k] = (map[k] || 0) + (parseFloat(r.total || 0) || 0);
      });

      const startDate = new Date(start);
      for (let d = new Date(startDate); d < end; d.setDate(d.getDate() + 1)) {
        const day = new Date(d);
        const key = day.toISOString().slice(0, 10);
        const total = map[key] || 0;
        days.push({ date: key, total });
      }
      return days;
    }

    const dailyThis = buildDailySeries(thisMonth, monthStart, monthEnd);
    const dailyPrev = buildDailySeries(prevMonthRows, prevStart, prevEnd);

    // payment method breakdown for this month
    const paymentMap = Object.create(null);
    (thisMonth || []).forEach((p) => {
      const method = p?.paymentMethod || p?.payment_method || (p.mercadopagoId ? 'cartao' : 'avista');
      const key = method || 'avista';
      paymentMap[key] = (paymentMap[key] || 0) + (parseFloat(p.total || 0) || 0);
    });

    const paymentBreakdown = Object.keys(paymentMap).map((k) => ({
      method: k,
      value: paymentMap[k],
    }));

    return res.status(200).json({
      month: yearMonth.toISOString().slice(0,7),
      monthTotal,
      prevTotal,
      ordersCount,
      avgTicket,
      dailyThis,
      dailyPrev,
      paymentBreakdown,
    });
  } catch (err) {
    console.error('reports api error', err);
    return res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
}
