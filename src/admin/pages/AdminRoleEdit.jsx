import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getRoleEditData,
    updateRole,
    removeUserFromRole,
    searchUsersByUsername,
    addUserToRole
} from "../../services/adminService";


function AdminRoleEdit() {

    const navigate = useNavigate();
    const { roleid } = useParams();

    const pageTopRef = useRef(null);
    const searchWrapperRef = useRef(null);

    const [role, setRole] = useState(null);
    const [users, setUsers] = useState([]);

    const [rolename, setRolename] = useState("");
    const [originalRolename, setOriginalRolename] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [removingUserId, setRemovingUserId] = useState(null);
    const [addingUserId, setAddingUserId] = useState(null);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSystemRole, setIsSystemRole] = useState(false);

    // ============ KULLANICI ARAMA — kendi yerel state'i, genel error kutusuna karışmıyor ============
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);


    useEffect(() => {

        async function fetchRole() {

            try {

                const data = await getRoleEditData(roleid);

                setRole(data.role);
                setUsers(data.users || []);
                setRolename(data.role.rolename || "");
                setOriginalRolename(data.role.rolename || "");
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


    /*
     * =========================================================
     * DROPDOWN DIŞINA TIKLANINCA KAPAT
     * =========================================================
     */

    useEffect(() => {

        function handleClickOutside(event) {
            if (
                searchWrapperRef.current &&
                !searchWrapperRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);


    /*
     * =========================================================
     * KULLANICI ARAMA — debounce ile, yazma durunca çalışır
     * =========================================================
     */

    useEffect(() => {

        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            setSearching(false);
            setSearchError(null);
            return;
        }

        setSearching(true);
        setSearchError(null);

        const timeoutId = setTimeout(async () => {

            try {

                const results = await searchUsersByUsername(searchQuery.trim());

                const assignedIds = users.map(u => u.userid);
                const filtered = results.filter(
                    u => !assignedIds.includes(u.userid)
                );

                setSearchResults(filtered);
                setShowDropdown(true);

            } catch (err) {
                setSearchError(err.message);
            } finally {
                setSearching(false);
            }

        }, 400);

        return () => clearTimeout(timeoutId);

    }, [searchQuery, users]);


    async function handleAddUser(user) {

        setAddingUserId(user.userid);
        setSearchError(null);

        try {

            await addUserToRole(roleid, user.userid);

            setUsers(previous => [...previous, user]);

            setSearchResults(previous =>
                previous.filter(u => u.userid !== user.userid)
            );

            setSearchQuery("");
            setShowDropdown(false);

        } catch (err) {

            // Genel hata kutusuna değil, arama kutusunun kendi
            // hata alanına yazıyoruz — sayfa üste kaymasın.
            setSearchError(err.message);

        } finally {

            setAddingUserId(null);

        }

    }


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

            const data = await updateRole(roleid, rolename);

            setRole(data.data);

            setSuccess(data.message || "Rol başarıyla güncellendi.");

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

            const data = await removeUserFromRole(roleid, userid);

            setUsers(previous =>
                previous.filter(user => user.userid !== userid)
            );

            setSuccess(data.message || "Kullanıcının rolü kaldırıldı.");

        } catch (error) {

            setError(error.message);

        } finally {

            setRemovingUserId(null);

        }

    }


    function renderAvatar(user, sizeClass = "admin-mini-avatar") {
        return (
            <div className={sizeClass}>
                {user.avatar ? (
                    <img
                        src={`http://localhost:3000/static/avatars/${user.avatar}`}
                        alt={user.username}
                    />
                ) : (
                    <span>{user.username?.charAt(0)?.toUpperCase() || "?"}</span>
                )}
            </div>
        );
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
                <div className="admin-error" ref={pageTopRef}>
                    {error || "Rol bulunamadı."}
                </div>
            </div>
        );

    }


    return (
        <div className="admin-page">

            <div className="admin-page-header" ref={pageTopRef}>
                <div>
                    <h1>Rol Düzenle</h1>
                    <p>
                        Rol bilgilerini ve bu role bağlı
                        kullanıcıları buradan yönetebilirsiniz.
                    </p>
                </div>
            </div>


            {error && <div className="admin-error">{error}</div>}
            {success && <div className="admin-success">{success}</div>}


            {/* ============ ÜST İKİ SÜTUN: ROLÜ DÜZENLE + KULLANICI EKLE ============ */}
            <div className="admin-two-col">

                {/* --- ROLÜ DÜZENLE --- */}
                <div className="admin-page">

                    <div className="admin-page-header-alt">
                        <div>
                            <h3>Rolü Düzenle</h3>
                        </div>
                    </div>

                    <form className="admin-form" onSubmit={handleSubmit}>

                        <div className="admin-form-group">
                            <label htmlFor="rolename">Rol Adı</label>
                            <input
                                id="rolename"
                                type="text"
                                value={rolename}
                                onChange={event => setRolename(event.target.value)}
                                required
                            />
                        </div>

                        <div className="admin-actions-row-r">
                            <button
                                type="button"
                                className="admin-create-cancel"
                                onClick={() => setRolename(originalRolename)}
                            >
                                Vazgeç
                            </button>

                            <button
                                type="submit"
                                className="admin-create-submit"
                                disabled={submitting}
                            >
                                {submitting ? "Kaydediliyor..." : "Kaydet"}
                            </button>
                        </div>

                    </form>

                </div>


                {/* --- KULLANICI EKLE --- */}
                <div className="admin-page">

                    <div className="admin-page-header-alt">
                        <div>
                            <h3>Kullanıcı Ekle</h3>
                        </div>
                    </div>

                    <div className="admin-search-wrapper admin-form" ref={searchWrapperRef}>

                        <div className="admin-form-group">
                            <input
                                type="text"
                                placeholder="Kullanıcı adı ile ara..."
                                value={searchQuery}
                                onChange={event => {
                                    setSearchQuery(event.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => {
                                    if (searchResults.length > 0) setShowDropdown(true);
                                }}
                            />
                        </div>

                        {showDropdown && searchQuery.trim().length >= 2 && (

                            <div className="admin-search-dropdown">

                                {searching && (
                                    <div className="admin-search-loading">Aranıyor...</div>
                                )}

                                {!searching && searchResults.length === 0 && (
                                    <div className="admin-search-empty">Sonuç bulunamadı.</div>
                                )}

                                {!searching && searchResults.map(user => (

                                    <div className="admin-search-result" key={user.userid}>

                                        <div className="admin-search-result-info">
                                            {renderAvatar(user)}
                                            <span>@{user.username}</span>
                                        </div>

                                        <button
                                            type="button"
                                            className="admin-primary-button"
                                            onClick={() => handleAddUser(user)}
                                            disabled={addingUserId === user.userid}
                                        >
                                            {addingUserId === user.userid ? "..." : "Ekle"}
                                        </button>

                                    </div>

                                ))}

                            </div>

                        )}

                        {searchError && (
                            <p className="admin-search-error">{searchError}</p>
                        )}

                    </div>

                </div>

            </div>


            {/* ============ ROLE BAĞLI KULLANICILAR ============ */}
            <div className="admin-page">

                <div className="admin-page-header">
                    <div>
                        <h2>Role Bağlı Kullanıcılar</h2>
                        <p>Bu role atanmış kullanıcılar: {users.length}</p>
                    </div>
                </div>

                {users.length === 0 ? (

                    <div className="admin-empty">
                        Bu role atanmış kullanıcı bulunmuyor.
                    </div>

                ) : (

                    <div className="admin-blog-list">

                        {users.map(user => (

                            <article className="admin-blog-card" key={user.userid}>

                                <div className="admin-blog-card-info">
                                    <div className="admin-card-title-row">
                                        {renderAvatar(user)}
                                        <h2>@{user.username}</h2>
                                    </div>
                                </div>

                                <div className="admin--role-card-meta">
                                    <span>ID: {user.userid}</span>
                                    <span>{user.email}</span>
                                </div>

                                <div className="admin-actions-row">

                                    <button
                                        type="button"
                                        className="admin-edit-button"
                                        onClick={() => {
                                            // Kullanıcı edit sayfası henüz hazır değil.
                                        }}
                                    >
                                        Kullanıcıya Git
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-delete-button"
                                        onClick={() => handleRemoveUser(user.userid)}
                                        disabled={removingUserId === user.userid}
                                    >
                                        {removingUserId === user.userid ? "Çıkarılıyor..." : "Rolden Çıkar"}
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
                    onClick={() => navigate("/admin/roles")}
                >
                    Rollere Dön
                </button>
            </div>

        </div>
    );

}

export default AdminRoleEdit;