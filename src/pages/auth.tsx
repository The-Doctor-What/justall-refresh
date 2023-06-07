import {Button, Layout, Link, Window} from "@/components";
import stylesAuth from "@/styles/auth.module.css";
import stylesComponents from "@/styles/components.module.css";
import {useRef, useState} from "react";
import sha256 from 'crypto-js/sha256';
import {useRouter} from "next/router";
import {setCookie} from "cookies-next";
import {GetServerSideProps} from "next";
import {checkAuth} from "@/utils/checkAuth";
import stylesError from "@/styles/error.module.css";
import {createPortal} from "react-dom";

type Auth = {
    token: any
}

export default function AuthPage({token}: Auth) {
    const auth = {
        login: useRef<any>(),
        password: useRef<any>()
    }

    const router = useRouter();

    if (token) {
        return (
            <Layout title="Авторизация">
                <section className={`${stylesError.errorSection} center flex-column`}>
                    <h1>Вы уже авторизованы</h1>
                    <p className={stylesError.text}>Для выхода из аккаунта нажмите кнопку ниже</p>
                    <Link href="/logout" icon="sign-out">Выйти</Link>
                </section>
            </Layout>
        )
    }

    const [showModal, setShowModal] = useState(false);
    const [TitleModal, setTitleModal] = useState("");
    const [ContextModal, setContextModal] = useState("");

    const window = (title: string, context: string) => {
        setTitleModal(title)
        setContextModal(context)
        setShowModal(true)
    }

    return (
        <Layout title="Авторизация">
            <section className={`flex-row ${stylesAuth.authSection}`}>
                <form className={`center flex-column ${stylesAuth.authForm}`} onSubmit={async (e) => {
                    e.preventDefault();
                    const user = {
                        login: auth.login.current.value,
                        password: sha256(auth.password.current.value).toString()
                    }

                    const res = await fetch(`/api/auth`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(user)
                    });

                    const data = await res.json();

                    if (data.status == "success") {
                        setCookie("token", data.token, {
                            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                        });
                        await router.push("/");
                    }

                    window("Авторизация", data.message)

                }}>
                    <h1>Вход в аккаунт</h1>
                    <div className="center flex-column">
                        <div className={stylesComponents.inputHolder}>
                            <input type="text" placeholder="Логин" className={stylesComponents.input} ref={auth.login}
                                   required/>
                        </div>
                        <div className={stylesComponents.inputHolder}>
                            <input type="password" placeholder="Пароль" className={stylesComponents.input}
                                   ref={auth.password} required/>
                        </div>
                        <Button icon="sign-in" type="submit">Войти</Button>
                    </div>
                </form>
            </section>
            {showModal && createPortal(
                <Window title={TitleModal} closeExecute={() => setShowModal(false)}>
                    {ContextModal}
                </Window>, document.body
            )}
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps<Auth> = async (ctx) => {
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
