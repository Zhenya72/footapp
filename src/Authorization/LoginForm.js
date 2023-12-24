import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";


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
      await signInWithEmailAndPassword(auth, email, password)
      const user = auth.currentUser;
      const userData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };
      OnUser(userData); // Встанови інформацію про користувача
      setEmail('')
      setPassword('')
      setError(null);
      // Якщо запит успішний, перенаправляємо користувача на головну сторінку
    } catch (error) {
      setError(error.message);
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









