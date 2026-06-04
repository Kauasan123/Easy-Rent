import * as Icons from '../icons/icons.js'

export function CheckBox({ label, id, checked, onChange }) {
    return (
        <>
            <label htmlFor={id} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5">
                    <input type="checkbox" id={id} checked={checked} onChange={onChange} className="peer appearance-none w-full h-full border-2 border-borda-cards rounded-md  bg-white checked:bg-beje-principal checked:border-beje-principal transition-all duration-200 cursor-pointer" />
                    <Icons.FaCheck className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200" size={12.5} />
                </div>
                <span className="text-sm text-zinc-700 group-hover:text-beje-principal transition-colors font-medium">
                    {label}
                </span>
            </label>
        </>
    )
}

export default CheckBox;