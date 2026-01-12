function Login({ onLogin }) {
  return (
    <div style={{ padding: "40px" }}>
      <h2>Login</h2>

      <button onClick={() => onLogin("contractor")}>
        Login as Contractor
      </button>

      <br /><br />

      <button onClick={() => onLogin("citizen")}>
        Login as Citizen
      </button>
    </div>
  );
}

export default Login;
