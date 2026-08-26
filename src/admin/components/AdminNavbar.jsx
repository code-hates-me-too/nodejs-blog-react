import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminNavbar() {

    const { user } = useAuth();

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
        <nav className="admin-navbar">

            <div className="admin-navbar-inner">

                <div className="admin-navbar-links">

                    <Link to="/admin/blogs/create">
                        Blog Ekle
                    </Link>

                    <Link to="/admin/blogs">
                        Blogları Düzenle
                    </Link>


                    {isAdmin && (
                        <>
                            <Link to="/admin/categories">
                                Kategoriler
                            </Link>

                            <Link to="/admin/users">
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