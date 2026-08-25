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

function App() {

    return (
        <BrowserRouter>

            <AuthProvider>

                <Navbar />

                <CategoryMenu />
                
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

                    </Routes>

                </main>

            </AuthProvider>

        </BrowserRouter>
    );
}

export default App;