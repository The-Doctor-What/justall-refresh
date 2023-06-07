import {NextApiRequest, NextApiResponse} from "next";
import {supabase} from "@/utils/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const request = req.body
    const token = req.cookies.token
    if (!request.icon || !request.url) return res.send({status: "error", message: "Не все поля заполнены"})
    if (!token) return res.send({status: "error", message: "Вы не авторизованы"})

    const {data, error} = await supabase
        .from("auth")
        .select("*")
        .eq("token", token)
        .maybeSingle()

    if (error || !data) return res.send({status: "error", message: "Вы не авторизованы"})

    const {error: errorSave} = await supabase
        .from("socials")
        .insert(request)

    if (errorSave) {
        console.log(errorSave)
        return res.send({status: "error", message: "Ошибка при добавление"})
    }

    return res.send({status: "success", message: "Социальная сеть добавлена"})
}