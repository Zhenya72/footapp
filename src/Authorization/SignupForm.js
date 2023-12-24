import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";


function SignupForm({ OnUser }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (password.length < 8) {
        setError('Пароль повинен містити щонайменше 8 символів');
        return
      }
      if (password !== confirmPassword) {
        setError('Паролі не співпадають');
        return
      }
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });
      const userData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };
      OnUser(userData); // Встанови інформацію про користувача
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleRegistration}>
      <h2>Sign Up</h2>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder='First Name'
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder='Last Name'
        />
      </div>
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
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm Password'
        />
      </div>
        <button type="submit">Sign Up</button>
        </form>
      {loading && <div>Завантаження...'</div>}
      {error && <div>Помилка: {error}</div>}
    </div>
  );
}

export default SignupForm;
