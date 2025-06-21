import React, { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useAuth } from '../auth/AuthContext';

interface Training {
  id: number;
  trainingDate: string; 
  type: string;
  intensity: string;
  duration: number;
  completed: boolean;
}

export default function Trainings() {
  const { token } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [time, setTime] = useState<string>(dayjs().format('HH:mm'));
  const [type, setType] = useState<string>('');
  const [intensity, setIntensity] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Training | null>(null);

  useEffect(() => {
    if (!token) return;
    api.get<Training[]>('/trainings')
      .then(r => setTrainings(r.data))
      .catch(() => toast.error('Błąd ładowania treningów'));
  }, [token]);

  const openModal = (t: Training) => {
    const dt = dayjs(t.trainingDate);
    setDate(dt.format('YYYY-MM-DD'));
    setTime(dt.format('HH:mm'));
    setType(t.type);
    setIntensity(t.intensity);
    setDuration(t.duration);
    setCompleted(t.completed);
    setEditing(t);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const save = async () => {
    const payload = {
      trainingDate: dayjs(`${date}T${time}`).toISOString(),
      type, intensity, duration, completed,
    };
    try {
      if (editing) {
        const r = await api.put<Training>(`/trainings/${editing.id}`, payload);
        setTrainings(ts => ts.map(x => x.id === r.data.id ? r.data : x));
        toast.success('Trening zaktualizowany');
      } else {
        const r = await api.post<Training>('/trainings', payload);
        setTrainings(ts => [r.data, ...ts]);
        toast.success('Trening dodany');
      }
      setEditing(null);
      closeModal();
    } catch {
      toast.error('Błąd zapisu');
    }
  };

  const remove = async (t: Training) => {
    if (!window.confirm('Usunąć ten trening?')) return;
    try {
      await api.delete(`/trainings/${t.id}`);
      setTrainings(ts => ts.filter(x => x.id !== t.id));
      toast.success('Trening usunięty');
    } catch {
      toast.error('Błąd usuwania');
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow">
      <h2 className="text-2xl mb-4">Moje treningi</h2>

      <div className="flex flex-wrap items-end gap-4 p-4 bg-white rounded shadow mb-6">
        <div>
          <label className="block mb-1">Data</label>
          <input
            type="date"
            className="border rounded p-2"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Czas</label>
          <input
            type="time"
            className="border rounded p-2"
            value={time}
            onChange={e => setTime(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1">Typ</label>
          <input
            className="w-full border rounded p-2"
            placeholder="np. bieganie"
            value={type}
            onChange={e => setType(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1">Intensywność</label>
          <input
            className="w-full border rounded p-2"
            placeholder="low/medium/high"
            value={intensity}
            onChange={e => setIntensity(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Czas (min)</label>
          <input
            type="number"
            className="border rounded p-2 w-24"
            value={duration}
            onChange={e => setDuration(+e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={completed}
            onChange={e => setCompleted(e.target.checked)}
          />
          <span>Wykonane</span>
        </div>
        <button
          onClick={save}
          className="bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          Dodaj
        </button>
      </div>

      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Data</th>
            <th className="p-2">Czas</th>
            <th className="p-2">Typ</th>
            <th className="p-2">Int.</th>
            <th className="p-2">Min.</th>
            <th className="p-2">Wyk.</th>
            <th className="p-2">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {trainings.map(t => {
            const dt = dayjs(t.trainingDate);
            return (
              <tr
                key={t.id}
                className="even:bg-gray-50 hover:bg-gray-100 cursor-pointer"
              >
                <td className="p-2" onClick={() => openModal(t)}>
                  {dt.format('DD.MM.YYYY')}
                </td>
                <td className="p-2" onClick={() => openModal(t)}>
                  {dt.format('HH:mm')}
                </td>
                <td className="p-2" onClick={() => openModal(t)}>
                  {t.type}
                </td>
                <td className="p-2" onClick={() => openModal(t)}>
                  {t.intensity}
                </td>
                <td className="p-2" onClick={() => openModal(t)}>
                  {t.duration}
                </td>
                <td className="p-2" onClick={() => openModal(t)}>
                  {t.completed ? '✓' : '–'}
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={e => { e.stopPropagation(); openModal(t); }}
                    className="px-2 bg-blue-500 text-white rounded"
                  >
                    ✎
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); remove(t); }}
                    className="px-2 bg-red-500 text-white rounded"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isOpen && editing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={closeModal}
          />
          <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-md">
            <h3 className="text-xl mb-4">Edytuj trening</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Data</label>
                <input
                  type="date"
                  className="border rounded p-2 w-full"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Czas</label>
                <input
                  type="time"
                  className="border rounded p-2 w-full"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Typ</label>
                <input
                  className="border rounded p-2 w-full"
                  value={type}
                  onChange={e => setType(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Intensywność</label>
                <input
                  className="border rounded p-2 w-full"
                  value={intensity}
                  onChange={e => setIntensity(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Czas (min)</label>
                <input
                  type="number"
                  className="border rounded p-2 w-full"
                  value={duration}
                  onChange={e => setDuration(+e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={e => setCompleted(e.target.checked)}
                  className="mr-2"
                />
                <span>Wykonane</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded"
              >
                Anuluj
              </button>
              <button
                onClick={save}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
