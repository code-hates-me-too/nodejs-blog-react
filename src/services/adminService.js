const API_URL = "http://localhost:3000/api";

export async function getAdminBlogs() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/blogs`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Bloglar yüklenemedi."
        );
    }

    return data.data;
}


export async function getBlogCreateData() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/blogs/create`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Blog oluşturma bilgileri alınamadı."
        );
    }

    return data;
}


export async function createBlog(blogData) {

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("baslik", blogData.baslik);
    formData.append("altbaslik", blogData.altbaslik);
    formData.append("aciklama", blogData.aciklama);
    formData.append("anasayfa", blogData.anasayfa ? "on" : "");
    formData.append("onay", blogData.onay ? "on" : "");

    blogData.categories.forEach(categoryId => {
        formData.append("categories", categoryId);
    });

    if (blogData.resim) {
        formData.append("resim", blogData.resim);
    }

    const response = await fetch(
        `${API_URL}/admin/blogs/create`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.errors?.join(", ") ||
            data.message ||
            "Blog oluşturulamadı."
        );
    }

    return data;
}


export async function getBlogEditData(blogid) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/blogs/${blogid}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Blog bilgileri alınamadı."
        );
    }

    return data.data;
}


export async function updateBlog(blogid, blogData) {

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("baslik", blogData.baslik);
    formData.append("altbaslik", blogData.altbaslik);
    formData.append("aciklama", blogData.aciklama);
    formData.append(
        "anasayfa",
        blogData.anasayfa ? "true" : "false"
    );
    formData.append(
        "onay",
        blogData.onay ? "true" : "false"
    );

    formData.append(
        "resimKaldir",
        blogData.resimKaldir ? "true" : "false"
    );

    formData.append(
        "eskiResim",
        blogData.eskiResim || ""
    );

    blogData.categories.forEach(categoryId => {
        formData.append("categories", categoryId);
    });

    if (blogData.resim) {
        formData.append("resim", blogData.resim);
    }

    const response = await fetch(
        `${API_URL}/admin/blogs/${blogid}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.errors?.map(error => error.message).join(", ") ||
            data.message ||
            "Blog güncellenemedi."
        );
    }

    return data;
}


export async function deleteBlog(blogid) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/blog/delete/${blogid}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Blog silinemedi."
        );
    }

    return data;
}


export async function getAdminCategories() {
    const token = localStorage.getItem("token");
    
    const response = await fetch(
        `${API_URL}/admin/categories`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Kategoriler yüklenemedi"
        );
    }

    return data;
}

export async function createCategory(baslik) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/categories/create`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                baslik
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.errors?.map(error => error.message).join(", ") ||
            data.message ||
            "Kategori oluşturulamadı."
        );

    }

    return data;
}


export async function deleteCategory(categoryid) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/categories/delete/${categoryid}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Kategori silinemedi."
        );
    }

    return data;
}


// export async function createCategory(baslik) {

//     const token = localStorage.getItem("token");

//     const response = await fetch(
//         `${API_URL}/admin/categories/create`,
//         {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 baslik
//             })
//         }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//         throw new Error(
//             data.errors?.map(error => error.message).join(", ") ||
//             data.message ||
//             "Kategori oluşturulamadı."
//         );
//     }

//     return data;
// }


export async function getCategoryEditData(categoryid) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/categories/${categoryid}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Kategori bilgileri alınamadı."
        );
    }

    return data.data;
}


export async function updateCategory(categoryid, baslik) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/categories/${categoryid}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                baslik
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.errors?.map(error => error.message).join(", ") ||
            data.message ||
            "Kategori güncellenemedi."
        );
    }

    return data;
}


export async function removeBlogFromCategory(categoryid, blogid) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/categories/${categoryid}/blogs/${blogid}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Blog kategoriden çıkarılamadı."
        );
    }

    return data;
}


export async function getAdminRoles() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/roles`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Roller yüklenemedi."
        );
    }

    return data.data;
}


export async function createRole(rolename) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/roles/create`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                rolename
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.errors?.map(error => error.message).join(", ") ||
            data.message ||
            "Rol oluşturulamadı."
        );
    }

    return data;
}


export async function deleteRole(roleid) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/roles/delete/${roleid}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Rol silinemedi."
        );
    }

    return data;
}


export async function getRoleEditData(roleid) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/roles/${roleid}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Rol bilgileri alınamadı."
        );
    }

    return data.data;
}


export async function updateRole(roleid, rolename) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/roles/${roleid}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                rolename
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.errors?.join(", ") ||
            data.message ||
            "Rol güncellenemedi."
        );

    }

    return data;
}


export async function removeUserFromRole(roleid, userid) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/roles/remove`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                roleid,
                userid
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Kullanıcının rolü kaldırılamadı."
        );

    }

    return data;
}


export async function getAdminUsers() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/users`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Kullanıcılar yüklenemedi."
        );
    }

    return data;
}


export async function getUserEditData(userid) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/users/${userid}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Kullanıcı bilgileri alınamadı."
        );
    }

    return data.data;
}


export async function updateUser(userid, userData) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/users/${userid}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userid,
                fullname: userData.fullname,
                email: userData.email,
                roles: userData.roles
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.errors?.map(error => error.message).join(", ") ||
            data.message ||
            "Kullanıcı bilgileri güncellenemedi."
        );
    }

    return data;
}


export async function searchUsersByUsername(query) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/admin/search?username=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Kullanıcılar aranamadı.");
    }

    return data.data;
}


export async function addUserToRole(roleid, userid) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/admin/add`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ roleid, userid })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Kullanıcı role eklenemedi.");
    }

    return data;
}  