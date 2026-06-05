import { Link } from "react-router";
import { FiChevronRight } from "react-icons/fi";

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition">Home</Link>
            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                    <FiChevronRight className="w-4 h-4" />
                    {item.href ? (
                        <Link to={item.href} className="hover:text-primary-600 dark:hover:text-primary-400 transition">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    )
}
