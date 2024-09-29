import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    value: any
    onChange: any
    label?: string | null
    className?: string
    textClassName?: string
    inputClassName?: string
    restrictNumber?: boolean
    type?: any
}

export default function InputCustom({ className, textClassName, inputClassName, value, type, label, restrictNumber, onChange, ...inputProps }: InputProps) {
    const verifyNumbers = async (value: any) => {
        if (type === 'number' && restrictNumber) {
            var tempText = 0;
            // Substitua qualquer coisa que não seja um dígito numérico
            tempText = value.replace(/[^0-9]/g, '');
            onChange(tempText);
        } else {
            onChange(value);
        }
    }
    return (
        <div className={"w-full my-2 " + className}>
            {label &&
                <p className={"w-full text-left text-dark-bg dark:text-white " + textClassName}>{label}</p>
            }
            <input className={"w-full inputTheme shadow-xl " + inputClassName} type={type}
                onChange={(v) => verifyNumbers(v.target.value)} value={value}
                {...inputProps}
            />
        </div>
    );
}