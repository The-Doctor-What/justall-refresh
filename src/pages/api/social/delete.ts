import {NextApiRequest, NextApiResponse} from "next";
import {supabase} from "@/utils/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const request = req.body
    const token = req.cookies.token
    if (!request.id) return res.send({status: "error", message: "Не все поля заполнены"})
    if (!token) return res.send({status: "error", message: "Вы не авторизованы"})

    const {data, error} = await supabase
        .from("auth")
        .select("*")
        .eq("token", token)
        .maybeSingle()

    if (error || !data) return res.send({status: "error", message: "Вы не авторизованы"})

    const {error: errorSocial, data: dataSocial} = await supabase
        .from("socials")
        .select("*")
        .eq("id", request.id)
        .maybeSingle()

    if (errorSocial || !dataSocial) return res.send({status: "error", message: "Социальная сеть не найдена"})

    const {error: errorDelete} = await supabase
        .from("socials")
        .delete()
        .eq("id", request.id)

    if (errorDelete) {
        console.log(errorDelete)
        return res.send({status: "error", message: "Ошибка при удалении"})
    }

    return res.send({status: "success", message: "Социальная сеть удалена"})
}