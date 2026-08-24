import { Link } from "react-router-dom";

function Pagination({ pagination, basePath }) {

    if (!pagination || pagination.totalPages <= 1) {
        return null;
    }

    const {
        currentPage,
        totalPages
    } = pagination;

    return (
        <div className="pagination">

            {currentPage > 0 && (
                <Link
                    to={`${basePath}?page=${currentPage - 1}`}
                    className="pagination-link"
                >
                    Önceki
                </Link>
            )}


            {Array.from(
                { length: totalPages },
                (_, index) => (
                    <Link
                        key={index}
                        to={`${basePath}?page=${index}`}
                        className={
                            `pagination-link ${
                                currentPage === index
                                    ? "active"
                                    : ""
                            }`
                        }
                    >
                        {index + 1}
                    </Link>
                )
            )}


            {currentPage < totalPages - 1 && (
                <Link
                    to={`${basePath}?page=${currentPage + 1}`}
                    className="pagination-link"
                >
                    Sonraki
                </Link>
            )}

        </div>
    );
}

export default Pagination;