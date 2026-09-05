import { Link } from "react-router-dom";

function BlogCard({ blog }) {

    const authorName = blog.user?.username;
    const categoryNames = (blog.categories || [])
        .map(category => category.categoryname)
        .join(", ");

    return (
        <Link
            to={`/blogs/${blog.url}`}
            className="bl-satir"
        >

            <h2 className="bl-satir-baslik">
                {blog.baslik}
            </h2>

            <div className="bl-satir-meta">
                {authorName && <span>{authorName}</span>}
                {categoryNames && <span>{categoryNames}</span>}
            </div>

            {blog.altbaslik && (
                <p className="bl-satir-ozet">
                    {blog.altbaslik}
                </p>
            )}

            <div className="ince-cizgi"></div>

        </Link>
    );
}

export default BlogCard;