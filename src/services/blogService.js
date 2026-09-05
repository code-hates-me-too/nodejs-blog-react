const API_URL = "http://localhost:3000/api";

export async function getBlog(slug) {
    const response = await fetch(`${API_URL}/blogs/${slug}`);

    if (!response.ok) {
        throw new Error("Blog bulunamadı.");
    }

    return response.json();
}

export async function getCategories() {
    const response = await fetch(`${API_URL}/blogs/categories`);

    if (!response.ok) {
        throw new Error("Kategoriler alınamadı.");
    }

    return response.json();
}

export async function getBlogs(slug, page = 0, query = "") {

    let url = `${API_URL}/blogs?page=${page}`;

    if (slug) {
        url = `${API_URL}/blogs/category/${slug}?page=${page}`;
    }

    if (query) {
        url += `&ara=${encodeURIComponent(query)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Bloglar alınamadı.");
    }

    return response.json();
}
