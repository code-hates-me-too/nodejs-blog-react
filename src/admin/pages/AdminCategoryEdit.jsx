import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getCategoryEditData,
    updateCategory,
    removeBlogFromCategory
} from "../../services/adminService";


function AdminCategoryEdit() {

    const navigate = useNavigate();
    const { categoryid } = useParams();

    const pageTopRef = useRef(null);

    const [category, setCategory] = useState(null);
    const [blogs, setBlogs] = useState([]);

    const [baslik, setBaslik] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [removingBlogId, setRemovingBlogId] = useState(null);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [message, setMessage] = useState(null);


    useEffect(() => {

        async function fetchCategory() {

            try {

                const data =
                    await getCategoryEditData(categoryid);

                setCategory(data.category);
                setBlogs(data.blogs || []);
                setBaslik(
                    data.category.categoryname || ""
                );

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);

            }

        }

        fetchCategory();

    }, [categoryid]);


    useEffect(() => {

        if (!error && !success) {
            return;
        }

        setTimeout(() => {

            pageTopRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 0);

    }, [error, success]);


    async function handleSubmit(event) {

        event.preventDefault();

        if (!baslik.trim()) {

            setError(
                "Kategori adı boş bırakılamaz."
            );

            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {

            const data =
                await updateCategory(
                    categoryid,
                    baslik.trim()
                );

            setCategory(data.data);

            setMessage("Kategori başarıyla güncellendi.");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } catch (error) {

            setError(error.message);

        } finally {

            setSubmitting(false);

        }

    }


    async function handleRemoveBlog(blogid) {

        const confirmed = window.confirm(
            "Bu blogu kategoriden çıkarmak istediğinize emin misiniz?"
        );

        if (!confirmed) {
            return;
        }

        setRemovingBlogId(blogid);
        setError(null);
        setSuccess(null);

        try {

            const data =
                await removeBlogFromCategory(
                    categoryid,
                    blogid
                );

            setBlogs(previous =>
                previous.filter(
                    blog => blog.blogid !== blogid
                )
            );

            setMessage("Blog kategoriden çıkarıldı.");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } catch (error) {

            setError(error.message);

        } finally {

            setRemovingBlogId(null);

        }

    }


    if (loading) {

        return (
            <div className="admin-page">

                <div className="admin-loading">
                    Kategori bilgileri yükleniyor...
                </div>

            </div>
        );

    }


    return (
        <div className="admin-page">

            <div
                className="admin-page-header"
                ref={pageTopRef}
            >

                <div>

                    <h1>
                        Kategori Düzenle
                    </h1>

                    <p>
                        Kategori bilgilerini ve kategoriye bağlı
                        blogları buradan yönetebilirsiniz.
                    </p>

                </div>

            </div>


            {error && (

                <div className="admin-error">
                    {error}
                </div>

            )}

            {message && (
                <div className="admin-success">
                    {message}
                </div>
            )}

            <form
                className="admin-form"
                onSubmit={handleSubmit}
            >

                <div className="admin-form-group">

                    <label htmlFor="baslik">
                        Kategori Adı
                    </label>

                    <input
                        id="baslik"
                        type="text"
                        value={baslik}
                        onChange={event =>
                            setBaslik(
                                event.target.value
                            )
                        }
                        required
                    />

                </div>


                <div className="admin-form-actions">

                    <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() =>
                            navigate("/admin/categories")
                        }
                    >
                        Vazgeç
                    </button>


                    <button
                        type="submit"
                        className="admin-primary-button"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Kaydediliyor..."
                            : "Değişiklikleri Kaydet"
                        }
                    </button>

                </div>

            </form>


            <div className="admin-page-header admin-category-blogs-header">

                <div>

                    <h2>
                        Kategori Blogları
                    </h2>

                    <p>
                        Bu kategoriye bağlı {blogs.length} blog bulunuyor.
                    </p>

                </div>

            </div>


            <div className="admin-blog-list">

                {blogs.length === 0 ? (

                    <div className="admin-empty">
                        Bu kategoriye bağlı blog bulunmuyor.
                    </div>

                ) : (

                    blogs.map(blog => (

                        <article
                            className="admin-blog-card"
                            key={blog.blogid}
                        >

                            <div className="admin-blog-card-image">

                                {blog.resim && (

                                    <a
                                        href={`/blogs/${blog.url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <img
                                            src={`http://localhost:3000/static/images/${blog.resim}`}
                                            alt={blog.baslik}
                                        />
                                    </a>

                                )}

                            </div>


                            <div className="admin-blog-card-info">

                                <h2>
                                    {blog.baslik}
                                </h2>


                                {blog.altbaslik && (

                                    <p>
                                        {blog.altbaslik}
                                    </p>

                                )}

                            </div>


                            <div className="admin--blog-card-info">

                                <span>
                                    ID: {blog.blogid}
                                </span>

                                <span>
                                    Yazar: {blog.userid}
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


                            <div className="admin-blog-card-actions">

                                <button
                                    type="button"
                                    className="admin-edit-button"
                                    onClick={() =>
                                        navigate(
                                            `/admin/blogs/edit/${blog.blogid}`
                                        )
                                    }
                                >
                                    Düzenle
                                </button>


                                <button
                                    type="button"
                                    className="admin-delete-button"
                                    onClick={() =>
                                        handleRemoveBlog(
                                            blog.blogid
                                        )
                                    }
                                    disabled={
                                        removingBlogId ===
                                        blog.blogid
                                    }
                                >
                                    {removingBlogId === blog.blogid
                                        ? "Çıkarılıyor..."
                                        : "Kategoriden Çıkar"
                                    }
                                </button>

                            </div>

                        </article>

                    ))

                )}

            </div>

                <div className="admin-form-actions">

                <button
                    type="button"
                    className="admin-primary-button"
                    onClick={() =>
                        navigate("/admin/categories")
                    }
                >
                    Kategorilere Dön
                </button>

            </div>
        </div>
    );

}


export default AdminCategoryEdit;