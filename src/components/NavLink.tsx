import React from "react";
import Link from 'next/link';
import {Icon} from "@/components/index";

export type LinkProps = {
    iconName?: string;
    iconGroup?: string;
    href: string;
    children?: React.ReactNode;
}

export default function NavLinkButton({iconName, iconGroup, href, children}: LinkProps) {
    return (

        <Link href={href} className="fkex flex-1 transition-colors flex-col justify-center items-center md:bg-neutral-800 md:hover:bg-zinc-800 md:px-3 md:py-2 md:rounded-md md:flex-row md:gap-2 md:items-center md:border-none">
            <p>{iconName && (<Icon name={iconName} group={iconGroup}/>)}</p> <p className="text-xs w-fit md:text-base">{children}</p>
        </Link>
    )
}