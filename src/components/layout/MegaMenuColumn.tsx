import { Link } from 'react-router-dom';

interface MegaMenuColumnProps {
    title: string;
    links: string[];
    isFirst?: boolean;
}

export const MegaMenuColumn = ({
                                   title,
                                   links,
                                   isFirst = false,
                               }: MegaMenuColumnProps) => {
    const slugify = (text: string) => {
        return text.toLowerCase().replace(/\s+/g, '-').replace(/[&$]/g, '');
    };

    return (
        <div className={`${isFirst ? 'pr-6 border-r border-[#5A4D40]' : ''}`}>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide">
                {title}
            </h3>
            <ul className="space-y-2.5">
                {links.map((link) => (
                    <li key={link}>
                        <Link
                            to={`/category/${slugify(link)}`}
                            className="text-[#C4B8A8] hover:text-white transition-colors text-sm"
                        >
                            {link}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};