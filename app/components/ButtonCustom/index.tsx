'use client'
import verifySaved from "@/app/services/verifySaved";
import { ReactNode, useEffect, useState } from "react";

interface buttonProps {
    children: ReactNode,
    className?: string
    color?: string[]
    clickFunction: any
    hidden?: boolean
}

export default function ButtonCustom({ children, className, color, clickFunction, hidden }: buttonProps) {

    return (
        <button className={`${color ? `${color[0]} ${color[1]}` : 'bg-primary-red hover:bg-dark-red'} rounded-lg p-[0.325rem] w-full text-2xl font-bold text-white mb-1
            transition-all duration-500
            ${hidden == true && '!w-0 opacity-0 cursor-default !h-0 !p-0 !text-sm'
            }
        ${className}`}
            onClick={() => { !hidden && clickFunction() }}
        >
            {children}
        </button>
    );
}