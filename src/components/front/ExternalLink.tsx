export default function ExternalLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {children}
        </a>
    );
}
