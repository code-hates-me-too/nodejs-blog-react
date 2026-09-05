import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { getBlogs } from "../services/blogService";
import BlogCard from "../components/BlogCard";
import BlogSidebar from "../components/BlogSidebar";
import Pagination from "../components/Pagination";


function Blogs() {

    const { slug } = useParams();

    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 0;
    const aramaParam = searchParams.get("ara") || "";


    const [blogs, setBlogs] = useState([]);
    const [pagination, setPagination] = useState(null);

    const [aramaMetni, setAramaMetni] = useState(aramaParam);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {

        setLoading(true);
        setError(null);

        getBlogs(slug, page, aramaParam)
            .then(data => {

                setBlogs(data.blogs);

                setPagination(data.pagination);

            })
            .catch(error => {

                setError(error.message);

            })
            .finally(() => {

                setLoading(false);

            });

    }, [slug, page, aramaParam]);


    // Yazarken URL'e dokunmuyoruz, sadece submit edilince (Enter/buton) arıyoruz.
    function handleAramaSubmit(event) {

        event.preventDefault();

        const nextParams = {};

        if (aramaMetni.trim()) {
            nextParams.ara = aramaMetni.trim();
        }

        setSearchParams(nextParams);

    }


    if (loading) {
        return <h1>Bloglar yükleniyor...</h1>;
    }


    if (error) {
        return <h1>{error}</h1>;
    }


    const basePath = slug
        ? `/blogs/category/${slug}`
        : "/blogs";

    const extraQuery = aramaParam
        ? `&ara=${encodeURIComponent(aramaParam)}`
        : "";

    const baslikMetni = aramaParam
        ? `"${aramaParam}" için arama sonuçları`
        : "Bloglar";


    return (
        <div className="sayfa-kapsayici">

            <div className="bl-ust">

                <h1 className="bl-baslik">{baslikMetni}</h1>

                <form
                    className="bl-arama-form"
                    onSubmit={handleAramaSubmit}
                >
                    <input
                        type="text"
                        placeholder="Blog ara..."
                        value={aramaMetni}
                        onChange={event => setAramaMetni(event.target.value)}
                    />

                    <button type="submit">Ara</button>
                </form>

            </div>

            <div className="bl-govde">

                <div className="bl-liste">

                    {blogs.length === 0 ? (

                        <p className="silik-metin">Sonuç bulunamadı.</p>

                    ) : (

                        blogs.map(blog => (
                            <BlogCard
                                key={blog.blogid}
                                blog={blog}
                            />
                        ))

                    )}

                    <Pagination
                        pagination={pagination}
                        basePath={basePath}
                        extraQuery={extraQuery}
                    />

                </div>

                <BlogSidebar />

            </div>

        </div>
    );
}

export default Blogs;