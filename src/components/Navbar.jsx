import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    const isAdmin = user?.roles?.includes("admin");

    return (
        <nav className="navbar-body2">

            <div className="navbar-container">

                <Link to="/" className="navbar-brand">
                    BlogApp
                </Link>


                <div className="navbar-links">

                    <Link to="/">
                        Anasayfa
                    </Link>

                    <Link to="/blogs">
                        Bloglar
                    </Link>

                </div>


                <div className="navbar-links navbar-links-right">

                    {!isAuthenticated && (
                        <Link to="/account/login">
                            Giriş
                        </Link>
                    )}

                    {!isAuthenticated && (
                        <Link to="/account/register">
                            Kayıt
                        </Link>
                    )}


                    {isAuthenticated && (
                        <>
                            <span className="navbar-user">
                                {user.fullname}
                            </span>

                            {isAdmin && (
                                <Link to="/admin">
                                    Admin
                                </Link>
                            )}

                            <button
                                type="button"
                                className="navbar-logout"
                                onClick={handleLogout}
                            >
                                Çıkış
                            </button>
                        </>
                    )}

                </div>

            </div>

        </nav>
    );
}

export default Navbar;