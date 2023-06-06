import {NextApiRequest, NextApiResponse} from "next";
import {supabase} from "@/utils/supabase";
import sha256 from "crypto-js/sha256";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.token

    if (!token) return res.send({status: "error", message: "Вы не авторизованы"})

    const {data, error} = await supabase
        .from("auth")
        .select("*")
        .eq("token", token)
        .maybeSingle()

    if (error || !data) return res.send({status: "error", message: "Вы не авторизованы"})

    data.token = sha256(data.login + data.password + Date.now()).toString()

    const {error: errorSave} = await supabase
        .from("auth")
        .update(data)
        .eq("id", data.id)

    if (errorSave) {
        console.log(errorSave)
        return res.send({status: "error", message: "Ошибка при сохранении"})
    }

    return res.send({status: "success", message: "Все сессии успешно завершены", token: data.token})
}