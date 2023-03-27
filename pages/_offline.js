import { Icon } from '@iconify/react';
import baselineWifiOff from '@iconify/icons-ic/baseline-wifi-off';

const Fallback = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Icon icon={baselineWifiOff} width={256} height={256} className="text-sky-300"/>
      <p className="text-center mt-4">You are Offline...</p>
    </div>
  );
};

export default Fallback;