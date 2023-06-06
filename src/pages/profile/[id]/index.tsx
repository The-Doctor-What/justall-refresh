import {Layout, Link} from "@/components";
import stylesError from "@/styles/error.module.css";
import stylesProfile from "@/styles/profile.module.css";
import {GetServerSideProps} from "next";
import {getUser} from "@/utils/getUser";
import {getRole} from "@/utils/getRole";
import LinkNext from "next/link";

type Profile = {
    user: any,
    sender: any,
    role: any,
}

export default function ProfilePage({user, sender, role}: Profile) {
    if (!user) {
        return (
            <Layout title={"Пользователь не найден"}>
                <section className={`${stylesError.errorSection} center flex-column`}>
                    <h1>Пользователь не найден</h1>
                    <p className={stylesError.text}>Пользователь с таким id не найден</p>
                    <Link href="/members" icon="user-group">Список пользователей</Link>
                </section>
            </Layout>
        )
    }

    return (
        <Layout title={`Профиль ${user.name}`}>
            {sender.self && sender.access < 2 ? <p className={stylesProfile.profileTitle}>Ваш профиль</p> :
                <div className={stylesProfile.profileTitle}>
                    <LinkNext href="/members"><i className="fa-solid fa-user-group"></i>
                        <span className={stylesProfile.profileTitleText}> Список пользователей</span>
                    </LinkNext>
                    <span className={stylesProfile.slash}>/</span>
                    <LinkNext href={user.id.toString()}>
                        {user.name}
                    </LinkNext>
                </div>
            }
            <section className={stylesProfile.profile}>
                <img src={user.avatar} alt="Аватар"/>
                <div className={stylesProfile.profileInfo}>
                    <h2>{user.name}</h2>
                    <p><i className={`fa-solid fa-${role.icon}`}></i> {role.name}</p>
                    <p><i className="fa-solid fa-envelope"></i> {user.email}</p>
                    <p><i className="fa-solid fa-phone"></i> {user.phone || "Не указан"}</p>
                    <p><i className="fa-solid fa-map-marker"></i> {user.address || "Не указан"}</p>
                </div>
                <div className={stylesProfile.profileActions}>
                    {(sender.access > role.access && sender.access >= 3) || sender.self ? (
                        <>
                            <Link href={`${user.id}/edit`} icon="pen-to-square">Редактировать</Link>
                        </>
                    ) : null}
                </div>
            </section>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps<Profile> = async (ctx) => {
    const empty = {
        props: {
            user: null,
            sender: {
                access: 5,
                self: true,
                token: null,
            },
            role: null,
        },
    };
    try {
        const {id} = ctx.query;

        const user = getUser(Number(id));
        if (!user) return empty;

        const role = getRole(user.role)
        if (!role) return empty;

        return {
            props: {
                user: user,
                sender: empty.props.sender,
                role: role,
            },
        };
    } catch (e) {
        return empty;
    }
};