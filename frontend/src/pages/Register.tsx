import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    try {
      await register(email, password);
      toast.success('Zarejestrowano');
    } catch {
      toast.error('Błąd rejestracji');
    }
  };

  return (
    <div className="card auth-card">
      <h2>Rejestracja</h2>
      <label>E-mail</label>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <label>Hasło</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={submit} className="btn-accent">Zarejestruj się</button>
      <p>Masz już konto? <a href="/login">Zaloguj się</a></p>
    </div>
  );
}
