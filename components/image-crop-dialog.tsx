'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRef, useState } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from './ui/button';

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  handleCropComplete: (imageDataUrl: string) => void;
}

const aspectRatio = 2046 / 1166;

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) => {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
};

export default function ImageCropDialog({
  open,
  onOpenChange,
  imageUrl,
  handleCropComplete,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();

  const imgRef = useRef<HTMLImageElement>(null);

  const cropComplete = async () => {
    const image = imgRef.current;
    if (!image || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
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
      offscreen.height
    );

    const blob = await offscreen.convertToBlob({ type: 'image/png' });
    handleCropComplete(URL.createObjectURL(blob));

    onOpenChange(false);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspectRatio));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
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
  );
}
