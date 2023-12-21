export type BadgeProps = {
    badges: any,
    key: number,
    id: number
}

export default function Badge({badges, id, key}: BadgeProps) {
    const badge = badges.find((badge: any) => badge.id == id)
    if (!badge) return (<span className={`border border-rose-600 text-xs py-1 px-2 rounded-md`} key={key}>Error</span>)
    return (<span className={`text-xs py-1 px-2 rounded-md font-bold`} key={key} style={{background: badge.color}}>{badge.label}</span>)
}