import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import api from '../api';
import { Training } from '../api/types';
import 'react-calendar/dist/Calendar.css';

export default function CalendarView() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [trainings, setTrainings] = useState<Training[]>([]);

  useEffect(() => {
    api.get<Training[]>('/trainings')
      .then(res => setTrainings(res.data))
      .catch(() => {
      });
  }, []);

  const datesWithTrain = new Set(
    trainings.map(t => new Date(t.trainingDate).toDateString())
  );

  return (
    <div>
      <h2>Kalendarz</h2>
      <Calendar
        value={date}
        tileClassName={({ date: d }) =>
          datesWithTrain.has(d.toDateString()) ? 'has-training' : undefined
        }
        onChange={(value, _event) => {
          if (!value) return;           
          if (Array.isArray(value)) {
            setDate(value[0]);
          } else {
            setDate(value);
          }
        }}
      />

      <p> Wybrana data: {date ? date.toLocaleDateString() : '—'}</p>

      <ul>
        {date &&
         trainings
          .filter(t => new Date(t.trainingDate).toDateString() === date.toDateString())
          .map(t => (
            <li key={t.id}>
              {new Date(t.trainingDate).toLocaleTimeString()} — {t.type} ({t.duration} мин)
            </li>
          ))}
      </ul>
    </div>
  );
}
