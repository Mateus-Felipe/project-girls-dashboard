'use client'
import { useState, useEffect } from "react";
import Title from "@/app/components/title";
import CustomModal from "@/app/components/CustomModal";
import Header from "@/app/components/header";
import { axiosFetch } from "@/app/services/axiosFetch";
import { useRouter } from "next/navigation";
import { User } from "@/app/services/userInterface";
import Image from "next/image";
import ButtonCustom from "@/app/components/ButtonCustom";
import Link from "next/link";
import UserComponent from "@/app/components/userComponent";

export default function page() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<User[]>([])
    const [TxtModal, setTxtModal] = useState([
        'Title',
        ['first message', 'second message'],
        false, // is open or close
        false, //cannot close?
    ]);
    const router = useRouter();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setTxtModal([
                'Carregando',
                ['Aguarde...'],
                true, true
            ]);

            const fetchData = await axiosFetch({ type: 'get', addAuth: true, url: '/admin/list/users', body: undefined });
            if (fetchData.error == true || fetchData.invalidToken == true || fetchData.data?.failed == true) {
                if (fetchData.invalidToken == true) {
                    setTxtModal([
                        'Login expirado!',
                        ['Aguarde...'],
                        true, true
                    ]);
                    return router.push('/login');
                }
                return setTxtModal([
                    'Atenção',
                    ['Ocorreu um erro ao carregar as informações!', fetchData?.data?.response?.data?.message, 'Tente novamente recarregando a página.'],
                    true, 'reload'
                ]);
            }
            setData(fetchData.data?.result)
            setLoading(false);
            setTxtModal([
                '',
                ['...'],
                false, false
            ]);
        };

        fetch();
    }, []);

    return (
        <div>
            <Header loading={loading} />
            <Title className="mt-16">{loading ? 'Carregando..' : data?.length + ' ' + `${data?.length > 0 ? data?.length > 1 ? 'Usuários' : 'Usuário' : 'Nenhum usuário'} aguardando aprovação `}</Title>
            <div className="w-full text-center mb-16">
                <Link className="text-center font-bold text-dark-blue w-full" href='/administrar/usuarios/modelo/midia'>Ver usuários aguardando aprovação da mídia</Link>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
                <div className="flex flex-row flex-wrap items-start justify-start w-10/12">
                    {
                        loading == false && (
                            data && data.length > 0 ? data.map((v: User, i) => <UserComponent data={v} />) : <Title>Nenhum usuário encontrado.</Title>
                        )
                    }
                </div>
            </div>

            <CustomModal
                title={TxtModal[0]} text={TxtModal[1]}
                open={TxtModal[2]} cannotClose={TxtModal[3]} handleClose={() => setTxtModal(['', [''], false, false])}
            />
        </div>
    );
}