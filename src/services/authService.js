const API_URL = "http://localhost:3000/api";

export async function login(email, password) {

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Giriş yapılamadı."
        );
    }

    return data;
}


export async function register(name, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        if (data.errors && data.errors.length > 0) {
            throw new Error(data.errors.join(" "));
        }

        throw new Error(data.message || "Kayıt başarısız.");
    }

    return data;
}

export async function resetPassword(email) {

    const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Parola sıfırlama isteği başarısız."
        );
    }

    return data;
}


export async function validateResetToken(token) {

    const response = await fetch(
        `${API_URL}/auth/new-password/${token}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Parola sıfırlama bağlantısı geçersiz."
        );
    }

    return data;
}


export async function updatePassword(token, userid, password) {

    const response = await fetch(`${API_URL}/auth/new-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token,
            userid,
            password
        })
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


export function getToken() {

    return localStorage.getItem("token");
}


export function getUser() {

    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}


export function saveAuth(token, user) {

    localStorage.setItem("token", token);

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );
}


export function clearAuth() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");
}


export async function logout() {

    const token = getToken();

    if (token) {

        const response = await fetch(
            `${API_URL}/auth/logout`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Çıkış yapılamadı.");
        }
    }

    clearAuth();
}