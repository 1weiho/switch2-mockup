import DynamicTime from './dynamic-time'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { BatteryFull, Wifi } from 'lucide-react'
import Image from 'next/image'

export default function Nav() {
  return (
    <nav className="flex p-8 lg:p-16 pb-12 justify-between">
      <Tooltip>
        <TooltipTrigger>
          <a href="https://1wei.dev/" target="_blank">
            <Image
              src="https://www.1wei.dev/assets/avatar.jpeg"
              height={200}
              width={200}
              alt="Yiwei Ho Avatar"
              className="size-12 lg:size-14 rounded-full border-2 border-white shadow"
            />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>Made with 🤍 by Yiwei.</p>
        </TooltipContent>
      </Tooltip>

      <div className="flex items-center lg:space-x-8 space-x-6">
        <DynamicTime />
        <Wifi className="lg:size-7 size-5" />
        <BatteryFull className="lg:size-7 size-5" />
      </div>
    </nav>
  )
}
