import React, { useState } from 'react';
import {
    User,
    LayoutDashboard,
    UserSquare,
    ShoppingBasket,
    MenuSquare,
    ListOrdered,
    ArrowRight,
    ArrowLeft,
    LucideBadgeDollarSign,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const variants = {
    expanded: { width: '15%' },
    nonexpanded: { width: '6%' },
};

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [selectedLink, setSelectedLink] = useState(null);

    const handleLinkClick = (navId) => {
        setSelectedLink(navId);
    };

    if (selectedLink === null) {
        setSelectedLink(1);
    }

    const navlinks = [
        { id: 1, link: 'Dashboard', icon: <LayoutDashboard />, to: '/' },
        { id: 2, link: 'Users', icon: <User />, to: 'admin/users' },
        { id: 3, link: 'Customers', icon: <UserSquare />, to: 'admin/customers' },
        { id: 4, link: 'Products', icon: <ShoppingBasket />, to: 'admin/products' },
        { id: 5, link: 'Groups product', icon: <MenuSquare />, to: 'admin/groups' },
        { id: 6, link: 'Orders', icon: <ListOrdered />, to: 'admin/orders' },
        { id: 7, link: 'Sales', icon: <LucideBadgeDollarSign />, to: 'admin/sales' },
    ];

    return (
        <motion.div
            animate={isExpanded ? 'expanded' : 'nonexpanded'}
            variants={variants}
            className={
                'py-10 h-screen flex flex-col border border-r-1 bg-[#FDFDFD] relative' +
                (isExpanded ? ' px-10' : ' px-6')
            }
        >
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="cursor-pointer absolute -right-3 top-10 rounded-full w-6 h-6 bg-primary flex justify-center items-center"
            >
                {isExpanded ? <ArrowLeft className="w-10 text-white" /> : <ArrowRight className="w-10 text-white" />}
            </div>

            <div className="flex flex-col space-y-8">
                {navlinks.map((nav) => (
                    <NavLink
                        key={nav.id}
                        to={nav.to}
                        className={`nav-links w-full rounded-lg  ${
                            selectedLink === nav.id ? 'bg-primary text-white' : ''
                        }`}
                        onClick={() => handleLinkClick(nav.id)}
                    >
                        <div className="flex space-x-3 w-full p-2 rounded ">
                            {nav.icon}
                            <span className={!isExpanded ? 'hidden' : 'block'}>{nav.link}</span>
                        </div>
                    </NavLink>
                ))}
            </div>
        </motion.div>
    );
};

export default Sidebar;
