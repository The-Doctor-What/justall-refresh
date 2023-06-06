import {supabase} from "@/utils/supabase";

export const getSocials = async () => {
    const {data, error} = await supabase
        .from("socials")
        .select("*")

    if (error) {
        console.log(error)
        return null
    }

    return data
}