const API_URL = "http://localhost:3000/api";

export async function getProfile() {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Profil bilgileri alınamadı.");
    }

    return response.json();
}


export async function updatePassword({ currentPassword, newPassword }) {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/profile/password`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.errors?.join(", ") ||
            data.message ||
            "Parola güncellenemedi."
        );
    }

    return data;
}


export async function updateProfile({ username, bio }) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, bio })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.errors?.join(", ") || data.message || "Profil güncellenemedi."
        );
    }

    return data;
}


export async function uploadAvatar(blob) {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("avatar", blob, "avatar.jpg");

    const response = await fetch(`${API_URL}/profile/avatar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Fotoğraf yüklenemedi.");
    }

    return data;
}