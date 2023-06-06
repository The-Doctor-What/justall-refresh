import {Button, Layout, Link} from "@/components";
import stylesError from "@/styles/error.module.css";
import {useRouter} from "next/router";
import {deleteCookie} from "cookies-next";
import {GetServerSideProps} from "next";
import {checkAuth} from "@/utils/checkAuth";

type Logout = {
    token: any
}

export default function LogoutPage({token}: Logout) {
    const router = useRouter();

    if (!token) {
        return (
            <Layout title="Выход">
                <section className={`${stylesError.errorSection} center flex-column`}>
                    <h1>Вы не авторизованы</h1>
                    <p className={stylesError.text}>Для авторизации нажмите кнопку ниже</p>
                    <Link href="/auth" icon="sign-in">Авторизация</Link>
                </section>
            </Layout>
        )
    }

    const logout = async () => {
        await deleteCookie("token");
        await router.push("/auth");
    }

    return (
        <Layout title={"Выход"}>
            <section className={`${stylesError.errorSection} center flex-column`}>
                <h1>Выход из аккаунта</h1>
                <p className={stylesError.text}>Вы уверены, что хотите выйти?</p>
                <Button execute={logout} icon="sign-out" type="button">Выйти</Button>
            </section>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps<Logout> = async (ctx) => {
    const empty = {
        props: {
            token: null,
        },
    };

    try {
        const token = await checkAuth(ctx)
        return {
            props: {
                token: token ? token : null,
            }
        }
    } catch (e) {
        return empty;
    }
};