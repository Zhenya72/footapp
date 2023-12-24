import { useState } from 'react';
import axios from 'axios';


function LoginForm({ OnUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Встановлюємо індикатор завантаження перед відправкою запиту
    setError(null); // Скидаємо попередню помилку
    try {
      const userData = { email, password };
      const response = await axios.post('http://127.0.0.1:5000/loginform', userData);
      if (response.data.error) {
        setError(response.data.error);
      } else {
        OnUser(email); 
        setEmail('')
        setPassword('')
        setError(null);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <form>
      <h2>Log In</h2>
        <div>
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder='Email Address'
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder='Password'
          />
        </div>
        <button type="button" onClick={handleLogin}>Log In</button>
      </form>
      {loading && <div>Завантаження...'</div>}
      {error && <div>Помилка: {error}</div>}
    </div>
  );
}

export default LoginForm;









