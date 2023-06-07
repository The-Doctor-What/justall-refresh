import {NextApiRequest, NextApiResponse} from "next";
import {supabase} from "@/utils/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const request = req.body
    const token = req.cookies.token

    if (!request.key || !request.value || !request.id) {
        return res.send({status: "error", message: "Не все поля заполнены"})
    }

    if (!token) {
        return res.send({status: "error", message: "Вы не авторизованы"})
    }

    const {data, error} = await supabase
        .from("auth")
        .select("*")
        .eq("token", token)
        .maybeSingle()

    if (error || !data) {
        return res.send({status: "error", message: "Вы не авторизованы"})
    }

    const {data: project, error: projectError} = await supabase
        .from("projects")
        .select("*")
        .eq("id", request.id)
        .maybeSingle()

    if (projectError || !project) {
        return res.send({status: "error", message: "Проект не найден"})
    }
    if (request.key == "technologies") {
        request.value = request.value.split(",")
        request.value = request.value.map((item: string) => item.trim())
    }
    project[request.key] = request.value

    const {error: errorSave} = await supabase
        .from("projects")
        .update(project)
        .eq("id", request.id)

    if (errorSave) {
        console.log(errorSave)
        return res.send({status: "error", message: "Ошибка при сохранении"})
    }

    return res.send({status: "success", message: "Настройки успешно обновлены"})
}