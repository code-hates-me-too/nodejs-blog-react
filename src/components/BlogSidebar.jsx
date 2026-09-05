import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCategories } from "../services/blogService";

function BlogSidebar() {

    const [categories, setCategories] = useState([]);
    const location = useLocation();

    useEffect(() => {
        getCategories()
            .then(data => setCategories(data.data || []))
            .catch(error => console.error("Kategoriler alınamadı:", error));
    }, []);

    return (
        <aside className="bl-yan-panel">

            <div className="bl-panel-blok">

                <h3 className="bl-panel-baslik">Kategoriler</h3>

                <div className="bl-panel-linkler">

                    {categories.map(category => {

                        const categoryPath = `/blogs/category/${category.url}`;

                        return (
                            <Link
                                key={category.categoryid}
                                to={categoryPath}
                                className={
                                    location.pathname === categoryPath
                                        ? "bl-panel-link aktif"
                                        : "bl-panel-link"
                                }
                            >
                                {category.categoryname}
                            </Link>
                        );

                    })}

                </div>

            </div>

            <div className="ince-cizgi"></div>

            <div className="bl-panel-blok">
                <h3 className="bl-panel-baslik">Topluluklar</h3>
                <p className="silik-metin">Çok yakında.</p>
            </div>

            <div className="ince-cizgi"></div>

            <div className="bl-panel-blok">
                <h3 className="bl-panel-baslik">Diğer Hesaplar</h3>
                <p className="silik-metin">Çok yakında.</p>
            </div>

        </aside>
    );
}

export default BlogSidebar;