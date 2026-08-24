import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlog } from "../services/blogService";

function BlogDetail() {

    const { slug } = useParams();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        setLoading(true);
        setError(null);

        getBlog(slug)
            .then(data => {
                setBlog(data.data);
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [slug]);


    if (loading) {
        return <h1>Blog yükleniyor...</h1>;
    }


    if (error) {
        return <h1>{error}</h1>;
    }


    if (!blog) {
        return <h1>Blog bulunamadı.</h1>;
    }


    return (
        <main className="blog-detail">

            <article>

                <img
                    src={`http://localhost:3000/static/images/${blog.resim}`}
                    alt={blog.baslik}
                    className="blog-detail-image"
                />

                <div className="blog-detail-content">

                    <h1>{blog.baslik}</h1>

                    <p className="blog-detail-subtitle">
                        {blog.altbaslik}
                    </p>

                    <hr />

                    <div
                        className="blog-detail-description"
                        dangerouslySetInnerHTML={{
                            __html: blog.aciklama
                        }}
                    />

                </div>

            </article>

        </main>
    );
}

export default BlogDetail;