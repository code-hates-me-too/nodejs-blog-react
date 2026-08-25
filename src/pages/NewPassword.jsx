import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    validateResetToken,
    updatePassword
} from "../services/authService";

function NewPassword() {

    const { token } = useParams();
    const navigate = useNavigate();

    const [userid, setUserid] = useState(null);

    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


    useEffect(() => {

        async function checkToken() {

            try {

                const data = await validateResetToken(token);

                setUserid(data.userid);

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);

            }
        }

        checkToken();

    }, [token]);


    async function handleSubmit(event) {

        event.preventDefault();

        setError(null);

        if (password !== passwordAgain) {
            setError("Parolalar eşleşmiyor.");
            return;
        }

        setSaving(true);

        try {

            const data = await updatePassword(
                token,
                userid,
                password
            );

            setSuccess(data.message);

            setTimeout(() => {
                navigate("/account/login");
            }, 1500);

        } catch (error) {

            setError(error.message);

        } finally {

            setSaving(false);

        }
    }


    if (loading) {
        return (
            <div className="auth-page">
                <div className="auth-box">
                    <h1>Bağlantı kontrol ediliyor...</h1>
                </div>
            </div>
        );
    }


    if (error && !userid) {
        return (
            <div className="auth-page">

                <div className="auth-box">

                    <h1>Parola Yenileme</h1>

                    <p className="auth-error">
                        {error}
                    </p>

                    <Link
                        to="/account/reset-password"
                        className="auth-secondary-link"
                    >
                        Yeni bağlantı iste
                    </Link>

                </div>

            </div>
        );
    }


    return (
        <div className="auth-page">

            <div className="auth-box">

                <h1>Yeni Parola</h1>

                <p className="auth-description">
                    Yeni parolanızı belirleyin.
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

                {!success && (
                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label htmlFor="password">
                                Yeni Parola
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                minLength={7}
                                maxLength={24}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="passwordAgain">
                                Yeni Parola Tekrar
                            </label>

                            <input
                                id="passwordAgain"
                                type="password"
                                value={passwordAgain}
                                onChange={(event) =>
                                    setPasswordAgain(event.target.value)
                                }
                                minLength={7}
                                maxLength={24}
                                required
                            />

                        </div>


                        <button
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Güncelleniyor..."
                                : "Parolayı Güncelle"
                            }
                        </button>

                    </form>
                )}

            </div>

        </div>
    );
}

export default NewPassword;