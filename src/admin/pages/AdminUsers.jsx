import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAdminUsers
} from "../../services/adminService";


function AdminUsers() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {

        async function fetchUsers() {

            try {

                const data = await getAdminUsers();

                setUsers(data.data);

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);

            }

        }

        fetchUsers();

    }, []);

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
                    Kullanıcılar yükleniyor...
                </div>

            </div>
        );

    }


    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>

                    <h1>
                        Kullanıcılar
                    </h1>

                    <p>
                        Kullanıcıları ve rollerini buradan yönetebilirsiniz.
                    </p>

                </div>

            </div>


            {error && (

                <div className="admin-error">
                    {error}
                </div>

            )}


            <div className="admin--user-list">

                {users.length === 0 ? (

                    <div className="admin-empty">
                        Henüz kullanıcı bulunmuyor.
                    </div>

                ) : (

                    users.map(user => (

                        <article
                            className="admin--user-card"
                            key={user.userid}
                        >
                            

                            <div className="admin--user-info">

                                <div className="admin-blog-card-info">
                                    <div className="admin-card-title-row">
                                        {renderAvatar(user)}
                                        <h2>@{user.username}</h2>
                                    </div>
                                </div>
                                <br />
                                <h2>
                                    <i>{user.fullname}</i>
                                </h2>

                                <p>
                                    {user.email}
                                </p>

                            </div>


                            <div className="admin--user-meta">

                                <span>
                                    ID: {user.userid}
                                </span>

                                <div className="admin--user-roles">

                                    {user.roles?.length > 0 ? (

                                        user.roles.map(role => (

                                            <span
                                                className="admin--user-role"
                                                key={role.roleid}
                                            >
                                                {role.rolename}
                                            </span>

                                        ))

                                    ) : (

                                        <span className="admin--user-no-role">
                                            Rol yok
                                        </span>

                                    )}

                                </div>

                            </div>


                            <div className="admin-actions-row">

                                <button
                                    type="button"
                                    className="admin-edit-button"
                                    onClick={() =>
                                        navigate(
                                            `/admin/users/edit/${user.userid}`
                                        )
                                    }
                                >
                                    Düzenle
                                </button>

                            </div>

                        </article>

                    ))

                )}

            </div>

        </div>
    );

}


export default AdminUsers;