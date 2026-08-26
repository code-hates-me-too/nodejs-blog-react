import { Outlet } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";

function AdminLayout() {

    return (
        <>
            <AdminNavbar />

            <div className="admin-content">
                <Outlet />
            </div>
        </>
    );
}

export default AdminLayout;