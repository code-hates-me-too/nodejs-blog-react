import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProfile } from "../../services/profileService";


function Profile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {

        async function fetchProfile() {
            try {
                const data = await getProfile();
                setProfile(data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();

    }, []);


    if (loading) {
        return (
            <div className="page">
                <div className="loading">Profil yükleniyor...</div>
            </div>
        );
    }


    return (
        <div className="page">

            {error && (
                <div className="admin-error">
                    {error}
                </div>
            )}


            {profile && (

                <section className="profile-page">

                    <div className="profile-header">

                        <div className="profile-avatar">

                            {profile.avatar ? (
                                <img
                                    src={`http://localhost:3000/static/avatars/${profile.avatar}`}
                                    alt={profile.username}
                                />
                            ) : (
                                <span>
                                    {profile.username?.charAt(0)?.toUpperCase() || "?"}
                                </span>
                            )}

                        </div>


                        <div className="profile-main">

                            <div className="profile-heading">

                                <div>
                                    <span className="profile-username">
                                        @{profile.username || "kullanici-adi-secilmedi"}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className="profile-edit-button"
                                    onClick={() => navigate("/profile/edit")}
                                >
                                    Düzenle
                                </button>

                            </div>

                            <p className="profile-bio">
                                {profile.bio || "Henüz bir biyografi eklenmemiş."}
                            </p>

                        </div>

                    </div>


                    <div className="profile-divider"></div>


                    <div className="profile-content">
                        {/* rozetler, favori/beğenilen yazılar ileride buraya eklenecek */}
                    </div>

                </section>

            )}

        </div>
    );

}

export default Profile;