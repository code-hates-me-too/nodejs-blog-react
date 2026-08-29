import { useEffect, useState } from "react";

import {
    getProfile
} from "../services/profileService";


function Profile() {

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
            <div className="admin-page">

                <div className="admin-loading">
                    Profil yükleniyor...
                </div>

            </div>
        );

    }


    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>

                    <h1>
                        Profilim
                    </h1>

                    <p>
                        Hesap bilgilerinizi buradan görüntüleyebilirsiniz.
                    </p>

                </div>

            </div>


            {error && (

                <div className="admin-error">
                    {error}
                </div>

            )}


            {profile && (

                <article className="profile-card">

                    <div className="profile-card-info">

                        <div className="profile-field">

                            <span className="profile-field-label">
                                Kullanıcı Adı
                            </span>

                            <span className="profile-field-value">
                                {profile.fullname}
                            </span>

                        </div>


                        <div className="profile-field">

                            <span className="profile-field-label">
                                E-posta
                            </span>

                            <span className="profile-field-value">
                                {profile.email}
                            </span>

                        </div>


                        <div className="profile-field">

                            <span className="profile-field-label">
                                Kullanıcı ID
                            </span>

                            <span className="profile-field-value">
                                {profile.userid}
                            </span>

                        </div>


                        <div className="profile-field">

                            <span className="profile-field-label">
                                Kayıt Tarihi
                            </span>

                            <span className="profile-field-value">
                                {new Date(
                                    profile.createdAt
                                ).toLocaleDateString("tr-TR")}
                            </span>

                        </div>

                    </div>

                </article>

            )}

        </div>
    );

}


export default Profile;