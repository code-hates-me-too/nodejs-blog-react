import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "../services/authService";
import { useAuth } from "../context/AuthContext";


function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    async function handleSubmit(event) {

        event.preventDefault();

        setLoading(true);
        setError(null);

        try {

            const data = await loginRequest(email, password);

            login(data);

            navigate("/");

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }
    }


    return (
        <div className="login-page">

            <div className="login-box">

                <h1>Giriş Yap</h1>

                {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="password">
                            Parola
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Giriş yapılıyor..."
                            : "Giriş Yap"
                        }
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;