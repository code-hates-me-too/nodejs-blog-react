import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAdminCategories,
    deleteCategory
} from "../../services/adminService";


function AdminCategories() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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


    async function handleDelete(categoryid) {

        const confirmed = window.confirm(
            "Bu kategoriyi silmek istediğinize emin misiniz?"
        );

        if (!confirmed) {
            return;
        }

        setDeletingCategoryId(categoryid);
        setError(null);

        try {

            await deleteCategory(categoryid);

            setCategories(previous =>
                previous.filter(
                    category =>
                        category.categoryid !== categoryid
                )
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


                <button
                    type="button"
                    className="admin-primary-button"
                    onClick={() =>
                        navigate("/admin/categories/create")
                    }
                >
                    + Kategori Ekle
                </button>

            </div>


            {error && (

                <div className="admin-error">
                    {error}
                </div>

            )}


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

                                <span>
                                    ID: {category.categoryid}
                                </span>

                            </div>


                            <div className="admin-blog-card-actions">

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