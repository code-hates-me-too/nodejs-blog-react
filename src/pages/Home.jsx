import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlogs } from "../services/blogService";
import BlogCard from "../components/BlogCard";

function Home() {

    const { slug } = useParams();

    const [blogs, setBlogs] = useState([]);
    const [pagination, setPagination] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        setLoading(true);
        setError(null);

        getBlogs(slug)
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

    }, [slug]);

    if (loading) {
        return <h1>Bloglar yükleniyor...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }

    return (
        <div>

            <h1>Öne Çıkan Bloglar</h1>

            <hr />

            <div className="blog-list">

                {blogs.map(blog => (
                    <BlogCard
                        key={blog.blogid}
                        blog={blog}
                    />
                ))}

            </div>
        </div>
    );
}

export default Home;