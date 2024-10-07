import { NavLink } from "react-router-dom";

export default function ListItem({ title, icon, variant = 'item', url = '#' }) {
    let classVariant = ''
    if (variant === 'item') {
        classVariant = 'pl-4'
    } else if (variant === 'subitem') {
        classVariant = 'pl-10'
    }
    return (
        <li className="">
            <NavLink to={url} className={({ isActive }) => `flex items-center ${classVariant} py-3 text-sm gap-3 text-primary ${isActive ? 'bg-primary/20 border-r-4 border-primary' : 'bg-white'}  hover:bg-primary/20 transition-colors duration-300`} >
                { icon }
                <span>{ title }</span>
            </NavLink>
        </li>
    )
};
