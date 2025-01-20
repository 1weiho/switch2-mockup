'use client'

import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useCallback, useRef, useState } from 'react'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageUrl: string
  handleCropComplete: (imageDataUrl: string) => void
}

const aspectRatio = 2046 / 1166

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) => {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageCropDialog({
  open,
  onOpenChange,
  imageUrl,
  handleCropComplete,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop>()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const imgRef = useRef<HTMLImageElement>(null)
  const cropContainerRef = useRef<HTMLDivElement>(null)

  const cropComplete = async () => {
    const image = imgRef.current
    if (!image || !completedCrop) {
      throw new Error('Crop canvas does not exist')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    )

    const ctx = offscreen.getContext('2d')
    if (!ctx) {
      throw new Error('No 2d context')
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      offscreen.width,
      offscreen.height,
    )

    const blob = await offscreen.convertToBlob({ type: 'image/png' })
    handleCropComplete(URL.createObjectURL(blob))

    onOpenChange(false)
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspectRatio))
  }

  const preventTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault()
  }, [])

  const addTouchMoveListener = useCallback(() => {
    const container = cropContainerRef.current
    if (container) {
      container.addEventListener('touchmove', preventTouchMove, {
        passive: false,
      })
    }
  }, [preventTouchMove])

  const removeTouchMoveListener = useCallback(() => {
    const container = cropContainerRef.current
    if (container) {
      container.removeEventListener('touchmove', preventTouchMove)
    }
  }, [preventTouchMove])

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogDescription>
              Select a range to crop the photo.
            </DialogDescription>
          </DialogHeader>

          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
          >
            <img src={imageUrl} ref={imgRef} onLoad={onImageLoad} />
          </ReactCrop>

          <Button onClick={cropComplete}>Crop</Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Crop Image</DrawerTitle>
          <DrawerDescription>
            Select a range to crop the photo.
          </DrawerDescription>
        </DrawerHeader>

        <div
          ref={cropContainerRef}
          className="m-2"
          onTouchStart={addTouchMoveListener}
          onTouchEnd={removeTouchMoveListener}
        >
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            className="m-2"
          >
            <img src={imageUrl} ref={imgRef} onLoad={onImageLoad} />
          </ReactCrop>
        </div>

        <DrawerFooter className="pt-2">
          <Button onClick={cropComplete}>Crop</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
