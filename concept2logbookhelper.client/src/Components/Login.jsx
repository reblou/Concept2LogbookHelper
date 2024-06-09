function Login() {
  return (
      <div>
          <h1 id="tabelLabel">Logbook Helper</h1>
          <button onClick={Login}>Log In via Concept2</button>
      </div>
    );


    function Login() {
        window.location.replace('api/authentication/redirect');
    }
}

export default Login;