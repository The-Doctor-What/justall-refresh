import {Layout, Link} from "@/components";
import stylesError from "@/styles/error.module.css";

export default function ErrorPage() {
    return (
        <Layout title={"В разработке"}>
            <section className={`${stylesError.errorSection} center flex-column`}>
                <h1>Страница в разработке</h1>
                <p className={stylesError.text}>Приносим свои извинения за неудобства</p>
                <Link href="/" icon="home">Мне все равно, верни меня на главную</Link>
            </section>
        </Layout>
    )
}
