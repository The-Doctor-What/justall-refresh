import LinkNext from "next/link";
import {Badge} from "@/components/index";

export type ProjectProps = {
    project: {
        id: number,
        name: string,
        description: string,
        badges: number[],
        icon: string,
        url: string
    },
    key?: number,
    badges: any
}

export default function Project({project, badges, key}: ProjectProps) {
    return (<LinkNext href={`${project.url}`} key={key} className="flex p-4 transition-colors bg-neutral-900 hover:bg-zinc-900 rounded w-96 h-32 shrink-0">
        <div className="flex flex-col gap-1">
            <h3 className="font-bold"><i className={`fa-solid fa-${project.icon}`}></i> {project.name}</h3>
            <p className="text-sm text-zinc-400">{project.description}</p>
            <div className="flex flex-row gap-2">
                {project.badges.map((badge: any) => (
                    <Badge badges={badges} key={badge} id={badge}/>
                ))}
            </div>
        </div>
    </LinkNext>)
}