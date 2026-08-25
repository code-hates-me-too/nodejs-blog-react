import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../services/authService";

function ResetPassword() {

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


    async function handleSubmit(event) {

        event.preventDefault();

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {

            const data = await resetPassword(email);

            setSuccess(data.message);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }
    }


    return (
        <div className="auth-page">

            <div className="auth-box">

                <h1>Parolamı Unuttum</h1>

                <p className="auth-description">
                    Hesabınıza kayıtlı email adresinizi girin.
                    Parola sıfırlama bağlantısını size göndereceğiz.
                </p>

                {error && (
                    <p className="auth-error">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="auth-success">
                        {success}
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
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Gönderiliyor..."
                            : "Sıfırlama Bağlantısı Gönder"
                        }
                    </button>

                </form>

                <Link
                    to="/account/login"
                    className="auth-secondary-link"
                >
                    Giriş sayfasına dön
                </Link>

            </div>

        </div>
    );
}

export default ResetPassword;