import { Separator } from '@/components/ui/separator'
import { Github, X } from 'lucide-react'

export default function Footer() {
  return (
    <div className="w-[96%] mx-auto mt-24">
      <Separator className="bg-black " />
      <div className="flex justify-end space-x-12 px-8 mt-4">
        <a
          className="flex items-center space-x-2"
          href="https://x.com/1weiho"
          target="_blank"
        >
          <span className="bg-black rounded-full h-6 w-6 text-white flex items-center justify-center">
            <X className="h-4 w-4" />
          </span>
          <span>Twitter</span>
        </a>

        <a
          className="flex items-center space-x-2"
          href="https://github.com/1weiho/switch2-mockup"
          target="_blank"
        >
          <span className="bg-black rounded-full h-6 w-6 text-white flex items-center justify-center">
            <Github className="h-4 w-4" />
          </span>
          <span>GitHub</span>
        </a>
      </div>
    </div>
  )
}
