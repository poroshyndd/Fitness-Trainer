import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

interface DailyStat {
  day: string; 
  count: number; 
}

export default function StatsView() {
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [loadingTotal, setLoadingTotal] = useState(true);
  const [loadingDaily, setLoadingDaily] = useState(true);

  useEffect(() => {
    api.get<{ count: number }>('/trainings/stats')
      .then(res => setTotalCount(res.data.count))
      .catch(() => toast.error('Błąd ładowania statystyk ogólnych'))
      .finally(() => setLoadingTotal(false));

    api.get<DailyStat[]>('/trainings/daily')
      .then(res => setDailyStats(res.data))
      .catch(() => toast.error('Błąd ładowania statystyk dziennych'))
      .finally(() => setLoadingDaily(false));
  }, []);

  return (
    <div className="card">
      <h2 className="text-2xl mb-4">Statystyki</h2>

      {loadingTotal
        ? <p>Ładowanie statystyk ogólnych…</p>
        : totalCount !== null && (
          <p className="mb-6">
            Łącznie wykonanych treningów: <strong>{totalCount}</strong>
          </p>
        )
      }

      <h3 className="text-xl mb-2">Statystyki dzienne</h3>
      {loadingDaily
        ? <p>Ładowanie statystyk dziennych…</p>
        : dailyStats.length === 0
          ? <p>Brak danych do wyświetlenia.</p>
          : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b py-2 text-left">Data</th>
                  <th className="border-b py-2 text-left">Liczba treningów</th>
                </tr>
              </thead>
              <tbody>
                {dailyStats.map(ds => (
                  <tr key={ds.day} className="even:bg-gray-50">
                    <td className="py-2">{dayjs(ds.day).format('DD.MM.YYYY')}</td>
                    <td className="py-2">{ds.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
      }
    </div>
  );
}
