import {Button, Layout, Window} from "@/components";
import {createPortal} from "react-dom";
import {useRef, useState} from "react";
import stylesSettings from "@/styles/settings.module.css";
import stylesComponents from "@/styles/components.module.css";

export default function ErrorPage() {
    const [showModal, setShowModal] = useState(false);
    const [TitleModal, setTitleModal] = useState("");
    const [ContextModal, setContextModal] = useState("");

    const window = (title: string, context: string) => {
        setTitleModal(title)
        setContextModal(context)
        setShowModal(true)
    }

    const project = {
        name: useRef<any>(),
        description: useRef<any>(),
        icon: useRef<any>(),
        url: useRef<any>(),
        technologies: useRef<any>(),
    }

    const addProject = async (e: any) => {
        e.preventDefault()
        const res = await fetch("/api/project/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: project.name.current.value,
                description: project.description.current.value,
                icon: project.icon.current.value,
                url: project.url.current.value,
                technologies: project.technologies.current.value,
            })
        })

        const data = await res.json()
        window("Создание проекта", data.message)
    }

    return (
        <Layout title={"Добавить проект"}>
            <section className={`${stylesSettings.section}`}>
                <form className={`${stylesSettings.form} center flex-column`} onSubmit={addProject}>
                    <h1>Создать проект</h1>
                    <input type="text" placeholder="Название проекта" className={`${stylesComponents.input}`}
                           ref={project.name} required/>
                    <textarea placeholder="Описание проекта" className={`${stylesComponents.input}`}
                              ref={project.description} required/>
                    <input type="text" placeholder="Иконка проекта" className={`${stylesComponents.input}`}
                           ref={project.icon} required/>
                    <input type="text" placeholder="Ссылка на проект" className={`${stylesComponents.input}`}
                           ref={project.url} required/>
                    <input type="text" placeholder="Технологии проекта" className={`${stylesComponents.input}`}
                           ref={project.technologies} required/>
                    <Button type="submit" icon="plus">Создать</Button>
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
