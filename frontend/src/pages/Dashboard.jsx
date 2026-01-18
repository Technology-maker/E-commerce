import Sidebar from '@/components/Sidebar'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'

const Dashboard = () => {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex min-h-screen relative">
            {/* Mobile overlay */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed md:static z-50
                    h-screen
                    transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                `}
            >
                <Sidebar onClose={() => setOpen(false)} />
            </div>

            {/* Main content */}
            <div className="flex-1 w-full">
                {/* Mobile top bar (below navbar) */}
                <div className="md:hidden flex items-center gap-3 p-3 border-b bg-white sticky top-[64px] z-30">
                    <button onClick={() => setOpen(true)}>
                        <Menu size={26} />
                    </button>
                    <span className="font-semibold">Dashboard</span>
                </div>

                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
