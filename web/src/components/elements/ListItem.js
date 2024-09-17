import { Link } from "react-router-dom";

export default function ListItem({ title, icon, isActive = false }) {
    return (
        <li className="mb-1">
            <Link className={`flex items-center py-3 rounded-md ${isActive ? 'bg-primary text-white' : 'bg-white text-slate-700'}  hover:bg-primary hover:text-white transition-colors duration-300`}>
                { icon }
                <span>{ title }</span>
            </Link>
        </li>
    )
};
