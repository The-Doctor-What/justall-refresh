import {Button, Layout, Link, Window} from "@/components";
import stylesError from "@/styles/error.module.css";
import {GetServerSideProps} from "next";
import {checkAuth} from "@/utils/checkAuth";
import {getProject} from "@/utils/getProject";
import stylesSettings from "@/styles/settings.module.css";
import stylesComponents from "@/styles/components.module.css";
import {useRef, useState} from "react";
import stylesProjects from "@/styles/project.module.css";
import LinkNext from "next/link";
import {createPortal} from "react-dom";

type editProject = {
    token: any,
    project: any
}

export default function EditProject({token, project}: editProject) {
    if (!token) {
        return (
            <Layout title="Редактирование">
                <section className={`${stylesError.errorSection} center flex-column`}>
                    <h1>Вы не авторизованы</h1>
                    <p className={stylesError.text}>Для авторизации нажмите кнопку ниже</p>
                    <Link href="/auth" icon="sign-in">Авторизация</Link>
                </section>
            </Layout>
        )
    }

    if (!project) {
        return (
            <Layout title="Редактирование">
                <section className={`${stylesError.errorSection} center flex-column`}>
                    <h1>Проект не найден</h1>
                    <p className={stylesError.text}>Проверьте правильность введенного id</p>
                    <Link href="/" icon="home">Вернуться на главную</Link>
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

    const [settingsSection, setSettingsSection] = useState(1)

    const projectSettings = {
        name: useRef<any>(),
        description: useRef<any>(),
        icon: useRef<any>(),
        url: useRef<any>(),
        technologies: useRef<any>(),
    }

    const changeSettings = async (e: any, key: any, value: any) => {
        e.preventDefault();
        const request = await fetch(`/api/project/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: project.id,
                key: key,
                value: value.current?.value
            })
        })

        const data = await request.json();

        window("Обновление данных", data.message)
    }

    function value(ref: "name" | "description" | "icon" | "url" | "technologies") {
        return projectSettings[ref].current?.value ? projectSettings[ref].current?.value : project[ref]
    }

    return (
        <Layout title={"Редактирование"} className="justify-center flex-row flex-wrap">
            <section className={`${stylesSettings.sections}`}>
                <h1>Редактирование</h1>
                <Button execute={() => {
                    setSettingsSection(1)
                }} icon="circle-info" type="button">Информация</Button>
                <Button execute={() => {
                    setSettingsSection(2)
                }} icon="house" type="button">Основные данные</Button>
                <Button execute={() => {
                    setSettingsSection(3)
                }} icon="audio-description" type="button">Изменить описание</Button>
                <Button execute={() => {
                    setSettingsSection(4)
                }} icon="microchip" type="button">Изменить технологии</Button>
                <Link href={`/project/${project.id}/delete`} icon="trash">Удалить проект</Link>
            </section>
            <section className={`${stylesSettings.section}`}>
                {settingsSection == 1 && (
                    <LinkNext href={value("url")} key={project.id} className={stylesSettings.settingsProject}>
                        <div className={stylesProjects.projectInfo}>
                            <h3><i className={`fa-solid fa-${value("icon")}`}></i> {value("name")}</h3>
                            <p>{value("description")}</p>
                            <div className={`${stylesProjects.projectTechnologies} flex-row`}>
                                {value("technologies") ? project.technologies.map((technology: any) => (
                                    <img src={`/technologies/${technology}.png`} alt={technology} key={technology}/>
                                )) : null}
                            </div>
                        </div>
                    </LinkNext>)}
                {settingsSection == 2 && (
                    <div className="center flex-column">
                        <h1>Основные данные</h1>
                        <form onSubmit={async (e) => {await changeSettings(e, "name", projectSettings.name)}}
                              className="center flex-column">
                            <div className="center flex-row">
                                <input type="text" placeholder="Новое название" ref={projectSettings.name}
                                       className={stylesComponents.input} required/>
                                <Button type="submit" icon="floppy-disk"/>
                            </div>
                        </form>
                        <form onSubmit={async (e) => {await changeSettings(e, "icon", projectSettings.icon)}}
                              className="center flex-column">
                            <div className="center flex-row">
                                <input type="text" placeholder="Новая иконка" ref={projectSettings.icon}
                                       className={stylesComponents.input} required/>
                                <Button type="submit" icon="floppy-disk"/>
                            </div>
                        </form>
                        <form onSubmit={async (e) => {await changeSettings(e, "url", projectSettings.url)}}
                              className="center flex-column">
                            <div className="center flex-row">
                                <input type="text" placeholder="Новая ссылка" ref={projectSettings.url}
                                       className={stylesComponents.input} required/>
                                <Button type="submit" icon="floppy-disk"/>
                            </div>
                        </form>
                    </div>)}
                {settingsSection == 3 && (
                    <div className="center flex-column">
                        <h1>Изменить описание</h1>
                        <form onSubmit={async (e) => {await changeSettings(e, "description", projectSettings.description)}}
                              className="center flex-column">
                            <textarea placeholder="Новое описание" ref={projectSettings.description}
                                   className={stylesComponents.input} required/>
                            <Button type="submit" icon="check">Сохранить</Button>
                        </form>
                    </div>)}
                {settingsSection == 4 && (
                    <div className="center flex-column">
                        <h1>Используемые технологии</h1>
                        <form onSubmit={async (e) => {await changeSettings(e, "technologies", projectSettings.technologies)}}
                              className="center flex-column">
                            <input type="text" placeholder="Новый массив технологий" ref={projectSettings.technologies}
                                   className={stylesComponents.input} required/>
                            <Button type="submit" icon="check">Сохранить</Button>
                        </form>
                    </div>)}
            </section>
            {showModal && createPortal(
                <Window title={TitleModal} closeExecute={() => setShowModal(false)}>
                    {ContextModal}
                </Window>, document.body
            )}
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps<editProject> = async (ctx) => {
    const empty = {
        props: {
            token: null,
            project: null
        },
    };

    try {
        const id = ctx.query.id
        const [token, project] = await Promise.all([
            checkAuth(ctx),
            getProject(Number(id))
        ]);

        return {
            props: {
                token: token ? token : null,
                project: project ? project : null
            }
        }
    } catch (e) {
        return empty;
    }
};