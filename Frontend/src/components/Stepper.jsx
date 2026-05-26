import React from 'react';
import * as Icons from '../icons/icons.js';

export function Stepper({ label, value, onIncrease, onDecrease }) {
    return (
        <div className="flex items-center py-1.5">
            <span className="text-zinc-600 text-sm font-medium min-w-[100px]">{label}</span>

            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-full p-0.5 shadow-sm">
                <button onClick={onDecrease} className="w-6 h-6 flex items-center justify-center rounded-full text-zinc-400 hover:bg-white hover:text-beje-principal transition-all active:scale-90">
                    <Icons.FaMinus className="w-2" />
                </button>

                <span className="text-zinc-800 font-bold text-[13px] min-w-[10px] text-center">
                    {value}
                </span>

                <button onClick={onIncrease} className="w-6 h-6 flex items-center justify-center rounded-full text-zinc-400 hover:bg-white hover:text-beje-principal transition-all active:scale-90">
                    <Icons.FaPlus className="w-2" />
                </button>
            </div>
        </div>
    );
}

export default Stepper;