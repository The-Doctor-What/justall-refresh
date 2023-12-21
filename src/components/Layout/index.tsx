import Head from 'next/head'
import React, {useEffect, useState} from "react";
import {getCookie} from "cookies-next";
import {Inter} from "next/font/google";

export type LayoutProps = {
    title?: string;
    children?: React.ReactNode;
    className?: string;
}

const inter = Inter({subsets: ['latin']})

export default function Layout({children, title, className}: LayoutProps) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
    const meta = {
        url: baseUrl,
        title: (title ? title + " | " : "") + (process.env.NEXT_PUBLIC_META_TITLE || "Personal Website"),
        description: process.env.NEXT_PUBLIC_META_DESCRIPTION || "Welcome to my personal website!",
        image: baseUrl + "/avatar.jpg"
    }

    const [token, setToken] = useState<any>(null)

    useEffect(() => {
        const token = getCookie("token")
        setToken(token)
    }, [])

    return (
        <>
            <Head>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description}/>
                <link rel="icon" href="/favicon.ico"/>

                <meta property="og:type" content="website"/>
                <meta property="og:url" content={meta.url}/>
                <meta property="og:title" content={meta.title}/>
                <meta property="og:description" content={meta.description}/>
                <meta property="og:image" content={meta.image}/>
            </Head>
            <main className={`${inter.className} md:flex md:flex-col md:items-center md:justify-center md:w-full md:h-screen`}>
                {children}
            </main>
        </>
    )
}