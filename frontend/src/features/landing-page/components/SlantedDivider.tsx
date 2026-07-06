import React from 'react';

const SlantedDivider = () => {
    return (
        <div 
            className="w-full h-10 border-y border-zinc-800"
            style={{
                backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 8px)',
                backgroundColor: '#050505'
            }}
        />
    );
};

export default SlantedDivider;
