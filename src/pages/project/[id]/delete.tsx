import {Button, Layout, Link, Window} from "@/components";
import stylesError from "@/styles/error.module.css";
import {GetServerSideProps} from "next";
import {checkAuth} from "@/utils/checkAuth";
import {getProject} from "@/utils/getProject";
import {useState} from "react";
import {createPortal} from "react-dom";

type deleteProject = {
    token: any,
    project: any
}

export default function DeleteProjectPage({token, project}: deleteProject) {
    const [showModal, setShowModal] = useState(false);
    const [TitleModal, setTitleModal] = useState("");
    const [ContextModal, setContextModal] = useState("");

    const window = (title: string, context: string) => {
        setTitleModal(title)
        setContextModal(context)
        setShowModal(true)
    }

    if (!token) {
        return (
            <Layout title="Удаление проекта">
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
            <Layout title="Удаление проекта">
                <section className={`${stylesError.errorSection} center flex-column`}>
                    <h1>Проект не найден</h1>
                    <p className={stylesError.text}>Возможно, он был удалён</p>
                    <Link href="/" icon="home">Мне все равно, верни меня на главную</Link>
                </section>
            </Layout>
        )
    }

    async function deleteProject(e: any) {
        e.preventDefault();
        const request = await fetch(`/api/project/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: project.id
            })
        })
        const data = await request.json();
        window("Удаление проекта", data.message)
    }

    return (
        <Layout title={"Удаление проекта"}>
            <section className={`${stylesError.errorSection} center flex-column`}>
                <h1>Удаление проекта {project.name}</h1>
                <p className={stylesError.text}>Вы уверены, что хотите удалить проект?</p>
                <Button execute={deleteProject} icon="trash" type="button">Удалить</Button>
            </section>
            {showModal && createPortal(
                <Window title={TitleModal} closeExecute={() => setShowModal(false)}>
                    {ContextModal}
                </Window>, document.body
            )}
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps<deleteProject> = async (ctx) => {
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