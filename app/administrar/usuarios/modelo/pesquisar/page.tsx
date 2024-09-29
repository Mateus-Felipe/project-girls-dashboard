'use client'
import { useState } from "react";
import Title from "@/app/components/title";
import CustomModal from "@/app/components/CustomModal";
import Header from "@/app/components/header";
import { axiosFetch } from "@/app/services/axiosFetch";
import { useRouter } from "next/navigation";
import InputCustom from "@/app/components/input";
import { User } from "@/app/services/userInterface";
import ButtonCustom from "@/app/components/ButtonCustom";
import UserComponent from "@/app/components/userComponent";

export default function page() {
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('')
    const [statusQuery, setStatusQuery] = useState('all')
    const [searchedData, setSearchedData] = useState<User[] | undefined>(undefined)
    const [TxtModal, setTxtModal] = useState([
        'Title',
        ['first message', 'second message'],
        false, // is open or close
        false, //cannot close?
    ]);

    const handleSearch = async () => {
        if (loading) return;
        if (query.length <= 3 && statusQuery != 'banned') {
            return setTxtModal([
                'Por favor',
                ['Preencha o campo de pesquisa com mais algumas letras para evitar sobrecarga'],
                true, false
            ]);
        }
        setLoading(true);
        setTxtModal([
            'Carregando',
            ['Aguarde...'],
            true, true
        ]);

        const fetchData = await axiosFetch({
            type: 'post', addAuth: true, url: '/admin/list/users/search', body: {
                name: query, status: statusQuery
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
        setSearchedData(fetchData.data?.result)
        setLoading(false);
        setTxtModal([
            '',
            [''],
            false, false
        ]);
    }

    const router = useRouter();

    return (
        <div>
            <Header />
            <Title className="mt-16">Faça sua pesquisa</Title>
            <p className="text-center w-full">Você pode deixar o campo vazio, se o status for "banido"</p>
            <div className="w-full flex flex-col items-center justify-center">
                <div className="w-11/12 flex flex-col items-center justify-center">
                    <div className="flex flex-row items-center justify-center w-full">
                        <InputCustom placeholder="Nome ou id" onChange={(v: any) => setQuery(v)} value={query}
                            className="!w-8/12 !my-0 " inputClassName="!rounded-r-none !rounded-b-none"
                        />
                        <select
                            className="w-4/12 inputTheme !rounded-l-none !rounded-b-none !py-[1.16rem]"
                            value={statusQuery} onChange={(v) => setStatusQuery(v.target.value)}
                        >
                            <option value={'all'} >todos</option>
                            <option value={'created'} >Criado</option>
                            <option value={'waiting'} >Aguardando</option>
                            <option value={'approved'} >Aprovado</option>
                            <option value={'banned'} >Banido</option>
                        </select>
                    </div>
                    <ButtonCustom clickFunction={handleSearch} className="!rounded-t-none" >Pesquisar</ButtonCustom>
                    <div className="w-full flex flex-row items-start justify-start flex-wrap mt-5">
                        {
                            !loading && searchedData && (
                                searchedData?.length > 0 ?
                                    searchedData.map((v: User, i: any) => <UserComponent data={v} />)
                                    : <></>
                            )
                        }
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