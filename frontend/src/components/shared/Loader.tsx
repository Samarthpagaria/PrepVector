import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import lottieLogoUrl from '../../assets/prepVectorLogo.lottie?url';

interface LoaderProps {
  text?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = false, text }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="w-24 h-24 sm:w-32 sm:h-32">
        <DotLottieReact
          src={lottieLogoUrl}
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      {text && <p className="text-zinc-400 text-sm font-medium animate-pulse mt-2 max-w-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b]/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[300px]">
      {content}
    </div>
  );
};

export default Loader;
