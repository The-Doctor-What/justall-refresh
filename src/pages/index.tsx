import {Button, Layout, Link, LogoCompact, NavButton, NavLink, Project} from "@/components";
import LinkNext from "next/link";
import {GetServerSideProps} from "next";
import {getProjects} from "@/utils/getProject";
import {getProfile} from "@/utils/getProfile";
import stylesError from "@/styles/error.module.css";
import {getSocials} from "@/utils/getSocials";
import {checkAuth} from "@/utils/checkAuth";
import {useState} from "react";
import {getBadges} from "@/utils/getBadges";
import {deleteCookie} from "cookies-next";
import {useRouter} from "next/router";
import stylesAuth from "@/styles/auth.module.css";
import stylesComponents from "@/styles/components.module.css";

type Home = {
    projects: any,
    profile: any,
    token: any,
    socials: any,
    badges: any
}

export default function HomePage({profile, token, projects, socials, badges}: Home) {
    if (!profile) {
        return (
            <Layout title="Ошибка">
                <section className={`${stylesError.errorSection} center flex-column`}>
                    <h1>Не удалось загрузить профиль</h1>
                    <p className={stylesError.text}>Попробуйте перезагрузить страницу</p>
                    <Link href="/" iconName="rotate-right">Перезагрузить</Link>
                </section>
            </Layout>
        )
    }
    const router = useRouter();
    const [section, setSection] = useState(1)

    const logout = async () => {
        await deleteCookie("token");
        await router.push("/auth");
    }

    return (
        <Layout title={profile.name}>
            <section className="flex flex-row">
                <section className="flex flex-row absolute bottom-0 bg-neutral-900 w-full md:static md:w-64 md:h-[32rem] md:rounded-l-md md:flex-col md:gap-4 md:items-center md:p-4 md:justify-between">
                    <div className="flex flex-row md:flex-col gap-2 w-full">
                    <div className="hidden md:flex">
                        <LogoCompact/>
                    </div>
                    <div className="flex flex-row md:flex-col gap-2 w-full">
                        <NavButton icon="home" execute={() => {setSection(1)}}>Обо мне</NavButton>
                        <NavButton icon="briefcase" execute={() => {setSection(2)}}>Портфолио</NavButton>
                        <NavButton icon="screwdriver-wrench" execute={() => {setSection(3)}}>Навыки</NavButton>
                        <NavButton icon="newspaper" execute={() => {setSection(3)}}>Блог</NavButton>
                    </div>
                    </div>
                    <div className="flex flex-row md:flex-col gap-2 w-full">
                        {token && (<NavLink iconName="quote-right" href="/commas">Запятые</NavLink>)}
                        {token && (<NavButton icon="right-from-bracket" execute={() => {setSection(5)}}>Выход</NavButton>)}
                        {!token && (<NavButton icon="right-to-bracket" execute={() => {setSection(6)}}>Авторизоваться</NavButton>)}
                    </div>
                </section>
                <section className="md:w-[32rem] md:h-[32rem] md:rounded-r-md md:bg-neutral-800">
                    {section == 1 && (<div className="flex flex-col gap-4 p-4">
                        <div className="flex flex-row gap-1 items-center">
                            <img src={profile.avatar} alt="Аватар" className="w-24 h-24 rounded-full object-cover"/>
                            <div className="flex flex-col gap-1">
                                <h2>{profile.name}</h2>
                                <p className="text-sm text-zinc-400"><i className="fa-solid fa-code"></i> {profile.role}</p>
                                {token && (<Link href={`/settings`} iconName="pen-to-square" secondary={true}>Редактировать</Link>)}
                            </div>
                        </div>
                        <p><i className="fa-solid fa-envelope"></i> {profile.email}</p>
                        <p><i className="fa-solid fa-location-dot"></i> {profile.address}</p>
                        <div className="">
                            {socials?.map((social: any) => (
                                <Link href={social.url} iconName={social.icon} iconGroup="brands" key={social.id}/>
                            ))}
                        </div>
                    </div>)}

                    {section == 2 && (<section className={`flex flex-col items-center gap-4 p-4 overflow-auto h-full`} id="projects">
                        {projects?.length > 0 ? (<>
                                    {projects.map((project: any) => (
                                        <Project project={project} key={project.id} badges={badges}/>
                                    ))}
                                    {token && (
                                        <LinkNext href="/project/create" className="flex justify-center items-center text-6xl shrink-0 transition-colors font-bold bg-neutral-800 hover:bg-zinc-800 rounded border-2 border-dashed border-neutral-900 hover:border-zinc-900 w-96 h-32">
                                            <i className="fa-solid fa-circle-plus"></i>
                                        </LinkNext>
                                    )}
                                </>
                            ) :
                            <section className={`${stylesError.errorSection} center flex-column`}>
                                <h1>Не найдено ни одного проекта или не удалось получить данные</h1>
                                <p className={stylesError.text}>Попробуйте перезагрузить страницу</p>
                                <Link href="/" iconName="rotate-right">Перезагрузить</Link>
                            </section>
                        }
                    </section>)}
                    {section == 3 && (<section className={`${stylesError.errorSection} center flex-column`}>
                        <h1>В разработке</h1>
                        <p className={stylesError.text}>Данный раздел находится в разработке</p>
                    </section>)}
                    {section == 5 && (<section className={`${stylesError.errorSection} center flex-column`}>
                        <h1>Выход из аккаунта</h1>
                        <p className={stylesError.text}>Вы уверены, что хотите выйти?</p>
                        <Button execute={logout} icon="sign-out" type="button">Выйти</Button>
                    </section>)}
                    {section == 6 && (<form className={`center flex-column ${stylesAuth.authForm}`}>
                        <h1>Вход в аккаунт</h1>
                        <div className="center flex-column">
                            <div className={stylesComponents.inputHolder}>
                                <input type="text" placeholder="Логин" className={stylesComponents.input} required/>
                            </div>
                            <div className={stylesComponents.inputHolder}>
                                <input type="password" placeholder="Пароль" className={stylesComponents.input} required/>
                            </div>
                            <Button icon="sign-in" type="submit">Войти</Button>
                        </div>
                    </form>)}
                </section>
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
            socials: null,
            badges: null,
        },
    };

    try {
        const [profile, projects, socials, badges, token] = await Promise.all([
            getProfile(),
            getProjects(),
            getSocials(),
            getBadges(),
            checkAuth(ctx),
        ]);

        return {
            props: {
                profile: profile ?? null,
                token: token ?? null,
                projects: projects ?? null,
                socials: socials ?? null,
                badges: badges ?? null,
            }
        }
    } catch (e) {
        return empty;
    }
};