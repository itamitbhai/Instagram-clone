// import React, { useState, useEffect } from "react";
// import "../style/form.scss";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// const Login = () => {
//   const { user, loading, handleLogin } = useAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   const success = await handleLogin(email, password);

//   if (success) {
//     navigate("/feed");
//   }
// };



//   if (loading) {
//     return <h1>Loading...</h1>;
//   }

//   return (
//     <main>
//       <div className="form-container">
//         <h1>Login</h1>

//         <form onSubmit={handleSubmit}>
//           <input
//             onChange={(e) => setEmail(e.target.value)}
//             type="email"
//             placeholder="Enter email"
//           />

//           <input
//             onChange={(e) => setPassword(e.target.value)}
//             type="password"
//             placeholder="Enter password"
//           />

//           <button className="button primary-button">Login</button>
//         </form>

//         <p>
//           Don't have an account? <Link to="/register">Create One.</Link>
//         </p>
//       </div>
//     </main>
//   );
// };

// export default Login;


import React, { useState, useEffect } from "react";
import "../style/form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { user, loading, handleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // ✅ Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleLogin(email, password);
  };

  // ✅ Auto Redirect After Login
  useEffect(() => {
    if (user) {
      navigate("/feed");
    }
  }, [user, navigate]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter email"
            value={email}
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter password"
            value={password}
          />

          <button
            type="submit"
            className="button primary-button"
          >
            Login
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Create One.</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;