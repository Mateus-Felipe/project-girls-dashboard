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

            const fetchData = await axiosFetch({ type: 'post', addAuth: true, url: '/admin/list/users/media', body: { status: 'waiting' } });
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
        <div className="w-full">
            <Header loading={loading} />
            <Title className="mt-16">{loading ? 'Carregando..' : data?.length + ' ' + `${data?.length > 0 ? data?.length > 1 ? 'Mídias' : 'Mídia' : 'Mídias'} aguardando aprovação `}</Title>
            <div className="w-full text-center mb-16">
                <Link className="text-center font-bold text-dark-blue" href='/administrar/usuarios/modelo'>Ver usuários aguardando aprovação</Link>
            </div>
            <div className="w-full flex flex-col justify-center items-center pb-28">
                {
                    loading == false && data && data.length > 0 && <Title>Clique para ver</Title>
                }
                <div className="flex flex-row flex-wrap items-start md:justify-between justify-center w-10/12 mt-2">
                    {
                        loading == false && (
                            data && data.length > 0 ? data.map((v: any, i) => (
                                // <div className="flex flex-col justify-center items-center mb-5 rounded-lg bg-dark-bg md:h-[600px] h-[300px] cursor-pointer hover:scale-105 transition-all"
                                <div className="flex flex-col justify-center items-center mb-5 rounded-lg bg-dark-bg super-larger:w-[32%] md:w-[48%] md:h-[600px] h-[300px]  w-10/12 cursor-pointer hover:scale-105 transition-all"
                                    onClick={() => router.push(`/administrar/usuarios/modelo/${v?.User?.id}`)}
                                >
                                    <Image
                                        src={v.url} alt="imagem" width={700} height={700} className="h-full w-auto border-2 border-gray object-contain"
                                    />
                                    <div className="w-full bg-primary-red p-4 text-bg rounded-b-lg">
                                        <p><b>Nome: </b> {v?.User?.name}</p>
                                        <p><b>Status da conta: </b> {v?.User?.accountStatus}</p>
                                    </div>
                                </div>
                            )) : <Title>Nenhuma mída aguardando aprovação encontrada.</Title>
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