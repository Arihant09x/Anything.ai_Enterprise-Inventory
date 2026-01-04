import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Package } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white">
                            <Package size={24} />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            Enterprise Inventory
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <>
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-slate-800">{user.username}</p>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">
                                        {user.role}
                                    </span>
                                </div>
                                <Button variant="danger" onClick={() => { logout(); }} className="!px-3">
                                    <LogOut size={20} />
                                    <span className="hidden sm:inline">Logout</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
