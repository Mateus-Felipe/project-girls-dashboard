'use client'
import { useEffect, useState } from "react";
import InputCustom from "../components/input";
import Title from "../components/title";
import ButtonCustom from "../components/ButtonCustom";
import CustomModal from "../components/CustomModal";
import { axiosFetch } from "../services/axiosFetch";
import { useRouter } from "next/navigation";
import { setCookieInClient } from "../services/checkAuthInClient";

export default function login() {
    const [loading, setLoading] = useState<Boolean>(false)
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [TxtModal, setTxtModal] = useState([
        'Title',
        ['first message', 'second message'],
        false, // is open or close
        false, //cannot close?
    ]);
    const router = useRouter()

    const handleAuth = async () => {
        if (loading) return;
        if (login.length <= 4 || password.length <= 3) {
            return setTxtModal([
                'Atenção',
                ['Preencha todos os campos corretamente.'],
                true, false
            ])
        }
        setLoading(true);
        const fetchData = await axiosFetch({
            type: 'post', addAuth: false, url: '/login/admin', body: {
                login, password
            },
        });
        console.log(fetchData)
        if (fetchData.error == true || fetchData.invalidToken == true || fetchData.data?.failed == true) {
            if (fetchData.invalidToken == true) {
                setTxtModal([
                    'Atenção',
                    ['Não foi possível realizar seu login.'],
                    true, false
                ]);
            }
            setLoading(false)
            return setTxtModal([
                'Atenção',
                ['Ocorreu um erro!', fetchData?.data?.response?.data?.message],
                true, false
            ]);
        }
        if (!fetchData.data?.result?.token) {
            setTxtModal([
                'Atenção',
                ['Não foi possível realizar seu login!'],
                true, false
            ]);
            setLoading(false)
            return;
        }
        await setCookieInClient('athtk', fetchData.data.result.token, 9)
        router.push('/dashboard')
    }

    useEffect(() => {
        const fetch = async () => {
            await setCookieInClient('athtk', '', 0)
        }
        fetch()
    }, [])

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <div className="w-10/12 h-screen flex flex-col justify-center items-center">
                <Title>Faça seu login! (Sujeito a bloqueio se falhar multiplas vezes)</Title>
                <InputCustom placeholder="Login" value={login} onChange={(v: any) => setLogin(v)} />
                <InputCustom placeholder="Senha" type='password' value={password} onChange={(v: any) => setPassword(v)} />
                <ButtonCustom clickFunction={handleAuth}>{loading ? 'Carregando...' : 'Acessar'}</ButtonCustom>
            </div>
            <CustomModal
                title={TxtModal[0]} text={TxtModal[1]}
                open={TxtModal[2]} cannotClose={TxtModal[3]} handleClose={() => setTxtModal(['', [''], false, false])}
            />
        </div>
    );
}