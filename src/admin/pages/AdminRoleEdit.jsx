import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getRoleEditData,
    updateRole,
    removeUserFromRole
} from "../../services/adminService";


function AdminRoleEdit() {

    const navigate = useNavigate();
    const { roleid } = useParams();

    const pageTopRef = useRef(null);

    const [role, setRole] = useState(null);
    const [users, setUsers] = useState([]);

    const [rolename, setRolename] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [removingUserId, setRemovingUserId] = useState(null);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSystemRole, setIsSystemRole] = useState(false);


    useEffect(() => {

        async function fetchRole() {

            try {

                const data = await getRoleEditData(roleid);

                setRole(data.role);
                setUsers(data.users || []);
                setRolename(data.role.rolename || "");
                setIsSystemRole(Boolean(data.isSystemRole));

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);

            }

        }

        fetchRole();

    }, [roleid]);


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

        if (isSystemRole) {
            setError("Yerleşik roller düzenlenemez.");
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {

            const data = await updateRole(
                roleid,
                rolename
            );

            setRole(data.data);

            setSuccess(
                data.message || "Rol başarıyla güncellendi."
            );

        } catch (error) {

            setError(error.message);

        } finally {

            setSubmitting(false);

        }

    }


    async function handleRemoveUser(userid) {

        const confirmed = window.confirm(
            "Bu kullanıcıyı bu rolden çıkarmak istediğinize emin misiniz?"
        );

        if (!confirmed) {
            return;
        }

        setRemovingUserId(userid);
        setError(null);
        setSuccess(null);

        try {

            const data = await removeUserFromRole(
                roleid,
                userid
            );

            setUsers(previous =>
                previous.filter(
                    user => user.userid !== userid
                )
            );

            setSuccess(
                data.message ||
                "Kullanıcının rolü kaldırıldı."
            );

        } catch (error) {

            setError(error.message);

        } finally {

            setRemovingUserId(null);

        }

    }


    if (loading) {

        return (
            <div className="admin-page">

                <div className="admin-loading">
                    Rol bilgileri yükleniyor...
                </div>

            </div>
        );

    }


    if (!role) {

        return (
            <div className="admin-page">

                <div
                    className="admin-error"
                    ref={pageTopRef}
                >
                    {error || "Rol bulunamadı."}
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
                        Rol Düzenle
                    </h1>

                    <p>
                        Rol bilgilerini ve bu role bağlı
                        kullanıcıları buradan yönetebilirsiniz.
                    </p>

                </div>

            </div>


            {error && (

                <div className="admin-error">

                    {error}

                </div>

            )}


            {success && (

                <div className="admin-success">

                    {success}

                </div>

            )}


            <form
                className="admin-form"
                onSubmit={handleSubmit}
            >

                <div className="admin-form-group">

                    <label htmlFor="rolename">
                        Rol Adı
                    </label>

                    <input
                        id="rolename"
                        type="text"
                        value={rolename}
                        onChange={event =>
                            setRolename(
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
                            navigate("/admin/roles")
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


            <div className="admin-page">

                <div className="admin-page-header">

                    <div>

                        <h2>
                            Role Bağlı Kullanıcılar
                        </h2>

                        <p>
                            Bu role atanmış kullanıcılar: {users.length}
                        </p>

                    </div>


                </div>


                {users.length === 0 ? (

                    <div className="admin-empty">

                        Bu role atanmış kullanıcı bulunmuyor.

                    </div>

                ) : (

                    <div className="admin-blog-list">

                        {users.map(user => (

                            <article
                                className="admin-blog-card"
                                key={user.userid}
                            >

                                <div className="admin-blog-card-info">

                                    <h3>
                                        {user.fullname}
                                    </h3>

                                    <div className="admin-blog-card-meta">

                                        <span>
                                            ID: {user.userid}
                                        </span>

                                        <span>
                                            {user.email}
                                        </span>

                                    </div>

                                </div>


                                <div className="admin-actions-row">

                                    <button
                                        type="button"
                                        className="admin-edit-button"
                                        onClick={() => {
                                            // Kullanıcı edit sayfası
                                            // henüz hazır değil.
                                        }}
                                    >
                                        Kullanıcıya Git
                                    </button>


                                    <button
                                        type="button"
                                        className="admin-delete-button"
                                        onClick={() =>
                                            handleRemoveUser(
                                                user.userid
                                            )
                                        }
                                        disabled={
                                            removingUserId ===
                                            user.userid
                                        }
                                    >
                                        {removingUserId ===
                                        user.userid
                                            ? "Çıkarılıyor..."
                                            : "Rolden Çıkar"
                                        }
                                    </button>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </div>


            <div className="admin-form-actions">

                <button
                    type="button"
                    className="admin-primary-button"
                    onClick={() =>
                        navigate("/admin/roles")
                    }
                >
                    Rollere Dön
                </button>

            </div>

        </div>
    );

}


export default AdminRoleEdit;