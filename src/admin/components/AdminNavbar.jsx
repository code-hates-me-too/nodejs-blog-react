import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminNavbar() {

    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return null;
    }

    const roles = user.roles || [];

    const isAdmin = roles.includes("admin");
    const isModerator = roles.includes("moderator");

    if (!isAdmin && !isModerator) {
        return null;
    }

    return (
        <nav className="admin--navbar">

            <div className="admin-navbar-inner">

                <div className="admin-navbar-links">

                    <Link
                        to="/admin/blogs"
                        className={
                            location.pathname === "/admin/blogs"
                                ? "active"
                                : ""
                        }
                    >
                        Blogları Düzenle
                    </Link>


                    <Link
                        to="/admin/blogs/create"
                        className={
                            location.pathname === "/admin/blogs/create"
                                ? "active"
                                : ""
                        }
                    >
                        Blog Ekle
                    </Link>


                    {isAdmin && (
                        <>

                            <Link
                                to="/admin/categories"
                                className={
                                    location.pathname === "/admin/categories"
                                        ? "active"
                                        : ""
                                }
                            >
                                Kategoriler
                            </Link>

                            <Link
                                to="/admin/categories/create"
                                className={
                                    location.pathname === "/admin/categories/create"
                                        ? "active"
                                        : ""
                                }
                            >
                                Kategori Ekle
                            </Link>


                            <Link
                                to="/admin/users"
                                className={
                                    location.pathname === "/admin/users"
                                        ? "active"
                                        : ""
                                }
                            >
                                Kullanıcılar
                            </Link>

                        </>
                    )}

                </div>

            </div>

        </nav>
    );
}

export default AdminNavbar;