import { BatteryFull, Wifi } from 'lucide-react';
import Image from 'next/image';

export default function Nav() {
  return (
    <nav className="flex p-16 justify-between">
      <Image
        src="https://www.1wei.dev/assets/avatar.jpeg"
        height={200}
        width={200}
        alt="Yiwei Ho Avatar"
        className="h-16 w-16 rounded-full"
      />

      <div className="flex items-center space-x-8">
        <div className="flex items-end space-x-1">
          <p className="text-2xl">5:07</p>
          <p className="text-sm">PM</p>
        </div>
        <Wifi className="h-7 w-7" />
        <BatteryFull className="h-7 w-7" />
      </div>
    </nav>
  );
}
