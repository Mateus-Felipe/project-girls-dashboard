'use client'
import Link from "next/link";
import Header from "./components/header";
import Title from "./components/title";

export default function NotFound() {
  return (
    <div>
      <Header />
      <div className="w-full flex flex-col justify-center items-center">
        <Title>404</Title>
        <Title>Página não encontrada</Title>
        <Link href={"/"} className="text-primary-blue hover:text-dark-blue">- Página inicial</Link>
        <p
          onClick={() => {
            window.history.go(-1);
          }}
          className="text-primary-blue hover:text-dark-blue"
        >
          - Voltar
        </p>
      </div>
    </div>
  );
}
