'use client'

import BackgroundSelectionDialog from './background-selection-dialog'
import ImageCropDialog from './image-crop-dialog'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Download, ImageIcon, Palette } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'

// Switch frame's actual dimensions
const SWITCH_WIDTH = 1920
const SWITCH_HEIGHT = 1080

// Switch screen's relative position and size (adjusted based on the original image)
const SCREEN = {
  x: 320,
  y: 210,
  width: 1280,
  height: 660,
}

export default function SwitchMockup() {
  const [userImage, setUserImage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [openImageCropDialog, setOpenImageCropDialog] = useState(false)
  const [openBackgroundDialog, setOpenBackgroundDialog] = useState(false)
  const [background, setBackground] = useState<{
    from: string
    to: string
  } | null>({
    from: '#7dd3fc',
    to: '#fda4af',
  })

  const drawImage = useCallback((imageUrl: string) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Load user image
    const userImg = new Image()
    userImg.crossOrigin = 'anonymous'
    userImg.src = imageUrl

    userImg.onload = () => {
      // Calculate user image's scale ratio
      const scale = Math.min(
        SCREEN.width / userImg.width,
        SCREEN.height / userImg.height,
      )

      // Calculate scaled dimensions
      const scaledWidth = userImg.width * scale
      const scaledHeight = userImg.height * scale

      // Calculate centered position
      const x = SCREEN.x + (SCREEN.width - scaledWidth) / 2
      const y = SCREEN.y + (SCREEN.height - scaledHeight) / 2

      // Draw user image
      ctx.drawImage(userImg, x, y, scaledWidth, scaledHeight)
    }
  }, [])

  const drawSwitchFrame = useCallback(
    (userImageUrl?: string) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      // Set Canvas to Switch's full dimensions
      canvas.width = SWITCH_WIDTH
      canvas.height = SWITCH_HEIGHT

      if (background) {
        // background gradient
        const gradient = ctx.createLinearGradient(
          0,
          0,
          SWITCH_WIDTH,
          SWITCH_HEIGHT,
        )
        gradient.addColorStop(0, background.from)
        gradient.addColorStop(1, background.to)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, SWITCH_WIDTH, SWITCH_HEIGHT)
      } else {
        // Clear the canvas for transparent background
        ctx.clearRect(0, 0, SWITCH_WIDTH, SWITCH_HEIGHT)
      }

      // Load Switch frame image
      const switchImage = new Image()
      switchImage.crossOrigin = 'anonymous'
      switchImage.src = '/assets/switch2-mock.png'

      switchImage.onload = () => {
        // Draw Switch frame
        ctx.drawImage(switchImage, 0, 0, SWITCH_WIDTH, SWITCH_HEIGHT)

        // Draw user image if available
        if (userImageUrl) {
          drawImage(userImageUrl)
        }
      }
    },
    [background, drawImage],
  )

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        setUserImage(dataUrl)
        setOpenImageCropDialog(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = (imageDataUrl: string) => {
    setUserImage(imageDataUrl)
    drawSwitchFrame(imageDataUrl)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'switch-mock.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleBackgroundSelection = (
    newBackground: { from: string; to: string } | null,
  ) => {
    setBackground(newBackground)
    drawSwitchFrame(userImage || undefined)
  }

  useEffect(() => {
    drawSwitchFrame(userImage || undefined)
  }, [drawSwitchFrame, userImage, background])

  return (
    <>
      <ImageCropDialog
        open={openImageCropDialog}
        onOpenChange={setOpenImageCropDialog}
        imageUrl={userImage ?? ''}
        handleCropComplete={handleCropComplete}
      />
      <BackgroundSelectionDialog
        open={openBackgroundDialog}
        onOpenChange={setOpenBackgroundDialog}
        onSelectBackground={handleBackgroundSelection}
      />
      <div className="w-full max-w-4xl px-6 mx-auto mt-20 lg:mt-0">
        <h1 className="text-xl lg:text-2xl text-teal-400">Switch 2 Mockup</h1>

        <div className="relative w-full rounded-lg overflow-hidden border-teal-400 border-[3px] p-1 mt-2">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain rounded-lg"
            style={{
              aspectRatio: `${SWITCH_WIDTH}/${SWITCH_HEIGHT}`,
            }}
          />
        </div>

        <div className="flex gap-8 justify-center mt-12">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            aria-hidden="true"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleUploadButtonClick}
                variant="ghost"
                className="h-16 w-16 rounded-full shadow-sm bg-white text-red-500 [&_svg]:size-8 hover:text-red-500"
              >
                <ImageIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload image</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setOpenBackgroundDialog(true)}
                variant="ghost"
                className="h-16 w-16 rounded-full shadow-sm bg-white text-green-500 [&_svg]:size-8 hover:text-green-500"
              >
                <Palette />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Change background</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleDownload}
                disabled={!userImage}
                variant="ghost"
                className="h-16 w-16 rounded-full shadow-sm bg-white text-blue-500 [&_svg]:size-8 hover:text-blue-500"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download mockup</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  )
}
