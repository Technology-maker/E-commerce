import {
    LayoutDashboard,
    PackagePlus,
    PackageSearch,
    PenSquare,
    Users,
    X
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ onClose }) => {

    const linkClass = ({ isActive }) => `flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full transition ${isActive ? 'bg-pink-600 text-white' : 'text-gray-800 hover:bg-pink-100'}`

    return (
        <div className=" w-[260px] h-screen bg-pink-50 border-r border-pink-200  p-6 ">
            {/* Mobile close button */}
            <div className="flex justify-end md:hidden mb-6">
                <button onClick={onClose}>
                    <X />
                </button>
            </div>

            <nav className="space-y-2">
                <NavLink to="/dashboard/salse" className={linkClass} onClick={onClose}>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/dashboard/add-product" className={linkClass} onClick={onClose}>
                    <PackagePlus />
                    <span>Add Products</span>
                </NavLink>

                <NavLink to="/dashboard/products" className={linkClass} onClick={onClose}>
                    <PackageSearch />
                    <span>Products</span>
                </NavLink>

                <NavLink to="/dashboard/users" className={linkClass} onClick={onClose}>
                    <Users />
                    <span>Users</span>
                </NavLink>

                <NavLink to="/dashboard/orders" className={linkClass} onClick={onClose}>
                    <PenSquare />
                    <span>Orders</span>
                </NavLink>
            </nav>
        </div>
    )
}

export default Sidebar
