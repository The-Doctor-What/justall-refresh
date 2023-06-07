import {NextApiRequest, NextApiResponse} from "next";
import {supabase} from "@/utils/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const request = req.body
    const token = req.cookies.token
    if (!request.name || !request.url || !request.icon || !request.description || !request.technologies) return res.send({
        status: "error",
        message: "Не все поля заполнены"
    })
    if (!token) return res.send({status: "error", message: "Вы не авторизованы"})

    const {data, error} = await supabase
        .from("auth")
        .select("*")
        .eq("token", token)
        .maybeSingle()

    if (error || !data) return res.send({status: "error", message: "Вы не авторизованы"})

    request.technologies = request.technologies.split(",")
    request.technologies = request.technologies.map((item: string) => item.trim())

    const {error: errorSave} = await supabase
        .from("projects")
        .insert(request)

    if (errorSave) {
        console.log(errorSave)
        return res.send({status: "error", message: "Ошибка при добавление"})
    }

    return res.send({status: "success", message: "Проект успешно добавлен"})
}