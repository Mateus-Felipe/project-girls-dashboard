'use client'
import { useState, useEffect } from "react";
import Title from "@/app/components/title";
import CustomModal from "@/app/components/CustomModal";
import Header from "@/app/components/header";
import { axiosFetch } from "@/app/services/axiosFetch";
import { useRouter } from "next/navigation";
import { checkAuthInClient } from "../services/checkAuthInClient";
import ButtonCustom from "../components/ButtonCustom";
import Image from "next/image";
import userIcon from '@/app/images/icons/user.svg'

interface StatisticsProps {
    "usersCreated": number,
    "usersWaiting": number,
    "usersApproved": number,
    "usersBanned": number,
    "totalActiveUsers": number,
    "imagesWaitingApprovation": number
}

export default function page() {
    const [loading, setLoading] = useState(false);
    const [statisticsData, setStatisticsData] = useState<StatisticsProps | undefined>(undefined)
    const [TxtModal, setTxtModal] = useState([
        'Title',
        ['first message', 'second message'],
        false, // is open or close
        false, //cannot close?
    ]);
    const router = useRouter();

    const handleStatistics = async () => {
        if (loading) return;
        setLoading(true);

        const fetchData = await axiosFetch({ type: 'get', addAuth: true, url: '/admin/dashboard', body: undefined });
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

        if (!fetchData.data?.result) {
            setLoading(false)
            setStatisticsData(undefined)
            return
        }

        setStatisticsData(fetchData.data?.result);
        setLoading(false);
    }

    return (
        <>
            <Header loading={loading} />
            <div className="flex flex-col justify-start items-center w-full">
                <div className="!text-dark-bg dark:!text-white text-center my-16 font-bold w-10/12 flex flex-col items-center justify-center">
                    <Title className="!text-5xl">Seja bem vindo, administrador!</Title>
                    <p className="text-3xl mb-10">O que vamos fazer hoje?</p>

                    <ButtonCustom color={['bg-primary-orange', 'hover:bg-dark-orange']} clickFunction={() => router.push('/administrar/usuarios/modelo/midia')}>Aprovar mídias</ButtonCustom>
                    <ButtonCustom clickFunction={() => router.push('/administrar/usuarios/modelo')}>Aprovar usuários</ButtonCustom>
                    {
                        !statisticsData &&
                        <ButtonCustom color={['bg-dark-blue', 'hover:bg-darker-blue']} clickFunction={handleStatistics}>Carregar estatísticas</ButtonCustom>
                    }
                </div>

                {
                    loading && <Title>Carregando...</Title>
                }

                {
                    statisticsData && !loading && <div className="w-10/12 flex flex-col items-center justify-center">
                        <div className="w-full flex flex-row items-center justify-center">
                            <Title className="mr-1">Estatísticas</Title>
                            <Image
                                onClick={handleStatistics} alt="Recarregar" src={userIcon} className="cursor-pointer"
                            />
                        </div>
                        <div className="w-full flex flex-row flex-wrap items-center justify-between mt-6">
                            {statisticsData.totalActiveUsers != undefined &&
                                <div className="w-[32%] mr-[1%] mb-6 p-2 font-bold rounded-lg text-bg h-[150px] bg-dark-blue flex flex-col items-center justify-evenly">
                                    <div className="w-full flex flex-row items-center justify-evenly">
                                        <p>Usuários ativos: </p>
                                        <p>{statisticsData.totalActiveUsers}</p>
                                    </div>
                                </div>
                            }
                            {statisticsData.usersCreated != undefined &&
                                <div className="w-[32%] mr-[1%] mb-6 p-2 font-bold rounded-lg text-bg h-[150px] bg-dark-blue flex flex-col items-center justify-evenly">
                                    <div className="w-full flex flex-row items-center justify-evenly">
                                        <p>Usuários novos: </p>
                                        <p>{statisticsData.usersCreated}</p>
                                    </div>
                                    <div className="w-full flex flex-row items-center justify-evenly">
                                        <p>Ultimos 30 dias: (manutenção) </p>
                                        <p>{statisticsData.usersCreated}</p>
                                    </div>
                                </div>
                            }
                            {statisticsData.usersWaiting != undefined &&
                                <div className="w-[32%] mr-[1%] mb-6 p-2 font-bold rounded-lg text-bg h-[150px] bg-dark-blue flex flex-col items-center justify-evenly">
                                    <div className="w-full flex flex-row items-center justify-evenly">
                                        <p>Usuários aguardando aprovação: </p>
                                        <p>{statisticsData.usersWaiting}</p>
                                    </div>
                                    <div className="w-full flex flex-row items-center justify-evenly">
                                        <p>Ultimos 30 dias: (manutenção) </p>
                                        <p>{statisticsData.usersWaiting}</p>
                                    </div>
                                </div>
                            }
                            {statisticsData.usersApproved != undefined &&
                                <div className="w-[32%] mr-[1%] mb-6 p-2 font-bold rounded-lg text-bg h-[150px] bg-dark-blue flex flex-col items-center justify-evenly">
                                    <div className="w-full flex flex-row items-center justify-evenly">
                                        <p>Usuários aprovados: </p>
                                        <p>{statisticsData.usersApproved}</p>
                                    </div>
                                    <div className="w-full flex flex-row items-center justify-evenly">
                                        <p>Ultimos 30 dias: (manutenção) </p>
                                        <p>{statisticsData.usersApproved}</p>
                                    </div>
                                </div>
                            }
                            {statisticsData.usersBanned != undefined &&
                                <div className="w-[32%] mr-[1%] mb-6 p-2 font-bold rounded-lg text-bg h-[150px] bg-dark-blue flex flex-col items-center justify-evenly">
                                    <div className="w-full flex flex-row items-center justify-evenly">
                                        <p>Usuários suspensos: </p>
                                        <p>{statisticsData.usersBanned}</p>
                                    </div>
                                    <div className="w-full flex flex-row items-center justify-evenly">
                                        <p>Ultimos 30 dias: (manutenção) </p>
                                        <p>{statisticsData.usersApproved}</p>
                                    </div>
                                </div>
                            }
                            {statisticsData.imagesWaitingApprovation != undefined &&
                                <div className="w-[32%] mr-[1%] mb-6 p-2 font-bold rounded-lg text-bg h-[150px] bg-dark-blue flex flex-col items-center justify-evenly">
                                    <div className="w-full flex flex-row items-center justify-evenly">
                                        <p>Mídia aguardando aprovação: (manutenção) </p>
                                        <p>{statisticsData.imagesWaitingApprovation}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }

                <CustomModal
                    title={TxtModal[0]} text={TxtModal[1]}
                    open={TxtModal[2]} cannotClose={TxtModal[3]} handleClose={() => setTxtModal(['', [''], false, false])}
                />
            </div >
        </>
    );
}