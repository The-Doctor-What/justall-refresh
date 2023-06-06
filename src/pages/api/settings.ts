import {NextApiRequest, NextApiResponse} from "next";
import {supabase} from "@/utils/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const request = req.body
    const token = req.cookies.token

    if (!request.key || !request.value) {
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

    const {data: profile, error: profileError} = await supabase
        .from("profile")
        .select("*")
        .eq("key", request.key)
        .maybeSingle()

    if (profileError || !profile) {
        return res.send({status: "error", message: "Такого пункта настроек не существует"})
    }

    profile.value = request.value

    const {error: errorSave} = await supabase
        .from("profile")
        .update(profile)
        .eq("key", request.key)

    if (errorSave) {
        console.log(errorSave)
        return res.send({status: "error", message: "Ошибка при сохранении"})
    }

    return res.send({status: "success", message: "Настройки успешно обновлены"})
}