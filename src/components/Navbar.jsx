import { Link } from "react-router-dom";

function Navbar() {
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

                <Link
                    to="/account/login"
                    className="navbar-login"
                >
                    Giriş
                </Link>

            </div>
        </nav>
    );
}

export default Navbar;