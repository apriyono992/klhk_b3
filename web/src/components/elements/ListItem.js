export default function ListItem({ title, icon, isActive = false }) {
    return (
        <li className="mb-1">
            <a className={`flex items-center font-medium text-base py-3 rounded-xl ${isActive ? 'bg-primary text-white' : 'bg-white text-slate-700'}  hover:bg-primary hover:text-white hover:shadow-md transition-colors duration-300`}>
                { icon }
                <span className="mt-0.5">{ title }</span>
            </a>
        </li>
    )
};
