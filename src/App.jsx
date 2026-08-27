import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import CategoryMenu from "./components/CategoryMenu";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";

import AdminNavbar from "./admin/components/AdminNavbar";
import AdminBlogs from "./admin/pages/AdminBlogs";
import AdminBlogCreate from "./admin/pages/AdminBlogCreate";
import AdminBlogEdit from "./admin/pages/AdminBlogEdit";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminCategoryEdit from "./admin/pages/AdminCategoryEdit";
import AdminRoles from "./admin/pages/AdminRoles";
import AdminRoleEdit from "./admin/pages/AdminRoleEdit";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminUserEdit from "./admin/pages/AdminUserEdit";


function App() {

    return (
        <BrowserRouter>

            <AuthProvider>

                <Navbar />

                <CategoryMenu />

                <AdminNavbar />
                
                <main className="main-content">

                    <Routes>

                        <Route
                            path="/"
                            element={<Home />}
                        />

                        <Route
                            path="/blogs"
                            element={<Blogs />}
                        />

                        <Route
                            path="/blogs/category/:slug"
                            element={<Blogs />}
                        />

                        <Route
                            path="/blogs/:slug"
                            element={<BlogDetail />}
                        />

                        <Route
                            path="/account/login"
                            element={<Login />}
                        />

                        <Route path="/account/register" element={<Register />} />

                        <Route
                            path="/account/reset-password"
                            element={<ResetPassword />}
                        />

                        <Route
                            path="/account/new-password/:token"
                            element={<NewPassword />}
                        />

                        <Route
                            path="/admin/blogs"
                            element={<AdminBlogs />}
                        />

                        <Route
                            path="/admin/blogs/create"
                            element={<AdminBlogCreate />}
                        />

                        <Route
                            path="/admin/blogs/edit/:blogid"
                            element={<AdminBlogEdit />}
                        />

                        <Route
                            path="admin/categories"
                            element={<AdminCategories />}
                        />

                        <Route
                            path="/admin/categories/edit/:categoryid"
                            element={<AdminCategoryEdit />}
                        />

                        <Route
                            path="/admin/roles"
                            element={<AdminRoles />}
                        />

                        <Route
                            path="/admin/roles/edit/:roleid"
                            element={<AdminRoleEdit />}
                        />

                        <Route
                            path="/admin/users"
                            element={<AdminUsers />}
                        />

                        <Route
                            path="/admin/users/edit/:userid"
                            element={<AdminUserEdit />}
                        />

                    </Routes>

                </main>

            </AuthProvider>

        </BrowserRouter>
    );
}

export default App;