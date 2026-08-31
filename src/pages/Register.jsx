import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerRequest, checkUsername } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const USERNAME_ALLOWED_REGEX = /^[a-z0-9_-]*$/;

function Register() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 'idle' | 'checking' | 'available' | 'taken' | 'invalid'
    const [usernameStatus, setUsernameStatus] = useState("idle");
    const [usernameMessage, setUsernameMessage] = useState(
        "3-30 karakter, küçük harf, rakam, alt çizgi (_) ve tire (-) kullanılabilir."
    );


    /*
     * =========================================================
     * KULLANICI ADI YAZIMINI SINIRLA
     * İzin verilmeyen karakterler hiç input'a girmiyor.
     * =========================================================
     */

    function handleUsernameChange(event) {

        const raw = event.target.value.toLowerCase();

        // sadece izin verilen karakterleri bırak, geri kalanını at
        const sanitized = raw
            .split("")
            .filter(char => USERNAME_ALLOWED_REGEX.test(char))
            .join("")
            .slice(0, 30);

        setUsername(sanitized);
    }


    /*
     * =========================================================
     * DEBOUNCE İLE MÜSAİTLİK KONTROLÜ
     * Kullanıcı yazmayı 500ms durdurunca API'ye sorulur.
     * =========================================================
     */

    useEffect(() => {

        if (!username) {
            setUsernameStatus("idle");
            setUsernameMessage(
                "3-30 karakter, küçük harf, rakam, alt çizgi (_) ve tire (-) kullanılabilir."
            );
            return;
        }

        if (username.length < 3) {
            setUsernameStatus("invalid");
            setUsernameMessage("Kullanıcı adı en az 3 karakter olmalıdır.");
            return;
        }

        setUsernameStatus("checking");
        setUsernameMessage("Kontrol ediliyor...");

        const timeoutId = setTimeout(async () => {

            try {

                const data = await checkUsername(username);

                if (data.available) {
                    setUsernameStatus("available");
                    setUsernameMessage(data.message || "Kullanıcı adı müsait.");
                } else {
                    setUsernameStatus("taken");
                    setUsernameMessage(data.message || "Bu kullanıcı adı kullanılıyor.");
                }

            } catch (err) {
                setUsernameStatus("invalid");
                setUsernameMessage(err.message);
            }

        }, 500);

        // kullanıcı yazmaya devam ederse önceki zamanlayıcıyı iptal et
        return () => clearTimeout(timeoutId);

    }, [username]);


    async function handleSubmit(event) {

        event.preventDefault();

        if (usernameStatus !== "available") {
            setError("Lütfen müsait bir kullanıcı adı seçin.");
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const data = await registerRequest(
                name,
                username,
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
        <div className="auth-page auth-page--start">

            <div className="auth-box">

                <h1>Kayıt Ol</h1>

                {error && (
                    <p className="auth-error">
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

                        <label htmlFor="username">
                            Kullanıcı Adı
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                            style={{
                                borderColor:
                                    usernameStatus === "available" ? "green" :
                                    usernameStatus === "taken" || usernameStatus === "invalid" ? "red" :
                                    undefined
                            }}
                        />

                        <p
                            className={
                                usernameStatus === "available" ? "username-hint username-hint-success" :
                                usernameStatus === "taken" || usernameStatus === "invalid" ? "username-hint username-hint-error" :
                                "username-hint"
                            }
                        >
                            {usernameMessage}
                        </p>

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
                        disabled={loading || usernameStatus !== "available"}
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