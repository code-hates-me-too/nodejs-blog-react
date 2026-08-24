import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { getBlogs } from "../services/blogService";
import BlogCard from "../components/BlogCard";
import CategoryMenu from "../components/CategoryMenu";
import Pagination from "../components/Pagination";


function Blogs() {

    const { slug } = useParams();

    const [searchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 0;


    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {

        setLoading(true);
        setError(null);

        getBlogs(slug, page)
            .then(data => {

                setBlogs(data.blogs);

                setCategories(data.categories);

                setPagination(data.pagination);

            })
            .catch(error => {

                setError(error.message);

            })
            .finally(() => {

                setLoading(false);

            });

    }, [slug, page]);


    if (loading) {
        return <h1>Bloglar yükleniyor...</h1>;
    }


    if (error) {
        return <h1>{error}</h1>;
    }


    const basePath = slug
        ? `/blogs/category/${slug}`
        : "/blogs";


    return (
        <div>

            <h1>Bloglar</h1>

            <div className="blog-list">

                {blogs.length === 0 ? (

                    <p>Bu kategoride blog bulunamadı.</p>

                ) : (

                    blogs.map(blog => (
                        <BlogCard
                            key={blog.blogid}
                            blog={blog}
                        />
                    ))

                )}

            </div>


            <Pagination
                pagination={pagination}
                basePath={basePath}
            />

        </div>
    );
}

export default Blogs;