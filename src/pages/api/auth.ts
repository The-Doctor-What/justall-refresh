import {NextApiRequest, NextApiResponse} from "next";
import {supabase} from "@/utils/supabase";
import sha256 from "crypto-js/sha256";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = req.body

    if (!user.login || !user.password) return res.send({status: "error", message: "Не указан логин или пароль"})

    const {data, error} = await supabase
        .from("auth")
        .select("*")
        .eq("login", user.login)
        .maybeSingle()

    if (error) return res.send({status: "error", message: "Ошибка при получении данных"})
    if (!data || data.length === 0) return res.send({status: "error", message: "Пользователь не найден"})
    if (data.password !== user.password) return res.send({status: "error", message: "Неверный пароль"})

    if (!data.token || data.token.length === 0) {
        data.token = sha256(user.login + user.password + Date.now()).toString()
        await supabase
            .from("auth")
            .update({token: data.token})
            .eq("login", user.login)
    }

    return res.send({status: "success", message: "Успешная авторизация", token: data.token})
}