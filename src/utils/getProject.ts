import {supabase} from "@/utils/supabase";

export const getProjects = async () => {
    const {data, error} = await supabase
        .from("projects")
        .select("*")

    if (error) {
        console.log(error)
        return null
    }

    return data
}

export const getProject = async (id: number) => {
    const {data, error} = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle()

    if (error) {
        console.log(error)
        return null
    }

    return data
}