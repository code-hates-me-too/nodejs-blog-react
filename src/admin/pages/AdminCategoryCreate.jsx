import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createCategory } from "../../services/adminService";


function AdminCategoryCreate() {

    const navigate = useNavigate();

    const [baslik, setBaslik] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);


    async function handleSubmit(event) {

        event.preventDefault();

        setSubmitting(true);
        setError(null);


        try {

            await createCategory(baslik);

            navigate("/admin/categories");

        } catch (error) {

            setError(error.message);

        } finally {

            setSubmitting(false);

        }

    }


    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>

                    <h1>
                        Kategori Ekle
                    </h1>

                    <p>
                        Yeni bir blog kategorisi oluşturun.
                    </p>

                </div>

            </div>


            {error && (
                <div className="admin-error">
                    {error}
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
                            setBaslik(event.target.value)
                        }
                        placeholder="Kategori adı"
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
                            ? "Oluşturuluyor..."
                            : "Kategori Oluştur"
                        }
                    </button>

                </div>

            </form>

        </div>
    );
}


export default AdminCategoryCreate;