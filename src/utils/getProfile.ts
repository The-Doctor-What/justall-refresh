import {supabase} from "@/utils/supabase";

export const getProfile = async () => {
    const {data, error} = await supabase
        .from("profile")
        .select("*")

    if (error) {
        console.log(error)
        return null
    }

    return data.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {})
}