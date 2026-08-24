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