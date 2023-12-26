import { useState } from 'react';
import axios from 'axios';
import Loader from '../Components/Loader';
import { Form, Button, FloatingLabel, Alert } from 'react-bootstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './form.css';


function LoginForm({ OnUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Встановлюємо індикатор завантаження перед відправкою запиту
    setError(null); // Скидаємо попередню помилку
    try {
      if (!email) {
        setError('Будь ласка, введіть адресу електронної пошти');
        return
      }
      if (!password) {
        setError('Будь ласка, введіть пароль');
        return;
      }
      const userData = { email, password };
      const response = await axios.post('http://127.0.0.1:5000/loginform', userData);
      if (response && response.data && response.data.error) {
        setError(response.data.error);
      } else {
        const { firstName, lastName, email } = response.data;
        const user = { firstName, lastName, email };
        OnUser(user); 
        setEmail('')
        setPassword('')
        setError(null);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev); // Зміна стану для відображення/приховування пароля
  };

  return (
    <div className='d-flex justify-content-center align-items-center'>
      <Form className="form">
      <h2 className="text-center mb-3">Log In</h2>
        <FloatingLabel
          controlId="email"
          label="Email Address"
          className="mb-2 label"
      >
          <Form.Control 
            className="control"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder='Email Address'
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="password"
          label="Password"
          className="mb-2 label"
        >
          <Form.Control 
            className="control"
            type={showPassword ? "text" : "password"}
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder='Password'
          />
          <span className="password-toggle" onClick={toggleShowPassword}> {/* Обробник кліку, який змінює стан показу пароля */}
              {showPassword ? <EyeFill /> : <EyeSlashFill />} {/* Відображення відповідної іконки */}
          </span>
        </FloatingLabel>
        
        { error && <Alert variant="danger">{error}</Alert> }

        <Button className="button" variant="primary" type="button" onClick={handleLogin}>Log In</Button>
      </Form>
      {loading && <Loader/>}
    </div>
  );
}

export default LoginForm;






