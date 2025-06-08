import React from 'react';
import { Radio } from 'antd';
import very_sad from '../../../../../assets/icons/emoji/very_sad.png';
import sad from '../../../../../assets/icons/emoji/sad.png';
import normal from '../../../../../assets/icons/emoji/normal.png';
import happy from '../../../../../assets/icons/emoji/happy.png';
import very_happy from '../../../../../assets/icons/emoji/very_happy.png';

const EmojiRating = ({ question, options, value, onChange }) => {
    return (
        <div className="mb-6">
            <p className="mb-4">{question}</p>
            <div className="w-full flex justify-between radio_select">
                {options.map((option, index) => (
                    <div
                        key={option.value}
                        className="flex-1 text-center relative"
                        onClick={() => onChange?.({ target: { value: option.value } })}
                    >
                        <div className="flex flex-col items-center gap-2 cursor-pointer">
                            <div className="relative">
                                {index === 0 && <img src={very_sad} alt="very_sad" className={`w-10 h-10 transition-transform duration-300 ${value === option.value ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`} />}
                                {index === 1 && <img src={sad} alt="sad" className={`w-10 h-10 transition-transform duration-300 ${value === option.value ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`} />}
                                {index === 2 && <img src={normal} alt="normal" className={`w-10 h-10 transition-transform duration-300 ${value === option.value ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`} />}
                                {index === 3 && <img src={happy} alt="happy" className={`w-10 h-10 transition-transform duration-300 ${value === option.value ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`} />}
                                {index === 4 && <img src={very_happy} alt="very_happy" className={`w-10 h-10 transition-transform duration-300 ${value === option.value ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`} />}
                            </div>
                            <span className={`text-sm ${value === option.value ? 'text-[#faad14] font-medium ' : 'text_secondary'}`}>
                                {option.label}
                            </span>
                        </div>
                        <Radio
                            value={option.value}
                            checked={value === option.value}
                            className="hidden"
                            onChange={() => { }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmojiRating; 