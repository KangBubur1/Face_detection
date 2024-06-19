import React from 'react';
import { IconType } from 'react-icons';

interface CardProps {
    title: String,
    value: number,
    icon: IconType;
}

const Card: React.FC<CardProps> = ({
    title,
    value,
    icon: Icon
}) => {
    return (
        <div className='bg-white rounded-lg sm:rounded-2xl shadow-sm  ring-1 ring-black/5 p-8 flex items-center h-auto w-full lg:w-40'>
            <div className="flex flex-col truncate">
                <div>
                    <h4 className='text-lg font-light opacity-50'>{title}</h4>
                </div>
                <div className="mt-2">
                    <p className="font-bold text-xl">{value}</p>
                </div>
            </div>
        </div>
    );
}

export default Card;