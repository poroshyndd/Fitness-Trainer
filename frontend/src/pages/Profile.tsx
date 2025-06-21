import React, { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

const activityLevels = [
  { value: 1.2,   label: 'Siedzący tryb życia' },
  { value: 1.375, label: 'Lekka aktywność' },
  { value: 1.55,  label: 'Umiarkowana aktywność' },
  { value: 1.725, label: 'Wysoka aktywność' },
  { value: 1.9,   label: 'Bardzo wysoka aktywność' },
];

const macroDefaults = {
  protein: 0.25,  
  fat:     0.25,  
  carbs:   0.50,  
};

export default function Profile() {
  const [weight, setWeight]     = useState<number>(0);
  const [height, setHeight]     = useState<number>(0);
  const [age, setAge]           = useState<number>(0);
  const [goal, setGoal]         = useState<'maintain'|'lose'|'gain'>('maintain');

  const [activity, setActivity] = useState<number>(1.375);
  const [bmr, setBmr]           = useState<number|null>(null);
  const [tdee, setTdee]         = useState<number|null>(null);

  const [proteinPct, setProteinPct] = useState<number>(macroDefaults.protein);
  const [fatPct,     setFatPct]     = useState<number>(macroDefaults.fat);
  const [carbsPct,   setCarbsPct]   = useState<number>(macroDefaults.carbs);

  useEffect(() => {
    if (weight && height && age) {
      const calc = 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age;
      setBmr(Math.round(calc));
    } else {
      setBmr(null);
    }
  }, [weight, height, age]);

  useEffect(() => {
    if (bmr !== null) {
      setTdee(Math.round(bmr * activity));
    } else {
      setTdee(null);
    }
  }, [bmr, activity]);

  const fixMacros = (changed: 'protein'|'fat'|'carbs', value: number) => {
    const others = ['protein','fat','carbs'].filter(m => m !== changed);
    const remaining = 1 - value;
    others.forEach(m => {
      const setter = m === 'protein' ? setProteinPct
                   : m === 'fat'     ? setFatPct
                   : setCarbsPct;
      setter(remaining / 2);
    });
    if (changed === 'protein') setProteinPct(value);
    if (changed === 'fat')     setFatPct(value);
    if (changed === 'carbs')   setCarbsPct(value);
  };

  const saveProfile = async () => {
    try {
      await api.put('/profile', {
        weight, height, age, goal,
        activity,
        macros: { proteinPct, fatPct, carbsPct },
      });
      toast.success('Profil zapisany');
    } catch {
      toast.error('Błąd zapisu profilu');
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow">
      <h2 className="text-2xl mb-4">Profil użytkownika</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1">Waga (kg)</label>
          <input type="number" value={weight}
                 onChange={e => setWeight(+e.target.value)}
                 className="w-full"/>
        </div>
        <div>
          <label className="block mb-1">Wzrost (cm)</label>
          <input type="number" value={height}
                 onChange={e => setHeight(+e.target.value)}
                 className="w-full"/>
        </div>
        <div>
          <label className="block mb-1">Wiek</label>
          <input type="number" value={age}
                 onChange={e => setAge(+e.target.value)}
                 className="w-full"/>
        </div>
        <div>
          <label className="block mb-1">Cel</label>
          <select value={goal}
                  onChange={e => setGoal(e.target.value as any)}
                  className="w-full">
            <option value="maintain">Utrzymanie wagi</option>
            <option value="lose">Redukcja</option>
            <option value="gain">Przyrost masy</option>
          </select>
        </div>
      </div>
      {bmr !== null && (
      <div className="mb-6 p-4 bg-white rounded shadow">
        <p>BMR: <strong>{bmr} kcal</strong></p>
        <div className="mt-3">
          <label className="block mb-1">Poziom aktywności</label>
          <select value={activity}
                  onChange={e => setActivity(+e.target.value)}
                  className="w-full">
            {activityLevels.map(o =>
              <option key={o.value} value={o.value}>{o.label}</option>
            )}
          </select>
        </div>
        <p className="mt-3">TDEE: <strong>{tdee} kcal</strong></p>
      </div>
      )}
      {tdee !== null && (
      <div className="mb-6 p-4 bg-white rounded shadow">
        <h3 className="font-medium mb-2">Rekomendowany rozkład makro</h3>
        <div className="space-y-4">
          {['protein','fat','carbs'].map(m => {
            const label = m === 'protein' ? 'Białko' 
                        : m === 'fat'     ? 'Tłuszcze' 
                        : 'Węglowodany';
            const pct   = m === 'protein' ? proteinPct
                        : m === 'fat'     ? fatPct
                        : carbsPct;
            return (
              <div key={m}>
                <label className="block mb-1">{label} (%)</label>
                <input type="range"
                       min={0} max={1} step={0.01}
                       value={pct}
                       onChange={e => fixMacros(m as any, +e.target.value)}
                       className="w-full"/>
                <span>{Math.round(pct * 100)}%</span>
              </div>
            );
          })}
        </div>
        <p className="mt-4">
          <strong>Kalorie z białka:</strong> {Math.round(tdee * proteinPct * 4)} kcal<br/>
          <strong>Kalorie z tłuszczu:</strong> {Math.round(tdee * fatPct * 9)} kcal<br/>
          <strong>Kalorie z węglowodanów:</strong> {Math.round(tdee * carbsPct * 4)} kcal
        </p>
      </div>
      )}

      <button onClick={saveProfile}
              className="bg-red-500 text-white px-4 py-2 rounded shadow">
        Zapisz profil
      </button>
    </div>
  );
}
