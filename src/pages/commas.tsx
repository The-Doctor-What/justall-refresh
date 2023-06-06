import {Layout, Link} from "@/components";
import {useState} from "react";
import stylesCommas from "@/styles/commas.module.css";

export default function CommasPage() {
    const [commas, setCommas] = useState(0);
    setTimeout(() => setCommas(commas + 1), 40);
    return (
        <Layout title="Запятые">
            <section className={`${stylesCommas.commas} center flex-column`}>
                <h1>О ты помнишь где взять запятые? Или тебе кто то отправил ссылку?</h1>
                <p>В любом случае правила все те же, бери сколько нужно и проваливай</p>
                <span>{",".repeat(commas)}</span>
                <Link href="/" icon="home">Все хватит, верни меня на главную</Link>
            </section>
        </Layout>
    )
}
