import "./RoleSelect.css";

function RoleSelect({ onSelectRole }) {
  return (
    <div className="role-container">
      <h1 className="title">Welcome to WorkProof</h1>
      <p className="subtitle">Select your role to continue</p>

      <div className="card-wrapper">
        <div
          className="role-card contractor"
          onClick={() => onSelectRole("contractor")}
        >
          <h2>Contractor</h2>
          <p>Upload project updates & progress</p>
        </div>

        <div
          className="role-card citizen"
          onClick={() => onSelectRole("citizen")}
        >
          <h2>Citizen</h2>
          <p>View work progress & give feedback</p>
        </div>
      </div>
    </div>
  );
}

export default RoleSelect;