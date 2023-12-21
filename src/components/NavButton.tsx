import {Icon} from "@/components/index";

export type ButtonsTypes = {
    icon?: string,
    iconGroup?: string,
    execute?: any,
    children?: any,
    type?: any
}

export default function NavButton({icon, iconGroup, execute, children, type}: ButtonsTypes) {
    return (
        <button onClick={execute} type={type || "button"}
                className={`flex-1 transition-colors flex-col md:flex md:bg-neutral-800 md:hover:bg-zinc-800 md:px-3 md:py-2 md:rounded-md md:flex-row md:gap-2 md:items-center md:border-none`}>
            <p>{icon && (<Icon name={icon} group={iconGroup}/>)}</p> <p className="text-xs w-fit md:text-base">{children}</p>
        </button>
    )
}