import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";


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
        <div className="auth-page">

            <div className="auth-box">

                <h1>Giriş Yap</h1>

                {error && (
                    <p className="auth-error">
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

            <p className="auth-switch">
                <Link to="/account/reset-password">
                    Şifremi unuttum
                </Link>
            </p>     
            <p className="auth-switch">
                Hesabın yok mu?{" "}
                <Link to="/account/register">
                    Kayıt Ol
                </Link>
            </p>

            </div>

        </div>
    );
}

export default Login;