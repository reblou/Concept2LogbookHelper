function Login() {
    const clientID = "L7PKTo4B8fAc2KDTeoqup8V8KGwxlmc37l64OfLS";
    const scope = "user:read,results:read";
    const redirectUri = "https://localhost:5173/auth";


  return (
      <div>
          <h1 id="tabelLabel">Logbook Helper</h1>
          <button onClick={Login}>Log In</button>
      </div>
    );


    function Login() {
        window.location.replace(`https://log.concept2.com/oauth/authorize?client_id=${clientID}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}`);
    }
}

export default Login;