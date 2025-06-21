import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    try {
      await login(email, password);
      toast.success('Zalogowano');
    } catch {
      toast.error('Błąd logowania');
    }
  };

  return (
    <div className="card auth-card">
      <h2>Logowanie</h2>
      <label>E-mail</label>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <label>Hasło</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={submit} className="btn-accent">Zaloguj</button>
      <p>Nie masz konta? <a href="/register">Zarejestruj się</a></p>
    </div>
  );
}
