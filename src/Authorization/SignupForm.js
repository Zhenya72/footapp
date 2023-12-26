import { useState } from 'react';
import axios from 'axios';
import Loader from '../Components/Loader';
import { Form, Button, FloatingLabel, Alert } from 'react-bootstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './form.css';

function SignupForm({ OnUser }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfimPassword, setShowConfimPassword] = useState(false);

  const validateEmail = (email) => {
    // Регулярний вираз для перевірки валідності email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
  }
  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!firstName.trim()) {
        setError('Будь ласка, введіть ім\'я');
        return;
      }
      if (!lastName.trim()) {
        setError('Будь ласка, введіть прізвище');
        return;
      }
      if (!email || !validateEmail(email)) {
        setError('Будь ласка, введіть коректну адресу електронної пошти');
        return
      }
      if (!password) {
        setError('Будь ласка, введіть пароль');
        return;
      }
      if (password.length < 8 || !validatePassword(password)) {
        setError('Пароль повинен містити не менше 8 символів, цифри та літери');
        return;
      }
      if (password !== confirmPassword) {
        setError('Паролі не співпадають');
        return
      }
      const userData = { firstName, lastName, email, password };
      const response = await axios.post('http://127.0.0.1:5000/signupform', userData);
      if (response && response.data && response.data.error) {
        setError(response.data.error);
      } else {
        const user = {
          firstName: firstName,
          lastName: lastName,
          email: email
        }
        OnUser(user);
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setError(null);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev); // Зміна стану для відображення/приховування пароля
  };
  
  const toggleShowConfimPassword = () => {
    setShowConfimPassword((prev) => !prev); // Зміна стану для відображення/приховування пароля
  };

  return (
    <div className='d-flex justify-content-center align-items-center'>
      <Form className="form" onSubmit={handleRegistration}>
        <h2 className="text-center mb-3">Sign Up</h2>
        
        <FloatingLabel
        controlId="firstName"
        label="First Name"
        className="mb-2 label"
        >
          <Form.Control 
            className="control"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder='First Name'
        />
        </FloatingLabel>


      <FloatingLabel
        controlId="lastName"
        label="Last Name"
        className="mb-2 label"
      >
        <Form.Control 
            className="control"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder='Last Name'
        />
        </FloatingLabel>
        

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
        
      <FloatingLabel
        controlId="confirmPassword"
        label="Confirm Password"
        className="mb-2 label"
      >
        <Form.Control 
            className="control"
            type={showConfimPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm Password'
          />
          <span className="password-toggle" onClick={toggleShowConfimPassword}> {/* Обробник кліку, який змінює стан показу пароля */}
              {showConfimPassword ? <EyeFill /> : <EyeSlashFill />} {/* Відображення відповідної іконки */}
          </span>
        </FloatingLabel>


        {error && <Alert variant="danger">{error}</Alert>}
        <Button className="button" variant="primary" type="submit">Sign Up</Button>
        </Form>
      {loading && <Loader/>}
    </div>
  );
}

export default SignupForm;
