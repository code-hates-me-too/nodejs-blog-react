import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCategories } from "../services/blogService";

function Navbar() {

    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [categories, setCategories] = useState([]);
    const [menuAcik, setMenuAcik] = useState(false);
    const [menuSabit, setMenuSabit] = useState(false);

    const menuRef = useRef(null);


    useEffect(() => {
        getCategories()
            .then(data => setCategories(data.data || []))
            .catch(error => console.error("Kategoriler alınamadı:", error));
    }, []);


    useEffect(() => {

        function disariTiklandi(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuAcik(false);
                setMenuSabit(false);
            }
        }

        document.addEventListener("mousedown", disariTiklandi);
        return () => document.removeEventListener("mousedown", disariTiklandi);

    }, []);


    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    const isAdmin = user?.roles?.includes("admin");

    const anasayfaAktif = location.pathname === "/";
    const bloglarAktif = location.pathname === "/blogs";
    const kategorilerAktif = location.pathname.startsWith("/blogs/category");

    return (
        <nav className="nav-cubugu">

            <div className="nav-cubugu-ic">

                <Link to="/" className="nav-marka">
                    BlogApp
                </Link>


                <div className="nav-linkler">

                    <Link
                        to="/"
                        className={anasayfaAktif ? "nav-link aktif" : "nav-link"}
                    >
                        Anasayfa
                    </Link>

                    <Link
                        to="/blogs"
                        className={bloglarAktif ? "nav-link aktif" : "nav-link"}
                    >
                        Bloglar
                    </Link>

                    <div
                        className="nav-acilir-sarmalayici"
                        ref={menuRef}
                        onMouseEnter={() => setMenuAcik(true)}
                        onMouseLeave={() => {
                            if (!menuSabit) setMenuAcik(false);
                        }}
                    >

                        <button
                            type="button"
                            className={
                                kategorilerAktif
                                    ? "nav-acilir-tetik aktif"
                                    : "nav-acilir-tetik"
                            }
                            onClick={() => {
                                setMenuSabit(previous => !previous);
                                setMenuAcik(true);
                            }}
                        >
                            Kategoriler
                        </button>

                        {menuAcik && (

                            <div className="nav-acilir-menu">

                                {categories.map(category => (
                                    <Link
                                        key={category.categoryid}
                                        to={`/blogs/category/${category.url}`}
                                        className="nav-acilir-link"
                                        onClick={() => {
                                            setMenuAcik(false);
                                            setMenuSabit(false);
                                        }}
                                    >
                                        {category.categoryname}
                                    </Link>
                                ))}

                            </div>

                        )}

                    </div>

                </div>


                <div className="nav-sag">

                    {!isAuthenticated && (
                        <Link to="/account/login" className="nav-link">
                            Giriş
                        </Link>
                    )}

                    {!isAuthenticated && (
                        <Link to="/account/register" className="nav-link">
                            Kayıt
                        </Link>
                    )}


                    {isAuthenticated && (
                        <>
                            <Link to="/profile" className="nav-link">
                                {user.username}
                            </Link>

                            {isAdmin && (
                                <Link to="/admin" className="nav-link">
                                    Admin
                                </Link>
                            )}

                            <button
                                type="button"
                                className="nav-link"
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