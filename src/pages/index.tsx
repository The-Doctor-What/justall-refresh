import {Layout, Link} from "@/components";
import stylesProfile from "@/styles/profile.module.css";
import stylesProjects from "@/styles/project.module.css";
import LinkNext from "next/link";
import {GetServerSideProps} from "next";
import {getProjects} from "@/utils/getProject";
import {getProfile} from "@/utils/getProfile";
import stylesError from "@/styles/error.module.css";
import {getSocials} from "@/utils/getSocials";
import {checkAuth} from "@/utils/checkAuth";

type Home = {
    projects: any,
    profile: any,
    token: any,
    socials: any
}

export default function HomePage({profile, token, projects, socials}: Home) {
    if (!profile) {
        return (
            <Layout title="Ошибка">
                <section className={`${stylesError.errorSection} center flex-column`}>
                    <h1>Не удалось загрузить профиль</h1>
                    <p className={stylesError.text}>Попробуйте перезагрузить страницу</p>
                    <Link href="/" icon="rotate-right">Перезагрузить</Link>
                </section>
            </Layout>
        )
    }

    return (
        <Layout>

            <div className={stylesProfile.profileTitle}>
                <LinkNext href="/"><i className="fa-solid fa-globe"></i>
                    <span className={stylesProfile.profileTitleText}> {process.env.NEXT_PUBLIC_META_TITLE}</span>
                </LinkNext>
                <span className={stylesProfile.slash}>/</span>
                <LinkNext href="#profile">
                    {profile.name}
                </LinkNext>
            </div>

            <section className={stylesProfile.profile} id="profile">
                <img src={profile.avatar} alt="Аватар"/>
                <div className={stylesProfile.profileData}>
                    <div className={stylesProfile.profileInfo}>
                        <h2>{profile.name}</h2>
                        <p><i className="fa-solid fa-code"></i> {profile.role}</p>
                        <p><i className="fa-solid fa-envelope"></i> {profile.email}</p>
                        <p><i className="fa-solid fa-location-dot"></i> {profile.address}</p>
                    </div>
                    <div className={stylesProfile.profileSocials}>
                        {socials?.map((social: any) => (
                            <Link href={social.url} icon={social.icon} iconGroup="brands" key={social.id}/>
                        ))}
                    </div>
                </div>
                <div className={stylesProfile.profileActions}>
                    {token ? (
                        <>
                            <Link href={`/settings`} icon="pen-to-square">Редактировать</Link>
                        </>
                    ) : null}
                </div>
            </section>
            <div className={stylesProfile.profileTitle}>
                <LinkNext href={`/#projects`}>
                    Портфолио
                </LinkNext>
            </div>
            <section className={`center flex-row flex-wrap ${stylesProjects.projects}`} id="projects">
                {projects?.length > 0 ? (<>
                            {projects.map((project: any) => (
                                <LinkNext href={`${project.url}`} key={project.id} className={stylesProjects.project}>
                                    <div className={stylesProjects.projectInfo}>
                                        <h3><i className={`fa-solid fa-${project.icon}`}></i> {project.name}</h3>
                                        <p>{project.description}</p>
                                        <div className={`${stylesProjects.projectTechnologies} flex-row`}>
                                            {project.technologies ? project.technologies.map((technology: any) => (
                                                <img src={`/technologies/${technology}.png`} alt={technology}
                                                     key={technology}/>
                                            )) : null}
                                        </div>
                                    </div>
                                </LinkNext>
                            ))}
                            <LinkNext href="/project/create" className={stylesProjects.projectPlus}>
                                <i className="fa-solid fa-circle-plus"></i>
                            </LinkNext>
                        </>
                    ) :
                    <section className={`${stylesError.errorSection} center flex-column`}>
                        <h1>Не найдено ни одного проекта или не удалось получить данные</h1>
                        <p className={stylesError.text}>Попробуйте перезагрузить страницу</p>
                        <Link href="/" icon="rotate-right">Перезагрузить</Link>
                    </section>
                }
            </section>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps<Home> = async (ctx) => {
    const empty = {
        props: {
            profile: null,
            token: null,
            projects: null,
            socials: null
        },
    };

    try {
        const [profile, projects, socials, token] = await Promise.all([
            getProfile(),
            getProjects(),
            getSocials(),
            checkAuth(ctx),
        ]);

        return {
            props: {
                profile: profile ? profile : null,
                token: token ? token : null,
                projects: projects ? projects : null,
                socials: socials ? socials : null
            }
        }
    } catch (e) {
        return empty;
    }
};