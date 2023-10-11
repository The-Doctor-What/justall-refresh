import stylesDetailWrapper from './detailWrapper.module.css'
import React from "react";

export type DetailWrapperProps = {
    children?: React.ReactNode;
    title: string;
    icon?: string;
    iconGroup?: string;
}

export default function DetailWrapper({children, title, icon, iconGroup = "solid" }: DetailWrapperProps) {
    return (
        <details className={stylesDetailWrapper.detailWrapper}>
            <summary className={stylesDetailWrapper.detailWrapperTitle}>
                {icon && (<i className={`fa-${iconGroup || "solid"} fa-${icon}`}></i>)} {title}
            </summary>
            <div className={stylesDetailWrapper.content}>
                {children}
            </div>
        </details>
    )
}