import {deleteCookie, getCookie} from "cookies-next";
import {supabase} from "@/utils/supabase";

export const checkAuth = async (ctx: any) => {
    const token = getCookie("token", ctx);
    if (!token) return false;

    const {data, error} = await supabase
        .from("auth")
        .select("*")
        .eq("token", token)
        .maybeSingle()

    if (error || !data) {
        console.log(error)
        deleteCookie("token", ctx)
        return false
    }
    return true
}