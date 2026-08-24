import { Link } from "react-router-dom";

function BlogCard({ blog }) {
    return (
        <Link
            to={`/blogs/${blog.url}`}
            className="blog-card"
        >
            <article className="blog-card-content">

                <img
                    src={`http://localhost:3000/static/images/${blog.resim}`}
                    alt={blog.baslik}
                    className="blog-card-image"
                />

                <div className="blog-card-info">

                    <h2>{blog.baslik}</h2>

                    <p>{blog.altbaslik}</p>

                </div>

            </article>
        </Link>
    );
}

export default BlogCard;