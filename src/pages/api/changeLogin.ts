import {NextApiRequest, NextApiResponse} from "next";
import {supabase} from "@/utils/supabase";
import sha256 from "crypto-js/sha256";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const request = req.body
    const token = req.cookies.token

    if (!request.login) return res.send({status: "error", message: "Новый логин не указан"})
    if (!token) return res.send({status: "error", message: "Вы не авторизованы"})

    const {data, error} = await supabase
        .from("auth")
        .select("*")
        .eq("token", token)
        .maybeSingle()

    if (error || !data) return res.send({status: "error", message: "Вы не авторизованы"})

    data.login = request.login
    data.token = sha256(request.login + data.password + Date.now()).toString()

    const {error: errorSave} = await supabase
        .from("auth")
        .update(data)
        .eq("id", data.id)

    if (errorSave) {
        console.log(errorSave)
        return res.send({status: "error", message: "Ошибка при сохранении"})
    }

    return res.send({status: "success", message: "Логин успешно изменен", token: data.token})
}