import {DetailWrapper, Layout, Link} from "@/components";
import stylesError from "@/styles/error.module.css";
import stylesTwork from "@/styles/twork.module.css";
import {GetServerSideProps} from "next";
import {checkAuth} from "@/utils/checkAuth";

type TworkProps = {
    token: any
}

export default function TworkPage({token}: TworkProps) {


    if (!token) {
        return (
            <Layout title="Нет доступа">
                <section className={`${stylesError.errorSection} center flex-column`}>
                    <h1>403</h1>
                    <p className={stylesError.text}>Для полученная данной информации необходимо авторизоваться</p>
                    <Link href="/auth" icon="sign-in">Авторизация</Link>
                </section>
            </Layout>
        )
    }

    return (
        <Layout title={"Шпаргалка"}>
            <h2>Шпаргалки по Twork</h2>
            <section className={`${stylesTwork.cheat}`}>
                <DetailWrapper title="Процентная ставка по кредитной карте" icon="percent">
                    <p>Покупки по карте: От 12% до 59,9%</p>
                    <p>Снятие наличных: От 30% до 69,9% (Комиссия при снятии наличных: 2.9% + 290 рублей)</p>
                </DetailWrapper>
                <DetailWrapper title="Перевод баланса" icon="money-bill-transfer">
                    <h4>Позволяет закрыть кредит в другом банке за счет новой карты в Tinkoff с более низкой процентной ставкой.</h4>
                    <p>Можно закрыть кредит/кредитную карту только на имя владельца новой карты</p>
                    <p>Минимальная сумма перевода: 5 000 рублей</p>
                    <p>Максимальная сумма перевода по реквизитам карты: 150 000 рублей</p>
                    <p>Максимальная сумма перевода на счет в другом банке: 300 000 рублей</p>
                </DetailWrapper>
                <DetailWrapper title="Виды рассрочки" icon="money-bill-wave">
                    <h3>Рассрочка по кнопке</h3>
                    <h4>Оформляется после покупки, в истории покупок необходимо выбрать нужную покупку и после перехода в подробности покупки ниже будет оформление рассрочки</h4>
                    <p>Срок погашения: от 3 до 12 месяцев</p>
                    <p>Размер комиссий за оформлении рассрочки у всех индивидуальный: зависит от суммы покупки и срока, на который будет оформлена рассрочка</p>
                    <p>Минимальная сумма покупки: 1 000 рублей</p>
                    <img src="https://imgproxy.cdn-tinkoff.ru/compressed95:help_question_card_body_image_desktop_col_9/aHR0cHM6Ly9vcGlzLWNkbi50aW5rb2Zmam91cm5hbC5ydS9wbHV0by1iYWNrZW5kLWltYWdlcy8wM2VmMWRkMi4wN19ncmVhdF9vYm5vdmxlbmllX2Rlc2tfNHgucG5n" alt="Оформление рассрочки"/>
                    <h3>Рассрочка Target</h3>
                    <h4>В приложение Tinkoff есть раздел с предложениям от партнеров банка, там можно оформить рассрочку на покупку в определенном магазине</h4>
                </DetailWrapper>
                <DetailWrapper title="Компенсация за бонусные баллы" icon="money-bills">
                    <h4>Компенсировать можно только:</h4>
                    <ul>
                        <li>Покупка билетов на поезд</li>
                        <li>Рестораны, кафе, бары</li>
                        <li>Оплата коммунальных услуг, мобильной связи, интернета, домашнего телефона, телевидения, госуслуг и транспорта</li>
                    </ul>
                    <p>1 балл = 1 рубль</p>
                </DetailWrapper>
            </section>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps<TworkProps> = async (ctx) => {
    const empty = {
        props: {
            token: null
        },
    };

    try {
        const [token] = await Promise.all([
            checkAuth(ctx)
        ])

        return {
            props: {
                token: token ? token : null
            }
        }
    } catch (e) {
        return empty;
    }
};