import { ReactNode } from "react";

interface titleProps {
    children?: ReactNode
    className?: string
}

export default function Title({ children, className }: titleProps) {
    return (
        <h1 className={`text-dark-bg dark:text-white text-center md:text-3xl text-2xl font-bold ${className}`}>{children}</h1>
    );
}