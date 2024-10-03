'use client'
import { useState, useEffect } from "react";
import Title from "@/app/components/title";
import CustomModal from "@/app/components/CustomModal";
import Header from "@/app/components/header";
import { axiosFetch } from "@/app/services/axiosFetch";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ButtonCustom from "@/app/components/ButtonCustom";
import InputCustom from "@/app/components/input";
import Image from "next/image";
import searchIcon from '@/app/images/icons/search.svg'

interface tags {
    id: string
    name: string
    created_at: any
    updated_at: any
}

export default function pages() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<tags[] | undefined>(undefined)
    const [search, setSearch] = useState('')
    const [selectedTag, setSelectedTag] = useState<tags | undefined>(undefined)
    const [nameTag, setNameTag] = useState('')
    const [password, setPassword] = useState('')
    const [modalCreateTag, setModalCreateTag] = useState<boolean>(false)
    const [TxtModal, setTxtModal] = useState([
        'Title',
        ['first message', 'second message'],
        false, // is open or close
        false, //cannot close?
    ]);
    const router = useRouter();

    const handleOpenEdit = (item: tags) => {
        setSelectedTag(item)
        setNameTag(item.name)
        setModalCreateTag(false)
    }

    const handleSearch = async () => {

    }

    const handleTags = async (type: 'create' | 'edit' | 'delete') => {
        if (loading) return;
        if (password.length <= 3 || nameTag.length <= 2) {
            return setTxtModal([
                'Atenção!',
                ['Preencha todos os campos corretamente.'],
                true, false
            ]);
        }
        setLoading(true)

        const fetchData = await axiosFetch({ type: 'post', addAuth: true, customHeaders: { temp_str: password }, body: { name: nameTag, id: selectedTag?.id }, url: `/admin/tags/${type}` })
        if (fetchData.error == true || fetchData.invalidToken == true || fetchData.data?.failed == true) {
            if (fetchData.invalidToken == true) {
                setTxtModal([
                    'Login expirado!',
                    ['Aguarde...'],
                    true, true
                ]);
                return router.push('/login');
            }
            setLoading(false)
            return setTxtModal([
                'Atenção',
                ['Ocorreu um erro ao carregar as informações!', fetchData?.data?.response?.data?.message, 'Tente novamente recarregando a página.'],
                true, false
            ]);
        }
        window.location.reload()
    }

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);

            const fetchData = await axiosFetch({ type: 'get', addAuth: true, url: '/tags', body: undefined });
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
            setData(fetchData.data.result)
            setLoading(false)
        };
        fetch();
    }, []);

    return (
        <div>
            <Header loading={loading} />

            <Title className="md:mt-20 text-center">Administrar tags</Title>
            <p className="text-primary-blue hover:font-bold hover:text-dark-orange cursor-pointer text-center" onClick={() => setModalCreateTag(true)}>Criar nova tag</p>

            <div className="w-full flex items-center justify-center">
                <div className="w-10/12 flex flex-row items-center justify-center">
                    <InputCustom placeholder="Pesquise ou deixe em branco" className="w-9/12" inputClassName="!rounded-r-none !rounded-b-none" value={search} onChange={(v: any) => setSearch(v)} />
                    <div className="inputTheme !rounded-l-none !rounded-b-none !py-[1.16rem] w-3/12 h-[58px] object-contain flex items-center justify-center hover:!bg-gray cursor-pointer bg-white transition-all" >
                        <Image src={searchIcon} alt="Pesquisar" onClick={handleSearch}
                            width={50} height={50} className="h-full object-contain"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full flex items-center justify-center">
                <div className="w-10/12 flex flex-row flex-wrap items-center justify-start mt-10">
                    {
                        data && data.length > 0 ? data.map((v: tags, i: any) => (
                            <div onClick={() => handleOpenEdit(v)} className="p-3 bg-light-blue hover:bg-primary-orange transition-all rounded-md font-bold cursor-pointer mr-2 mb-2 text-center" key={i}>
                                <p>{v.name}</p>
                            </div>
                        )) : loading == false ? <p className="text-center w-full">Nenhuma tag encontrada!</p> : <p className="text-center">Carregando...</p>
                    }
                </div>
            </div>
            <div className={`left-0 w-full h-screen fixed ${modalCreateTag ? 'top-0 backdrop-blur-md bg-dark-bg/80' : 'top-full backdrop-blur-none'} flex flex-col items-center justify-center transition-all `}>
                <div className="flex flex-col items-center justify-center w-10/12 bg-bg px-7 pt-12 rounded-lg">
                    <Title>Vamos criar uma tag {nameTag.length} </Title>
                    <InputCustom className="w-10/12" placeholder="digite o nome da tag" label={'Nome'} value={nameTag} onChange={(v: string) => setNameTag(v)} maxLength={15} />
                    <InputCustom className="w-10/12" type='password' placeholder="digite sua senha" label={'Senha'} value={password} onChange={(v: string) => setPassword(v)} />
                    <div className="flex flex-row items-center justify-between w-10/12 mt-7 mb-5 ">
                        <ButtonCustom className="!w-[48%]" clickFunction={() => { setModalCreateTag(false); setPassword(''); setNameTag('') }}>Cancelar</ButtonCustom>
                        <ButtonCustom className="!w-[48%]" color={['bg-primary-orange', 'hover:bg-dark-orange']} clickFunction={() => handleTags('create')}>Criar</ButtonCustom>
                    </div>
                </div>
            </div>

            <div className={`left-0 w-full h-screen fixed ${selectedTag && selectedTag?.id ? 'top-0 backdrop-blur-md bg-dark-bg/80' : 'top-full backdrop-blur-none'} flex flex-col items-center justify-center transition-all `}>
                <div className="flex flex-col items-center justify-center w-10/12 bg-bg px-7 pt-12 rounded-lg">
                    <Title>Editar Tag: <u>{selectedTag?.name}</u> </Title>
                    <InputCustom className="w-10/12" placeholder="digite o nome da tag" label={'Nome'} value={nameTag} onChange={(v: string) => setNameTag(v)} maxLength={15} />
                    <InputCustom className="w-10/12" type='password' placeholder="digite sua senha" label={'Senha'} value={password} onChange={(v: string) => setPassword(v)} />
                    <div className="flex md:flex-row flex-col items-center justify-between w-10/12 mt-7 mb-5 ">
                        <ButtonCustom className="md:!w-[32%] w-10/12" color={['bg-primary-blue', 'hover:bg-dark-blue']} clickFunction={() => { setSelectedTag(undefined); setPassword(''); setNameTag('') }}>Cancelar</ButtonCustom>
                        <ButtonCustom className="md:!w-[32%] w-10/12" clickFunction={() => handleTags('delete')}>Deletar</ButtonCustom>
                        <ButtonCustom className="md:!w-[32%] w-10/12" color={['bg-green', 'hover:bg-dark-green']} clickFunction={() => handleTags('edit')}>Editar</ButtonCustom>
                    </div>
                    <div className="bg-white w-10/12 rounded-md p-5 my-6">
                        {
                            loading ? <p className="w-full text-center">Carregando...</p> : <ButtonCustom clickFunction={() => { }}>Carregar usuários (manutenção) </ButtonCustom>
                        }
                        <div className="w-full flex flex-row flex-wrap items-start justify-start">

                        </div>
                    </div>
                </div>
            </div>

            <CustomModal
                title={TxtModal[0]} text={TxtModal[1]}
                open={TxtModal[2]} cannotClose={TxtModal[3]} handleClose={() => setTxtModal(['', [''], false, false])}
            />
        </div>
    );
}