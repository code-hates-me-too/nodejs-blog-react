import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import CategoryMenu from "./components/CategoryMenu";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>

            <Navbar />
            <CategoryMenu />

            <main className="main-content">
                <Routes>

                    <Route path="/" element={<Home />} />

                    <Route path="/blogs" element={<Blogs />} />

                    <Route
                        path="/blogs/category/:slug"
                        element={<Blogs />}
                    />

                    <Route
                        path="/blogs/:slug"
                        element={<BlogDetail />}
                    />

                </Routes>
            </main>

        </BrowserRouter>
    );
}

export default App;