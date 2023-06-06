import {NextApiRequest, NextApiResponse} from "next";
import {supabase} from "@/utils/supabase";
import sha256 from "crypto-js/sha256";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const request = req.body
    const token = req.cookies.token

    if (!request.password) return res.send({status: "error", message: "Вы не указали пароль"})
    if (!token) return res.send({status: "error", message: "Вы не авторизованы"})
    if (!request.newPassword || !request.newPasswordRepeat) return res.send({status: "error", message: "Не указан новый пароль"})
    if (request.newPassword.length < 8) return res.send({status: "error", message: "Пароль должен быть не менее 8 символов"})
    if (request.newPassword !== request.newPasswordRepeat) return res.send({status: "error", message: "Пароли не совпадают"})

    const password = sha256(request.password).toString()
    const newPassword = sha256(request.newPassword).toString()

    const {data, error} = await supabase
        .from("auth")
        .select("*")
        .eq("token", token)
        .maybeSingle()

    if (error || !data) return res.send({status: "error", message: "Вы не авторизованы"})
    if (data.password !== password) return res.send({status: "error", message: "Неверный пароль"})

    data.password = newPassword
    data.token = sha256(data.login + newPassword + Date.now()).toString()

    const {error: errorSave} = await supabase
        .from("auth")
        .update(data)
        .eq("id", data.id)

    if (errorSave) {
        console.log(errorSave)
        return res.send({status: "error", message: "Ошибка при сохранении"})
    }

    return res.send({status: "success", message: "Пароль успешно изменен", token: data.token})
}