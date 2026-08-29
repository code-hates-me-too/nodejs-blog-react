import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
    getUserEditData,
    updateUser
} from "../../services/adminService";


function AdminUserEdit() {

    const navigate = useNavigate();
    const { userid } = useParams();
    const { user: currentUser } = useAuth();

    const pageTopRef = useRef(null);

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");

    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Bu kullanıcı, giriş yapmış olan kullanıcının kendisi mi?
    const isEditingSelf =
        currentUser &&
        String(currentUser.userid) === String(userid);


    useEffect(() => {

        async function fetchUser() {

            try {

                const data = await getUserEditData(userid);

                const user = data.user;

                setFullname(user.fullname || "");
                setEmail(user.email || "");

                setRoles(data.roles || []);

                setSelectedRoles(
                    user.roles?.map(role => role.roleid) || []
                );

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);

            }

        }

        fetchUser();

    }, [userid]);


    function handleRoleChange(role) {

        // Kendi admin rolünü kendinden kaldırmasını engelliyoruz.
        // Gerçek güvenlik backend'de, bu sadece kullanıcıyı
        // baştan yanlış bir işlemden caydırmak için.
        const isLockingSelfOut =
            isEditingSelf &&
            role.rolename === "admin" &&
            selectedRoles.includes(role.roleid);

        if (isLockingSelfOut) {
            setError("Kendi admin rolünüzü kendinizden kaldıramazsınız.");
            setTimeout(() => {
                pageTopRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 0);
            return;
        }

        setSelectedRoles(previous => {

            if (previous.includes(role.roleid)) {

                return previous.filter(
                    id => id !== role.roleid
                );

            }

            return [...previous, role.roleid];

        });

    }


    async function handleSubmit(event) {

        event.preventDefault();

        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {

            await updateUser(userid, {
                fullname,
                email,
                roles: selectedRoles
            });

            setSuccess(
                "Kullanıcı bilgileri başarıyla güncellendi."
            );

            setTimeout(() => {

                pageTopRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 0);

        } catch (error) {

            setError(error.message);

            setTimeout(() => {

                pageTopRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 0);

        } finally {

            setSubmitting(false);

        }

    }


    if (loading) {

        return (
            <div className="admin-page">

                <div className="admin-loading">
                    Kullanıcı bilgileri yükleniyor...
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
                        Kullanıcı Düzenle
                    </h1>

                    <p>
                        Kullanıcı bilgilerini ve rollerini düzenleyin.
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
                className="admin-form"
                onSubmit={handleSubmit}
            >

                <div className="admin-form-group">

                    <label htmlFor="fullname">
                        Kullanıcı Adı
                    </label>

                    <input
                        id="fullname"
                        type="text"
                        value={fullname}
                        onChange={event =>
                            setFullname(event.target.value)
                        }
                        required
                    />

                </div>


                <div className="admin-form-group">

                    <label htmlFor="email">
                        E-posta
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={event =>
                            setEmail(event.target.value)
                        }
                        required
                    />

                </div>


                <div className="admin-form-group">

                    <span className="admin-form-label">
                        Roller
                    </span>


                    <div className="admin--user-role-list">

                        {roles.length === 0 ? (

                            <div className="admin-empty">
                                Henüz rol bulunmuyor.
                            </div>

                        ) : (

                            roles.map(role => {

                                const isLockedRole =
                                    isEditingSelf &&
                                    role.rolename === "admin";

                                return (

                                    <label
                                        className="admin--user-role-option"
                                        key={role.roleid}
                                        title={
                                            isLockedRole
                                                ? "Kendi admin rolünüzü kaldıramazsınız."
                                                : undefined
                                        }
                                    >

                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedRoles.includes(
                                                    role.roleid
                                                )
                                            }
                                            disabled={isLockedRole}
                                            onChange={() =>
                                                handleRoleChange(role)
                                            }
                                        />

                                        <span>
                                            {role.rolename}
                                            {isLockedRole && " (kaldırılamaz)"}
                                        </span>

                                    </label>

                                );

                            })

                        )}

                    </div>

                </div>


                <div className="admin-form-actions">

                    <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() =>
                            navigate("/admin/users")
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

        </div>
    );

}


export default AdminUserEdit;