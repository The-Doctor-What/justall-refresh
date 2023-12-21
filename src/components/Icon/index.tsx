export type IconProps = {
    name: any;
    group?: string;
    className?: string;
}

export default function Icon({name, group, className}: IconProps) {
    if (!group) group = "solid";
    return (<i className={`fa-${group} fa-${name} ${className ? className : ""}`}/>)
}