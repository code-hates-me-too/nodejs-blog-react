import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAdminCategories,
    deleteCategory,
    createCategory
} from "../../services/adminService";


function AdminCategories() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [baslik, setBaslik] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [deletingCategoryId, setDeletingCategoryId] = useState(null);


    useEffect(() => {

        async function fetchCategories() {

            try {

                const data = await getAdminCategories();

                setCategories(data.categories);

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);

            }

        }

        fetchCategories();

    }, []);


    async function handleCreate(event) {

        event.preventDefault();

        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {

            const data = await createCategory(baslik);

            setCategories(previous => [
                ...previous,
                data.data
            ]);

            setBaslik("");

            setSuccess(
                data.message || "Kategori oluşturuldu."
            );

        } catch (error) {

            setError(error.message);

        } finally {

            setSubmitting(false);

        }

    }


    async function handleDelete(categoryid) {

        const confirmed = window.confirm(
            "Bu kategoriyi silmek istediğinize emin misiniz?"
        );

        if (!confirmed) {
            return;
        }

        setDeletingCategoryId(categoryid);
        setError(null);
        setSuccess(null);

        try {

            await deleteCategory(categoryid);

            setCategories(previous =>
                previous.filter(
                    category =>
                        category.categoryid !== categoryid
                )
            );

            setSuccess(
                "Kategori silindi."
            );

        } catch (error) {

            setError(error.message);

        } finally {

            setDeletingCategoryId(null);

        }

    }


    if (loading) {

        return (
            <div className="admin-page">

                <div className="admin-loading">
                    Kategoriler yükleniyor...
                </div>

            </div>
        );

    }


    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>

                    <h1>
                        Kategoriler
                    </h1>

                    <p>
                        Blog kategorilerini buradan yönetebilirsiniz.
                    </p>

                </div>

            </div>


            {success && (

                <div className="admin-success">
                    {success}
                </div>

            )}


            {error && (

                <div className="admin-error">
                    {error}
                </div>

            )}


            <form
                className="admin-create-form"
                onSubmit={handleCreate}
            >

                <div className="admin-create-field">

                    <label htmlFor="categoryname">
                        Kategori Ekle
                    </label>

                    <input
                        id="categoryname"
                        type="text"
                        value={baslik}
                        onChange={event =>
                            setBaslik(event.target.value)
                        }
                        placeholder="Kategori adı"
                        required
                    />

                </div>


                <div className="admin-actions-row">

                    <button
                        type="button"
                        className="admin-create-cancel"
                        onClick={() => setBaslik("")}
                        disabled={submitting}
                    >
                        Vazgeç
                    </button>


                    <button
                        type="submit"
                        className="admin-create-submit"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Ekleniyor..."
                            : "Ekle"
                        }
                    </button>

                </div>

            </form>

            {/* <div className="admin-page-header">

                <div>

                    <h1>
                        Mevcut Kategoriler
                    </h1>

                </div>

            </div> */}

            <div className="admin-blog-list">

                {categories.length === 0 ? (

                    <div className="admin-empty">
                        Henüz kategori bulunmuyor.
                    </div>

                ) : (

                    categories.map(category => (

                        <article
                            className="admin-blog-card"
                            key={category.categoryid}
                        >

                            <div className="admin-blog-card-info">

                                <h2>
                                    {category.categoryname}
                                </h2>

                            </div>


                            <div className="admin--role-card-meta">

                                <span>
                                    ID: {category.categoryid}
                                </span>
                                <span>
                                    Blog: {category.blog_count || 0}
                                </span>

                            </div>


                            <div className="admin-actions-row">

                                <button
                                    type="button"
                                    className="admin-edit-button"
                                    onClick={() =>
                                        navigate(
                                            `/admin/categories/edit/${category.categoryid}`
                                        )
                                    }
                                >
                                    Düzenle
                                </button>


                                <button
                                    type="button"
                                    className="admin-delete-button"
                                    onClick={() =>
                                        handleDelete(
                                            category.categoryid
                                        )
                                    }
                                    disabled={
                                        deletingCategoryId ===
                                        category.categoryid
                                    }
                                >
                                    {deletingCategoryId ===
                                    category.categoryid
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


export default AdminCategories;