

function MainPage(props) {

  console.log(props.user)
  return (
    <div>Привіт, {props.user.email}
      
      {props.user.displayName}
      
      
      !



      тут твої чемпіонати
    </div>
  );
}

export default MainPage;
