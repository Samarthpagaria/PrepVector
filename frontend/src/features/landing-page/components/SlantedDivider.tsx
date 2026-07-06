import React from 'react';

const SlantedDivider = () => {
    return (
        <div 
            className="w-full h-7 border-y border-white/20"
            style={{
                backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.07), rgba(255,255,255,0.07) 1px, transparent 1px, transparent 8px)',
                backgroundColor: '#050505'
            }}
        />
    );
};

export default SlantedDivider;
