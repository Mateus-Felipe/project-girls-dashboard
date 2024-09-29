'use client'
import React, { useEffect, useState } from "react";
import Title from "../title";
import ButtonCustom from "../ButtonCustom";
import { useRouter } from "next/navigation";

interface ModalProps {
    title: any,
    text: any,
    open: any,
    handleClose: any,
    cannotClose?: any
}

export default function CustomModal({ title, text, open, handleClose, cannotClose }: ModalProps) {
    const router = useRouter()
    return (
        <div
            className={`fixed left-0 flex
             ${open ? 'top-0 backdrop-blur-xl' : 'top-full backdrop-blur-none'} items-center justify-center w-full h-screen transition-all ${cannotClose === true ? 'z-50' : 'z-30'} `}>
            <div className="text-dark-bg dark:text-white bg-white dark:bg-darker-blue py-5 px-2 rounded-xl text-center shadow-xl
            border-r-[1px] border-b-[1px] border-t-[0.2px] border-l-[0.1px] border-t-dark-bg/20 border-l-dark-bg/20 border-dark-bg
            super-larger:w-7/12 w-10/12 flex flex-col items-center justify-between ">
                <Title className="md:text-4xl text-3xl">{title}</Title>
                <div className="text-left break-words whitespace-pre-line py-5 w-10/12">
                    {
                        text?.length > 0 && text.map((v: any) => (
                            <p key={v} className="text-xl" >{v}</p>
                        ))
                    }
                </div>
                <div className="mt-5 w-10/12">
                    {
                        cannotClose === true ? <p className="underline font-bold">AGUARDE...</p> : <>
                            <ButtonCustom clickFunction={() => {
                                if (cannotClose == 'reload') {
                                    return window.location.reload();
                                }
                                handleClose()
                            }}>Fechar</ButtonCustom>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}
