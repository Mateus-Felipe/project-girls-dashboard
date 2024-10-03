'use client'
import HamburgerIcon from "./hamburguerIcon";
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import { checkAuthInClient } from "@/app/services/checkAuthInClient";
import Link from "next/link";

interface headerProps {
    loading?: boolean;
}

export default function Header({ loading }: headerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [loadingPage, setLoadingPage] = useState(false)
    const [littleDots, setLittleDots] = useState(0)
    const [userData, setUserData] = useState<any>(null)
    const router = useRouter();


    const clickMenu = () => {
        if (isOpen) {
            //? Close Menu
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    };

    const openPage = (page: string) => {
        // var currentPage = window.location.pathname;
        // currentPage = currentPage.charAt(currentPage.length - 1);
        // console.log(currentPage);
        console.log(window.location);
        console.log((page == window.location.pathname) || (page == window.location.pathname + '/'));
        if ((page == window.location.pathname) || (page == window.location.pathname + '/')) {
            clickMenu();
        }
        router.push(page);
    }

    const handleKeyPress = (event: any) => {
        if (event?.key === 'Escape') {
            clickMenu();
        }
    };


    useEffect(() => {
        setLoadingPage(loading || false);
    }, [loading])

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!loadingPage) {
                return;
            }
            setLittleDots(prevDots => (prevDots + 1) % 3);
        }, 100);

        return () => clearInterval(intervalId); // Limpa o intervalo quando o componente é desmontado
    }, [loadingPage]);


    useEffect(() => {
        const fetch = async () => {
            const cookieData = await checkAuthInClient('athtk')
            if (!cookieData || cookieData == '') {
                setUserData(false)
                return router.push('/login')
            }
            setUserData(cookieData)
        }
        fetch();
    }, []);

    return (
        <div id="headerComponent" onKeyDown={e => isOpen ? handleKeyPress(e) : () => { }} tabIndex={0} className="w-full">
            <div className="flex flex-row flex-wrap w-full text-bg bg-dark-bg p-7 justify-end items-center align-middle relative z-30">
                {userData && (
                    <HamburgerIcon isOpen={isOpen} onClick={clickMenu} />
                )
                }
                <div className="flex flex-col items-center justify-center w-full">
                    <Link href={'/'} className="w-full text-right text-light-text font-bold md:text-4xl super-small:text-3xl text-xl text-bg" >Dashboard de Administrador</Link>
                    {
                        loading && <p className="text-light-text">Carregando{littleDots == 0 ? '.' : littleDots == 1 ? '..' : '...'}</p>
                    }
                </div>
            </div>
            {/* Menu */}
            <div className={`w-full h-screen fixed ${isOpen ? 'left-0 backdrop-blur-sm' : 'backdrop-blur-none -left-full'} z-20 transition-all `} onKeyDown={handleKeyPress} tabIndex={0}>
                <div className="relative flex flex-col text-light-text w-5/12 h-full justify-center items-start overflow-auto bg-dark-bg text-bg">
                    <p className="ml-2 md:ml-10 text-2xl font-bold cursor-pointer" onClick={() => openPage('//')}>Inicio</p>
                    <p className="ml-2 md:ml-10 text-2xl font-bold cursor-pointer" onClick={() => openPage('/administrar/usuarios/modelo/pesquisar')}>Pesquisar modelos</p>
                    <p className="ml-2 md:ml-10 text-2xl font-bold cursor-pointer" onClick={() => openPage('/administrar/usuarios/modelo')}>- Usuários aguardando aprovação</p>
                    <p className="ml-2 md:ml-10 text-2xl font-bold cursor-pointer" onClick={() => openPage('/administrar/usuarios/modelo/midia')}>- Mídias aguardando aprovação</p>
                    <p className="ml-2 md:ml-10 text-2xl font-bold cursor-pointer" onClick={() => openPage('/administrar/tags')}>Gerenciar Tags</p>
                    <p className="ml-2 md:ml-10 text-2xl text-warning-custom" onClick={() => openPage('/login/')}>Desconectar</p>
                </div>
            </div>
        </div>
    );
}