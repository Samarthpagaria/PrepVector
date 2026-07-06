import React from 'react';

const AnimatedGradientBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
      {/* The glowing horizon at the bottom with breathing animation */}
      <div 
        className="absolute bottom-0 left-[-25%] w-[150%] h-[100%] animate-breathing opacity-90"
        style={{
          backgroundImage: 'radial-gradient(at bottom center, #f97316 0%, #ec4899 30%, #3b82f6 60%, transparent 80%)',
          filter: 'blur(40px)',
          transformOrigin: 'bottom center'
        }}
      />
    </div>
  );
};

export default AnimatedGradientBackground;
