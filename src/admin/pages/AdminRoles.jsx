import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAdminRoles,
    createRole,
    deleteRole
} from "../../services/adminService";


function AdminRoles() {

    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);

    const [rolename, setRolename] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const [deletingRoleId, setDeletingRoleId] = useState(null);

    useEffect(() => {

        async function fetchRoles() {

            try {

                const data =
                    await getAdminRoles();

                setRoles(data);

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);

            }

        }

        fetchRoles();

    }, []);


    async function handleCreate(event) {

        event.preventDefault();

        if (!rolename.trim()) {

            setError(
                "Rol adı boş bırakılamaz."
            );

            return;
        }

        setSubmitting(true);
        setError(null);
        setMessage(null);

        try {

            const data =
                await createRole(
                    rolename.trim()
                );

            setRoles(previous => [
                ...previous,
                data.data
            ]);

            setRolename("");

            setMessage(
                data.message || "Rol eklendi."
            );

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

    async function handleDelete(roleid) {

        const confirmed = window.confirm(
            "Bu rolü silmek istediğinize emin misiniz?"
        );

        if (!confirmed) {
            return;
        }

        setDeletingRoleId(roleid);
        setError(null);
        setMessage(null);

        try {

            const data = await deleteRole(roleid);

            setRoles(previous =>
                previous.filter(
                    role => role.roleid !== roleid
                )
            );

            setMessage(
                data.message || "Rol silindi."
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } catch (error) {

            setError(error.message);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } finally {

            setDeletingRoleId(null);

        }
    }


    if (loading) {

        return (
            <div className="admin-page">

                <div className="admin-loading">
                    Roller yükleniyor...
                </div>

            </div>
        );

    }


    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>

                    <h1>
                        Roller
                    </h1>

                    <p>
                        Kullanıcı rollerini buradan yönetebilirsiniz.
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
                className="admin-create-form"
                onSubmit={handleCreate}
            >

                <div className="admin-create-field">

                    <label htmlFor="rolename">
                        Rol Ekle
                    </label>

                    <input
                        id="rolename"
                        type="text"
                        value={rolename}
                        onChange={event =>
                            setRolename(event.target.value)
                        }
                        placeholder="Rol adı"
                        required
                    />

                </div>


                <div className="admin-create-actions">

                    <button
                        type="button"
                        className="admin-create-cancel"
                        onClick={() => setRolename("")}
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
                        Mevcut Roller
                    </h1>

                </div>

            </div> */}


            <div className="admin--role-list">

                {roles.length === 0 ? (

                    <div className="admin-empty">
                        Henüz rol bulunmuyor.
                    </div>

                ) : (

                    roles.map(role => (

                        <article
                            className="admin-blog-card"
                            key={role.roleid}
                        >

                            <div className="admin-blog-card-info">

                                <h2>
                                    {role.rolename}
                                    {role.isSystemRole && (
                                        <span className="admin-badge"> (Yerleşik)</span>
                                    )}
                                </h2>

                            </div>


                            <div className="admin--role-card-meta">

                                <span>
                                    ID: {role.roleid}
                                </span>

                                <span>
                                    Kullanıcı: {role.user_count || 0}
                                </span>

                            </div>


                            <div className="admin-blog-card-actions">

                                <button
                                    type="button"
                                    className="admin-edit-button"
                                    onClick={() =>
                                        navigate(
                                            `/admin/roles/edit/${role.roleid}`
                                        )
                                    }
                                >
                                    {role.isSystemRole ? "Görüntüle" : "Düzenle"}
                                </button>


                                {!role.isSystemRole && (
                                    <button
                                        type="button"
                                        className="admin-delete-button"
                                        onClick={() =>
                                            handleDelete(role.roleid)
                                        }
                                        disabled={
                                            deletingRoleId === role.roleid
                                        }
                                    >
                                        {deletingRoleId === role.roleid
                                            ? "Siliniyor..."
                                            : "Sil"
                                        }
                                    </button>
                                )}

                            </div>

                        </article>

                    ))

                )}

            </div>

        </div>
    );

}


export default AdminRoles;