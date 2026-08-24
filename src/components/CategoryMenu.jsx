import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getBlogs } from "../services/blogService";

function CategoryMenu() {

    const [categories, setCategories] = useState([]);
    const location = useLocation();

    useEffect(() => {
        getBlogs()
            .then(data => {
                setCategories(data.categories);
            })
            .catch(error => {
                console.error("Kategoriler alınamadı:", error);
            });
    }, []);

    return (
        <nav className="category-menu">

            <div className="category-menu-inner">

                <Link
                    to="/blogs"
                    className={
                        location.pathname === "/blogs"
                            ? "category-link active"
                            : "category-link"
                    }
                >
                    Tüm Bloglar
                </Link>

                {categories.map(category => {

                    const categoryPath =
                        `/blogs/category/${category.url}`;

                    return (
                        <Link
                            key={category.categoryid}
                            to={categoryPath}
                            className={
                                location.pathname === categoryPath
                                    ? "category-link active"
                                    : "category-link"
                            }
                        >
                            {category.categoryname}
                        </Link>
                    );
                })}

            </div>

        </nav>
    );
}

export default CategoryMenu;