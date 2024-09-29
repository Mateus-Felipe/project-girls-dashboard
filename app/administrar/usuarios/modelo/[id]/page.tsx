'use client'
import { useState, useEffect } from "react";
import Title from "@/app/components/title";
import CustomModal from "@/app/components/CustomModal";
import Header from "@/app/components/header";
import { axiosFetch } from "@/app/services/axiosFetch";
import { useRouter } from "next/navigation";
import { User } from "@/app/services/userInterface";
import getIdByUrl from "@/app/services/getIdByUrl";
import Image from "next/image";
import Link from "next/link";
import verifyed from '@/app/images/icons/verifyed.png'
import ButtonCustom from "@/app/components/ButtonCustom";

export default function Modelo() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<User | undefined>(undefined)
    const [TxtModal, setTxtModal] = useState([
        'Title',
        ['first message', 'second message'],
        false, // is open or close
        false, //cannot close?
    ]);
    const router = useRouter();

    const handleChangeStatus = async (newStatus: 'approved' | 'banned' | 'created') => {
        if (!data || !data.id) {
            return setTxtModal([
                'Atenção',
                ['Ocorreu um erro.', 'Tente novamente recarregando a página.'],
                true, 'reload'
            ])
        }

        if (!newStatus || (newStatus != 'approved' && newStatus != 'banned' && newStatus != 'created')) {
            return setTxtModal([
                'Atenção',
                ['Status inválido', 'tente novamente recarregando a página'],
                true, 'reload'
            ])
        }

        setLoading(true);
        setTxtModal([
            'Carregando',
            ['Aguarde...'],
            true, true
        ])

        const fetchData = await axiosFetch({
            type: 'post', addAuth: true, body: {
                id: data.id, newStatus,
            }, url: '/admin/manager/user/account'
        })

        if (fetchData.invalidToken === true) {
            setTxtModal([
                'Login expirado!',
                ['Aguarde...'],
                true, true
            ])
            return router.push('/login')
        }
        if (!fetchData || fetchData.error === true || fetchData.data?.failed == true) {
            return setTxtModal([
                'Atenção',
                ['Ocorreu um erro ao carregar as informações!', fetchData?.data?.response?.data?.message, 'Tente novamente recarregando a página.'],
                true, 'reload'
            ])
        }
        setData(fetchData.data.result)
        setLoading(false)
        setTxtModal([
            '',
            [''],
            false, false
        ])
    }


    const handleImage = async (id: string, newState: 'approved' | 'denied') => {
        setLoading(true);
        if (!id || !newState || (newState != 'approved' && newState != 'denied')) {
            setTxtModal([
                'Atenção',
                ['Ocorreu um erro ao alterar o status da imagem', 'Status inválido', 'Tente novamente recarregando a página.'],
                true, 'reload'
            ]);
            return;
        }
        setTxtModal([
            'Carregando',
            ['Aguarde...'],
            true, true
        ]);

        const fetchData = await axiosFetch({
            type: 'post', addAuth: true, url: '/admin/manager/user/media', body: {
                id, status: newState
            }
        });
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
        window.location.reload()
    };

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setTxtModal([
                'Carregando',
                ['Aguarde...'],
                true, true
            ]);

            const fetchData = await axiosFetch({
                type: 'post', addAuth: true, url: '/admin/list/user', body: {
                    userId: getIdByUrl(window.location.pathname)
                }
            });
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
                [''],
                false, false
            ]);
        };
        fetch();
    }, []);

    return (
        <div>
            <Header />
            <Title>{loading ? 'Carregando' : data && data?.name ? data.name : ''}</Title>
            {
                data && data?.id && (
                    <div className="w-full flex items-center justify-center flex-col">
                        <div className="md:w-7/12 w-full bg-white shadow-xl border-[0.2px] border-gray flex super-small:flex-row flex-col items-center py-2
            justify-between text-black md:rounded-lg -mt-8">
                            <div className="super-small:w-[43%] w-[37%] flex flex-col items-center justify-evenly">
                                {
                                    data.profileImageUrl ?
                                        <Image alt="foto de perfil" width={600} height={600} src={data?.profileImageUrl || ''} loading="eager"
                                            className="super-small:w-[150px] super-small:h-[150px] w-[100px] h-[100px] object-cover rounded-full" />
                                        : <p>Sem foto de perfil</p>
                                }
                                {/* <div className="w-[150px] h-[150px] rounded-full bg-primary-orange" /> */}
                                <p className="super-small:text-xl text-base">{data && data?.localization}</p>
                            </div>
                            <div className="super-small:w-[57%] w-[80%] flex flex-col items-start justify-evenly text-left">
                                <div className="flex items-start justify-start md:flex-row flex-col w-full -mb-2">
                                    <h1 className="text-xll font-bold pt-2 text-left">
                                        {data && data?.name}
                                    </h1>
                                    {
                                        data?.accountStatus == 'approved' &&
                                        <p className="font-bold py-2 flex flex-row items-center justify-start md:w-auto md:ml-1 w-full text-dark-blue">
                                            <Image
                                                src={verifyed} alt="verificado" width={30} height={30} className="w-[17.5px] mr-1"
                                            />
                                            Perfil verificado
                                        </p>
                                    }
                                </div>
                                {
                                    data?.birthdate &&
                                    <p className="w-full"><b>{new Date().getFullYear() - new Date(data?.birthdate).getFullYear()}</b> Anos de idade</p>
                                }
                                {/* <AvailableNow className='!w-11/12' textClassName="super-small:text-xll text-base" /> */}
                                <p
                                    className={` 
                                        ${data?.accountStatus == 'created' ? 'text-dark-bg' : ''}
                                        ${data?.accountStatus == 'waiting' ? 'text-primary-orange' : ''}
                                        ${data?.accountStatus == 'approved' ? 'text-dark-green' : ''}
                                        ${data?.accountStatus == 'banned' ? 'text-dark-red' : ''}
                                        `}
                                ><b>Status:</b> {data?.accountStatus}</p>
                                <p><b>Id:</b> {data?.id}</p>
                                <p><b>nameId:</b> {data?.nameId}</p>
                                <p>Disponível agora</p>
                                <p><b>Criado em:</b> {data.created_at}</p>
                                <Link className="font-bold text-primary-orange" href={'/'}>Ver arquivos de verificação</Link>
                                <div className="w-11/12 flex items-center justify-between super-small:flex-row flex-col">
                                    <ButtonCustom clickFunction={() => { }} color={['bg-primary-blue', 'hover:bg-dark-blue']} className="super-small:!w-[48.9%] w-full super-small:text-xll text-xl">
                                        Anúncios
                                    </ButtonCustom>
                                    {
                                        data?.accountStatus != 'approved' &&
                                        <ButtonCustom clickFunction={() => {
                                            handleChangeStatus('approved')
                                        }} color={['bg-green', 'hover:bg-dark-green']} className="super-small:!w-[48.9%] w-full super-small:text-xll text-xl">
                                            Aprovar
                                        </ButtonCustom>
                                    }
                                </div>
                                <div className="w-11/12 flex items-center justify-between super-small:flex-row flex-col">
                                    {
                                        data?.accountStatus != 'created' &&
                                        <ButtonCustom clickFunction={() => {
                                            handleChangeStatus('created')
                                        }} color={['bg-primary-orange', 'hover:bg-dark-orange']} className="super-small:!w-[48.9%] w-full super-small:text-xll text-xl"
                                        >
                                            Solicitar configuração
                                        </ButtonCustom>
                                    }
                                    {
                                        data?.accountStatus != 'banned' &&
                                        <ButtonCustom clickFunction={() => {
                                            handleChangeStatus('banned')
                                        }} className="super-small:!w-[48.9%] w-full super-small:text-xll text-xl">
                                            Banir
                                        </ButtonCustom>
                                    }
                                </div>
                            </div>
                        </div>
                        <Title className="!text-left mt-5 md:w-7/12 w-full">Fotos: {data.Media.length}</Title>
                        <div className="w-full flex items-center justify-start flex-col super-larger:h-[65vh] h-[55vh]">
                            <div className="w-11/12 md:w-7/12 grid grid-cols-2 gap-4 items-start mt-5">
                                <div className="grid gap-4">
                                    {
                                        data && data?.Media?.length > 0 && data?.Media?.filter((d: any, i: any) => i % 2 == 0)?.map((v: any, i: any) => (
                                            <div className={`w-full max-h-[860px] flex flex-col items-center justify-between border-2 ${v.approved == 'waiting' ? 'border-gray' : ''} ${v.approved == 'approved' ? '!border-green' : ''} ${v.approved == 'denied' ? '!border-dark-orange' : ''}`}>
                                                <Image alt="foto" width={1200} height={1200} loading="lazy" src={v.url || ''} key={i} className="rounded-lg w-full h-full object-contain" />
                                                <div className="w-full flex flex-row items-center justify-center">
                                                    {
                                                        v?.approved == 'approved' && (
                                                            <ButtonCustom clickFunction={() => handleImage(v.id, 'denied')}>Negar foto já aprovada</ButtonCustom>
                                                        )
                                                    }
                                                    {
                                                        v?.approved == 'denied' && (
                                                            <>
                                                                <ButtonCustom clickFunction={() => handleImage(v.id, 'denied')}>Aprovar foto negada</ButtonCustom>
                                                                <ButtonCustom clickFunction={() => handleImage(v.id, 'denied')}>Deletar</ButtonCustom>
                                                            </>
                                                        )
                                                    }
                                                    {
                                                        v?.approved == 'waiting' && (
                                                            <>
                                                                <ButtonCustom clickFunction={() => handleImage(v.id, 'denied')} className="!rounded-r-none">Negar</ButtonCustom>
                                                                <ButtonCustom clickFunction={() => handleImage(v.id, 'approved')} color={['bg-primary-orange', 'hover:bg-dark-orange']} className="!rounded-l-none">Aprovar</ButtonCustom>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="grid gap-4">
                                    {
                                        data && data?.Media?.length > 0 && data?.Media?.filter((d: any, i: any) => i % 2 == 1)?.map((v: any, i: any) => (
                                            <div className={`w-full max-h-[860px] flex flex-col items-center justify-between border-2 ${v.approved == 'waiting' && 'border-gray'} ${v.approved == 'approved' && '!border-green'} ${v.approved == 'denied' && '!border-dark-orange '}`}>
                                                <Image alt="foto" width={1200} height={1200} loading="lazy" src={v?.url || ''} key={i} className="rounded-lg w-full h-full object-contain" />
                                                <div className="w-full flex flex-row items-center justify-center">
                                                    {
                                                        v?.approved == 'approved' && (
                                                            <ButtonCustom clickFunction={() => handleImage(v.id, 'denied')}>Negar foto já aprovada</ButtonCustom>
                                                        )
                                                    }
                                                    {
                                                        v?.approved == 'denied' && (
                                                            <>
                                                                <ButtonCustom clickFunction={() => handleImage(v.id, 'denied')}>Aprovar foto negada</ButtonCustom>
                                                                <ButtonCustom clickFunction={() => handleImage(v.id, 'denied')}>Deletar</ButtonCustom>
                                                            </>
                                                        )
                                                    }
                                                    {
                                                        v?.approved == 'waiting' && (
                                                            <>
                                                                <ButtonCustom clickFunction={() => handleImage(v.id, 'denied')} className="!rounded-r-none">Negar</ButtonCustom>
                                                                <ButtonCustom clickFunction={() => handleImage(v.id, 'approved')} color={['bg-primary-orange', 'hover:bg-dark-orange']} className="!rounded-l-none">Aprovar</ButtonCustom>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="w-10/12 md:w-7/12 flex items-start justify-start flex-col text-black dark:text-white my-20">
                                <Title className="!text-left mt-5 md:w-7/12 w-full">Descrição</Title>
                                <p className="text-xl text-wrap break-words whitespace-pre-line ">{data?.description ? data.description : 'Sem descrição'}</p>
                            </div>
                            <Title className="!text-left mt-5 md:w-7/12 w-full">Tags: {data?.tags?.length}</Title>
                            <div className="w-10/12 md:w-7/12 flex items-center justify-start flex-row flex-wrap pb-20">
                                {
                                    data?.tags && data.tags?.map((v, i): any => (
                                        <button onClick={() => { }} key={i} className="px-[6px] py-1 bg-primary-blue text-white font-normal text-center
                            border-[0.1px] border-gray/50 mb-1 mr-1 ">
                                            <p>{v}</p>
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )
            }

            <CustomModal
                title={TxtModal[0]} text={TxtModal[1]}
                open={TxtModal[2]} cannotClose={TxtModal[3]} handleClose={() => setTxtModal(['', [''], false, false])}
            />
        </div >
    );
}