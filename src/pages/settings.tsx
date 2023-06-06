import {Button, Layout, Link} from "@/components";
import stylesSettings from "@/styles/settings.module.css";
import stylesError from "@/styles/error.module.css";
import {GetServerSideProps} from "next";
import {checkAuth} from "@/utils/checkAuth";
import {useRef, useState} from "react";
import stylesComponents from "@/styles/components.module.css";
import {setCookie} from "cookies-next";
import {getSocials} from "@/utils/getSocials";
import LinkNext from "next/link";
import stylesProjects from "@/styles/project.module.css";
import {getProjects} from "@/utils/getProject";

type Logout = {
    token: any,
    projects: any,
    socials: any,
}

export default function ControlPage({token, socials, projects}: Logout) {
    if (!token) {
        return (
            <Layout title="Нет доступа">
                <section className={`${stylesError.errorSection} center flex-column`}>
                    <h1>403</h1>
                    <p className={stylesError.text}>Для управления проектами необходимо авторизоваться</p>
                    <Link href="/auth" icon="sign-in">Авторизация</Link>
                </section>
            </Layout>
        )
    }

    const [settingsSection, setSettingsSection] = useState(1)
    const [avatarUrl, setAvatarUrl] = useState(null)

    const mainSettings = {
        name: useRef<any>(),
        role: useRef<any>(),
        address: useRef<any>(),
        avatar: useRef<any>(),
    }

    const securitySettings = {
        login: useRef<any>(),
        email: useRef<any>(),
        password: useRef<any>(),
        newPassword: useRef<any>(),
        newPasswordRepeat: useRef<any>(),
    }

    const socialsSettings = {
        icon: useRef<any>(),
        url: useRef<any>(),
    }

    const changeSettings = async (e: any, key: any, value: any) => {
        e.preventDefault();
        const request = await fetch(`/api/settings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                key: key,
                value: value.current?.value
            })
        })

        const data = await request.json();

        alert(data.message)
    }

    const changeLogin = async (e: any) => {
        e.preventDefault();
        const request = await fetch(`/api/changeLogin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                login: securitySettings.login.current?.value
            })
        })

        const data = await request.json();
        if (data.status == "success") setCookie("token", data.token, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
        })
        alert(data.message)
    }

    const closeSessions = async (e: any) => {
        e.preventDefault();
        const request = await fetch(`/api/closeSessions`)
        const data = await request.json();
        if (data.status == "success") setCookie("token", data.token, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
        })
        alert(data.message)
    }

    const deleteSocial = async (e: any, id: any) => {
        e.preventDefault();
        const request = await fetch(`/api/deleteSocial`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id
            })
        })
        const data = await request.json();
        alert(data.message)
    }

    const changePassword = async (e: any) => {
        e.preventDefault();
        const request = await fetch(`/api/changePassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: securitySettings.password.current?.value,
                newPassword: securitySettings.newPassword.current?.value,
                newPasswordRepeat: securitySettings.newPasswordRepeat.current?.value
            })
        })

        const data = await request.json();
        if (data.status == "success") setCookie("token", data.token, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
        })
        alert(data.message)
    }
    const socialAdd = async (e: any) => {
        e.preventDefault();
        const request = await fetch(`/api/socialAdd`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                icon: socialsSettings.icon.current?.value,
                url: socialsSettings.url.current?.value
            })
        })
        const data = await request.json();
        alert(data.message)
    }

    return (
        <Layout title={"Управление"} className="justify-center flex-row flex-wrap">
            <section className={`${stylesSettings.sections}`}>
                <h1>Управление</h1>
                <Button execute={() => {
                    setSettingsSection(1)
                }} icon="house" type="button">Основные данные</Button>
                <Button execute={() => {
                    setSettingsSection(2)
                }} icon="image" type="button">Изменить аватар</Button>
                <Button execute={() => {
                    setSettingsSection(3)
                }} icon="share-nodes" type="button">Социальные сети</Button>
                <Button execute={() => {
                    setSettingsSection(4)
                }} icon="key" type="button">Безопасность</Button>
                <Button execute={() => {
                    setSettingsSection(5)
                }} icon="briefcase" type="button">Проекты</Button>
            </section>
            <section className={`${stylesSettings.section}`}>
                {settingsSection == 1 && (
                    <div className="center flex-column">
                        <h1>Основные данные</h1>
                        <form onSubmit={async (e) => await changeSettings(e, "name", mainSettings.name)}
                              className="center flex-column">
                            <div className="center flex-row">
                                <input type="text" placeholder="Новое имя" ref={mainSettings.name}
                                       className={stylesComponents.input} required/>
                                <Button type="submit" icon="floppy-disk"/>
                            </div>
                        </form>
                        <form onSubmit={async (e) => await changeSettings(e, "role", mainSettings.role)}
                              className="center flex-column">
                            <div className="center flex-row">
                                <input type="text" placeholder="Новая роль" ref={mainSettings.role}
                                       className={stylesComponents.input} required/>
                                <Button type="submit" icon="floppy-disk"/>
                            </div>
                        </form>
                        <form onSubmit={async (e) => await changeSettings(e, "address", mainSettings.address)}
                              className="center flex-column">
                            <div className="center flex-row">
                                <input type="text" placeholder="Новый адрес" ref={mainSettings.address}
                                       className={stylesComponents.input} required/>
                                <Button type="submit" icon="floppy-disk"/>
                            </div>
                        </form>
                    </div>)}
                {settingsSection == 2 && (
                    <div className="center flex-column">
                        <h1>Изменить аватар</h1>
                        {avatarUrl && (
                            <div className="center flex-column">
                                <p className="bold">Предпросмотр</p>
                                <img src={avatarUrl} className={stylesSettings.avatar} alt="Предпросмотр"/>
                            </div>
                        )}
                        <form onSubmit={async (e) => await changeSettings(e, "avatar", mainSettings.avatar)}
                              className="center flex-column">
                            <input type="text" placeholder="Ссылка новую на фотографию" ref={mainSettings.avatar}
                                   className={stylesComponents.input} required/>
                            <Button icon="refresh" type="button" execute={
                                () => {
                                    setAvatarUrl(mainSettings.avatar.current?.value)
                                }}>
                                Обновить предпросмотр
                            </Button>
                            <Button type="submit" icon="check">Сохранить</Button>
                        </form>

                    </div>)}
                {settingsSection == 3 && (
                    <div className="center flex-column">
                        <h1>Социальные сети</h1>
                        <form onSubmit={async (e) => await socialAdd(e)}
                              className="center flex-column">
                            <p className="bold">Подключить социальную сеть</p>
                            <input type="text" placeholder="Иконка" ref={socialsSettings.icon}
                                   className={stylesComponents.input} required/>
                            <input type="url" placeholder="Ссылка на соц сеть" ref={socialsSettings.url}
                                   className={stylesComponents.input} required/>
                            <Button type="submit" icon="check">Подключить</Button>
                        </form>
                        <p className="bold">Подключенные социальные сети</p>
                        <div className={`center flex-column ${stylesSettings.socials}`}>
                            {socials?.map((social: any) => (
                                <div key={social.id} className="center flex-column">
                                    <Button type="button" icon="trash" execute={async (e) => {
                                        await deleteSocial(e, social.id)
                                    }}>{`${social.icon}: ${social.url}`}</Button>
                                </div>
                            ))}
                        </div>
                    </div>)}
                {settingsSection == 4 && (
                    <div className="center flex-column">
                        <h1>Безопасность</h1>
                        <form onSubmit={async (e) => await changeLogin(e)}
                              className="center flex-column">
                            <p className="bold">Изменить логин</p>
                            <input type="text" placeholder="Новый логин" ref={securitySettings.login}
                                   className={stylesComponents.input} required/>
                            <Button type="submit" icon="check">Сохранить</Button>
                        </form>
                        <form onSubmit={async (e) => await changeSettings(e, "email", securitySettings.email)}
                              className="center flex-column">
                            <p className="bold">Изменить электронную почту</p>
                            <input type="email" placeholder="Электронная почта" ref={securitySettings.email}
                                   className={stylesComponents.input} required/>
                            <Button type="submit" icon="check">Сохранить</Button>
                        </form>
                        <form onSubmit={async (e) => await changePassword(e)}
                              className="center flex-column">
                            <p className="bold">Изменить пароль</p>
                            <input type="password" placeholder="Старый пароль" ref={securitySettings.password}
                                   className={stylesComponents.input} required/>
                            <input type="password" placeholder="Новый пароль" ref={securitySettings.newPassword}
                                   className={stylesComponents.input} required/>
                            <input type="password" placeholder="Повторите новый пароль"
                                   ref={securitySettings.newPasswordRepeat}
                                   className={stylesComponents.input} required/>
                            <Button type="submit" icon="check">Сохранить</Button>
                        </form>
                        <div className="center flex-column">
                            <Button icon="sign-out" type="button" execute={async (e) => await closeSessions(e)}>
                                Завершить все сеансы
                            </Button>
                        </div>
                    </div>)}
                {settingsSection == 5 && (
                    <div className={`center flex-column ${stylesSettings.projects}`}>
                        <h1>Проекты</h1>
                        {projects?.map((project: any) => (
                            <div key={project.id} className={`${stylesSettings.settingsProject}`}>
                                <div className={stylesProjects.projectInfo}>
                                    <h3><i className={`fa-solid fa-${project.icon}`}></i> {project.name}</h3>
                                    <p>{project.description}</p>
                                    <div className={`${stylesProjects.projectTechnologies} flex-row`}>
                                        {project.technologies ? project.technologies.map((technology: any) => (
                                            <img src={`/technologies/${technology}.png`} alt={technology}
                                                 key={technology}/>
                                        )) : null}
                                    </div>
                                    <div className={`${stylesProjects.projectLinks} flex-row`}>
                                        <Link href={`${project.url}`} icon="eye"/>
                                        <Link href={`/project/${project.id}/edit`} icon="pencil"/>
                                        <Link href={`/project/${project.id}/delete`} icon="trash"/>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <LinkNext href="/project/create" className={`${stylesSettings.settingsProjectPlus}`}>
                            <i className="fa-solid fa-circle-plus"></i>
                        </LinkNext>
                    </div>)}
            </section>

        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps<Logout> = async (ctx) => {
    const empty = {
        props: {
            token: null,
            projects: null,
            socials: null,
        },
    };

    try {
        const [token, socials, projects] = await Promise.all([
            checkAuth(ctx),
            getSocials(),
            getProjects(),
        ])
        return {
            props: {
                token: token ? token : null,
                projects: projects ? projects : null,
                socials: socials ? socials : null,
            }
        }
    } catch (e) {
        return empty;
    }
};