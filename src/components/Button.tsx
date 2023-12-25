interface ButtonProps
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    variant?: 'transparent' | 'contained'
}
export default function Button(props: ButtonProps) {
    return (
        <button
            {...props}
            className={`${props.className} w-48 rounded-2xl border 
            border-[#a6a295] bg-transparent p-2 
            transition duration-150 ease-in-out 
            hover:bg-[#b8b6ad] hover:text-[#ebe9e2] 
            active:bg-[#b8b6ad] active:text-[#ebe9e2]`}
        >
            {props.children}
        </button>
    )
}
