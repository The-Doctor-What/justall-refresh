import {supabase} from "@/utils/supabase";

export const getBadges = async () => {
    const {data, error} = await supabase
        .from("badges")
        .select("*")

    if (error) {
        console.log(error)
        return null
    }

    return data
}

export const getBadge = async (id: number) => {
    const {data, error} = await supabase
        .from("badges")
        .select("*")
        .eq("id", id)
        .maybeSingle()

    if (error) {
        console.log(error)
        return null
    }

    return data
}