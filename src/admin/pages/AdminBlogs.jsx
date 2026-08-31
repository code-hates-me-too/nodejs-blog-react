import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
    getAdminBlogs,
    deleteBlog
} from "../../services/adminService";

function AdminBlogs() {

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingBlogId, setDeletingBlogId] = useState(null);

    const navigate = useNavigate();
    
    useEffect(() => {

        async function fetchBlogs() {

            try {

                const data = await getAdminBlogs();

                setBlogs(data);

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);

            }
        }

        fetchBlogs();

    }, []);

    async function handleDelete(blogid) {

        const confirmed = window.confirm(
            "Bu blogu silmek istediğinize emin misiniz?"
        );

        if (!confirmed) {
            return;
        }

        setDeletingBlogId(blogid);
        setError(null);

        try {

            await deleteBlog(blogid);

            setBlogs(previous =>
                previous.filter(
                    blog => blog.blogid !== blogid
                )
            );

        } catch (error) {

            setError(error.message);

        } finally {

            setDeletingBlogId(null);

        }
    }

    if (loading) {
        return (
            <div className="admin-page">

                <div className="admin-loading">
                    Bloglar yükleniyor...
                </div>

            </div>
        );
    }


    if (error) {
        return (
            <div className="admin-page">

                <div className="admin-error">
                    {error}
                </div>

            </div>
        );
    }


    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>

                    <h1>
                        Blogları Düzenle
                    </h1>

                    <p>
                        Mevcut blog yazılarını buradan yönetebilirsiniz.
                    </p>

                </div>


                <button
                    type="button"
                    className="admin-primary-button"
                    onClick={() => navigate("/admin/blogs/create")}
                >
                    + Blog Ekle
                </button>

            </div>


            <div className="admin-blog-list">

                {blogs.length === 0 ? (

                    <div className="admin-empty">
                        Henüz blog bulunmuyor.
                    </div>

                ) : (

                    blogs.map((blog) => (

                        <article
                            className="admin-blog-card"
                            key={blog.blogid}
                        >

                            <div className="admin-blog-card-image">

                                {blog.resim && (
                                    <Link to={`/blogs/${blog.url}`}>
                                        <img
                                            src={`http://localhost:3000/static/images/${blog.resim}`}
                                            alt={blog.baslik}
                                        />
                                    </Link>
                                )}

                            </div>


                            <div className="admin-blog-card-info">

                                <h2>
                                    <Link
                                        to={`/blogs/${blog.url}`}
                                        className="admin-blog-title-link"
                                    >
                                        {blog.baslik}
                                    </Link>
                                </h2>


                                {blog.altbaslik && (
                                    <p>
                                        {blog.altbaslik}
                                    </p>
                                )}


                                {blog.categories?.length > 0 ? (

                                    <div className="admin-blog-categories">

                                        {blog.categories.map((category) => (

                                            <span
                                                className="admin-blog-category"
                                                key={
                                                    category.BlogCategory.categoryid
                                                }
                                            >
                                                {category.categoryname}
                                            </span>

                                        ))}

                                    </div>

                                ) : (

                                    <span className="admin-blog-category">
                                        Kategori yok
                                    </span>

                                )}

                            </div>


                            <div className="admin-blog-card-infos">

                                <span>
                                    ID: {blog.blogid}
                                </span>

                                <span>
                                    Yazar: @{blog.user?.username}
                                </span>

                                <span>
                                    {blog.onay
                                        ? "Yayında"
                                        : "Onaysız"}
                                </span>

                                <span>
                                    Anasayfa: {blog.anasayfa
                                        ? "Evet"
                                        : "Hayır"}
                                </span>

                            </div>


                            <div className="admin-actions-row">

                                <button
                                    type="button"
                                    className="admin-edit-button"
                                    onClick={() =>
                                        navigate(`/admin/blogs/edit/${blog.blogid}`)
                                    }
                                >
                                    Düzenle
                                </button>


                                <button
                                    type="button"
                                    className="admin-delete-button"
                                    onClick={() => handleDelete(blog.blogid)}
                                    disabled={deletingBlogId === blog.blogid}
                                >
                                    {deletingBlogId === blog.blogid
                                        ? "Siliniyor..."
                                        : "Sil"
                                    }
                                </button>

                            </div>

                        </article>

                    ))

                )}

            </div>

        </div>
    );
}

export default AdminBlogs;

