import Image from "next/image";
import { User } from "../../services/userInterface";
import Link from "next/link";
import ButtonCustom from "../ButtonCustom";
import { useRouter } from "next/navigation";

interface UserComponentProps {
    data: User
}

export default function UserComponent({ data }: UserComponentProps) {
    const router = useRouter()

    return (
        <>

            <div className="md:w-[32%] py-4 text-white super-small:w-[49%] w-10/12 super-small:mr-[1%] bg-dark-bg rounded-lg flex flex-col items-center justify-center shadow-2xl">
                <div>
                    {
                        data?.profileImageUrl && data?.profileImageUrl.length > 0 ?
                            <Image
                                src={data?.profileImageUrl || ''} alt="foto de perfil" width={200} height={200}
                            /> : <p>Sem foto de perfil</p>
                    }
                </div>
                <div className="w-11/12 h-[0.5px] bg-bg my-2" />
                <div className="w-11/12 flex flex-col items-start justify-start">
                    <p><b>Nome</b> - {data.name}</p>
                    <p><b>Id</b> - {data.id}</p>
                    <p><b>Status</b> - {data.accountStatus}</p>
                    <p><b>Criado em</b> - {data.created_at}</p>
                    <Link href={(process.env.DEV == 'true' ? 'http://localhost:3000' : process.env.PRODUCTION_PAGE) + `/modelo/${data.nameId}`} target="_black" className="text-primary-yellow font-bold underline text-center w-full" >Ver página</Link>
                    <ButtonCustom className="mt-2" clickFunction={() => router.push(`/administrar/usuarios/modelo/${data.nameId}`)}>Ver Perfil</ButtonCustom>
                </div>
            </div>
        </>
    );
}