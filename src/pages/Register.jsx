import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerRequest } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Register() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(event) {

        event.preventDefault();

        setLoading(true);
        setError(null);

        try {

            const data = await registerRequest(
                name,
                email,
                password
            );

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

                <h1>Kayıt Ol</h1>

                {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label htmlFor="name">
                            Ad Soyad
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
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
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Kayıt yapılıyor..."
                            : "Kayıt Ol"
                        }
                    </button>

                </form>


                <p className="auth-switch">
                    Zaten hesabın var mı?{" "}
                    <Link to="/account/login">
                        Giriş Yap
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Register;