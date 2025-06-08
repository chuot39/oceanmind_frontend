import React from 'react';

const SwitchCheck = ({ value, onChange }) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input checked={value} onChange={onChange} type="checkbox" defaultValue className="sr-only peer" />
            <div className="peer bg-rose-400 rounded-full outline-none duration-300 after:duration-500 w-6 h-6 shadow-md peer-checked:bg-emerald-500 
                peer-focus:outline-none after:content-['✖️'] after:rounded-full after:absolute after:outline-none after:h-4 after:w-4 
                after:bg-gray-50 after:top-1 after:left-1 after:flex after:justify-center after:items-center after:scale-75 
                peer-checked:after:content-['✔️'] after:-rotate-180 peer-checked:after:rotate-0">
            </div>
        </label>
    );
}

export default SwitchCheck;
