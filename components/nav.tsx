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
    <nav className="flex p-16 justify-between">
      <Tooltip>
        <TooltipTrigger>
          <a href="https://1wei.dev/" target="_blank">
            <Image
              src="https://www.1wei.dev/assets/avatar.jpeg"
              height={200}
              width={200}
              alt="Yiwei Ho Avatar"
              className="h-14 w-14 rounded-full border-2 border-white shadow"
            />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>Made with 🤍 by Yiwei.</p>
        </TooltipContent>
      </Tooltip>

      <div className="flex items-center space-x-8">
        <DynamicTime />
        <Wifi className="h-7 w-7" />
        <BatteryFull className="h-7 w-7" />
      </div>
    </nav>
  )
}
