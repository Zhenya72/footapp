import { useHistory } from 'react-router-dom';

function MainPage(props) {
  const history = useHistory();
  const handleLogout = () => {
    // Очистити дані користувача (змінну onUser)
    localStorage.removeItem('user');  
    // Перенаправлення користувача на сторінку авторизації
    history.push('/authorization');
  };
  

  return (
    <div>
      <p>Привіт, {props.user}!</p>

      <p>тут твої чемпіонати</p>
      <button onClick={handleLogout}>Вихід</button>
    </div>
  );
}

export default MainPage;
