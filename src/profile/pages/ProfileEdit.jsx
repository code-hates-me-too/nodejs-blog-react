import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";

import {
    getProfile,
    updateProfile,
    uploadAvatar
} from "../../services/profileService";
import { checkUsername } from "../../services/authService";
import { getCroppedImageBlob } from "../../helpers/cropImage";

const USERNAME_ALLOWED_REGEX = /^[a-z0-9_-]*$/;

function ProfileEdit() {

    const navigate = useNavigate();
    const pageTopRef = useRef(null);

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState(null);

    const [originalUsername, setOriginalUsername] = useState("");
    const [originalBio, setOriginalBio] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [usernameStatus, setUsernameStatus] = useState("idle");
    const [usernameMessage, setUsernameMessage] = useState(
        "3-30 karakter, küçük harf, rakam, alt çizgi (_) ve tire (-) kullanılabilir."
    );

    // ============ KIRPMA MODALI STATE'LERİ ============
    const [cropImageSrc, setCropImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);


    useEffect(() => {

        async function fetchProfile() {
            try {
                const data = await getProfile();
                setUsername(data.data.username || "");
                setOriginalUsername(data.data.username || "");
                setBio(data.data.bio || "");
                setOriginalBio(data.data.bio || "");
                setAvatar(data.data.avatar || null);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();

    }, []);


    function handleUsernameChange(event) {
        const raw = event.target.value.toLowerCase();
        const sanitized = raw
            .split("")
            .filter(char => USERNAME_ALLOWED_REGEX.test(char))
            .join("")
            .slice(0, 30);
        setUsername(sanitized);
    }


    useEffect(() => {

        if (username === originalUsername) {
            setUsernameStatus("idle");
            setUsernameMessage("3-30 karakter, küçük harf, rakam, alt çizgi (_) ve tire (-) kullanılabilir.");
            return;
        }

        if (!username || username.length < 3) {
            setUsernameStatus("invalid");
            setUsernameMessage("Kullanıcı adı en az 3 karakter olmalıdır.");
            return;
        }

        setUsernameStatus("checking");
        setUsernameMessage("Kontrol ediliyor...");

        const timeoutId = setTimeout(async () => {
            try {
                const data = await checkUsername(username);
                setUsernameStatus(data.available ? "available" : "taken");
                setUsernameMessage(data.message);
            } catch (err) {
                setUsernameStatus("invalid");
                setUsernameMessage(err.message);
            }
        }, 500);

        return () => clearTimeout(timeoutId);

    }, [username, originalUsername]);


    // ============ FOTOĞRAF SEÇİLDİĞİNDE: DOSYA DEĞİL, ÖNCE KIRPMA MODALI AÇILIR ============
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setCropImageSrc(reader.result);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
        };
        reader.readAsDataURL(file);

        // aynı dosyayı tekrar seçebilmek için input'u sıfırla
        event.target.value = "";
    }


    const onCropComplete = useCallback((_, pixels) => {
        setCroppedAreaPixels(pixels);
    }, []);


    async function handleCropConfirm() {

        setUploadingAvatar(true);
        setError(null);
        setSuccess(null);

        try {
            const blob = await getCroppedImageBlob(cropImageSrc, croppedAreaPixels);
            const data = await uploadAvatar(blob);
            setAvatar(data.data.avatar);
            setSuccess("Profil fotoğrafı güncellendi.");
            setCropImageSrc(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploadingAvatar(false);
        }
    }


    function handleCropCancel() {
        setCropImageSrc(null);
    }


    // ============ DEĞİŞİKLİK TAKİBİ ============
    const hasChanges = username !== originalUsername || bio !== originalBio;
    const usernameChanged = username !== originalUsername;
    const bioChanged = bio !== originalBio;


    async function handleSubmit(event) {

        event.preventDefault();

        if (usernameChanged && usernameStatus !== "available") {
            setError("Lütfen müsait bir kullanıcı adı seçin.");
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            await updateProfile({ username, bio });
            setOriginalUsername(username);
            setOriginalBio(bio);
            setSuccess("Profil bilgileri güncellendi.");

            setTimeout(() => {
                pageTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 0);

        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }


    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-loading">Profil yükleniyor...</div>
            </div>
        );
    }


    return (
        <div className="admin-page">

            <div className="admin-page-header" ref={pageTopRef}>
                <div>
                    <h1>Profili Düzenle</h1>
                    <p>Kullanıcı adını, biyografini ve fotoğrafını buradan güncelleyebilirsin.</p>
                </div>
            </div>

            {success && <div className="admin-success">{success}</div>}
            {error && <div className="admin-error">{error}</div>}


            {/* ============ KIRPMA MODALI ============ */}
            {cropImageSrc && (
                <div className="crop-modal-overlay">
                    <div className="crop-modal">

                        <div className="crop-container">
                            <Cropper
                                image={cropImageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={event => setZoom(Number(event.target.value))}
                            className="crop-zoom-slider"
                        />

                        <div className="admin-form-actions">
                            <button
                                type="button"
                                className="admin-secondary-button"
                                onClick={handleCropCancel}
                                disabled={uploadingAvatar}
                            >
                                Vazgeç
                            </button>
                            <button
                                type="button"
                                className="admin-primary-button"
                                onClick={handleCropConfirm}
                                disabled={uploadingAvatar}
                            >
                                {uploadingAvatar ? "Yükleniyor..." : "Kaydet ve Yükle"}
                            </button>
                        </div>

                    </div>
                </div>
            )}


            {/* ============ AVATAR ÖNİZLEME + SEÇ BUTONU ============ */}
            <div className="admin-form-group avatar-upload-box">
                <span className="admin-form-label">Profil Fotoğrafı</span>

                <div className="profile-avatar-preview">
                    {avatar ? (
                        <img src={`http://localhost:3000/static/avatars/${avatar}`} alt="Profil fotoğrafı" />
                    ) : (
                        <span>{username?.charAt(0)?.toUpperCase() || "?"}</span>
                    )}
                </div>

                <label className="admin-secondary-button avatar-select-label">
                    Fotoğraf Seç
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: "none" }}
                    />
                </label>
            </div>


            <form className="admin-form" onSubmit={handleSubmit}>

                <div className={`admin-form-group ${usernameChanged ? "field-changed" : ""}`}>
                    <label htmlFor="username">Kullanıcı Adı</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                    />
                    <p className={
                        usernameStatus === "available" ? "username-hint username-hint-success" :
                        usernameStatus === "taken" || usernameStatus === "invalid" ? "username-hint username-hint-error" :
                        "username-hint"
                    }>
                        {usernameMessage}
                    </p>
                </div>

                <div className={`admin-form-group ${bioChanged ? "field-changed" : ""}`}>
                    <label htmlFor="bio">Biyografi</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={event => setBio(event.target.value)}
                        maxLength={500}
                        rows={4}
                    />
                    <p className="username-hint">{bio.length}/500</p>
                </div>

                <div className="admin-form-actions">
                    <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() => navigate("/profile")}
                    >
                        Vazgeç
                    </button>

                    <button
                        type="submit"
                        className="admin-primary-button"
                        disabled={
                            submitting ||
                            !hasChanges ||
                            (usernameChanged && usernameStatus !== "available")
                        }
                    >
                        {submitting
                            ? "Kaydediliyor..."
                            : hasChanges
                                ? "Değişiklikleri Kaydet"
                                : "Değişiklik Yok"
                        }
                    </button>
                </div>

            </form>

        </div>
    );
}

export default ProfileEdit;