'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';

// Switch frame's actual dimensions
const SWITCH_WIDTH = 1920;
const SWITCH_HEIGHT = 1080;

// Switch screen's relative position and size (adjusted based on the original image)
const SCREEN = {
  x: 460,
  y: 270,
  width: 1000,
  height: 560,
};

export default function SwitchMock() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawSwitchFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Set Canvas to Switch's full dimensions
    canvas.width = SWITCH_WIDTH;
    canvas.height = SWITCH_HEIGHT;

    // Load Switch frame image
    const switchImage = new Image();
    switchImage.crossOrigin = 'anonymous';
    switchImage.src = '/assets/switch2-mock.png';

    switchImage.onload = () => {
      // Draw Switch frame
      ctx.drawImage(switchImage, 0, 0, SWITCH_WIDTH, SWITCH_HEIGHT);
    };
  }, []);

  useEffect(() => {
    drawSwitchFrame();
  }, [drawSwitchFrame]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setUserImage(dataUrl);
        drawImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImage = useCallback(
    (imageUrl: string) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      // Load user image
      const userImg = new Image();
      userImg.crossOrigin = 'anonymous';
      userImg.src = imageUrl;

      userImg.onload = () => {
        // Redraw Switch frame
        drawSwitchFrame();

        // Calculate user image's scale ratio
        const scale = Math.min(
          SCREEN.width / userImg.width,
          SCREEN.height / userImg.height
        );

        // Calculate scaled dimensions
        const scaledWidth = userImg.width * scale;
        const scaledHeight = userImg.height * scale;

        // Calculate centered position
        const x = SCREEN.x + (SCREEN.width - scaledWidth) / 2;
        const y = SCREEN.y + (SCREEN.height - scaledHeight) / 2;

        // Draw user image
        ctx.drawImage(userImg, x, y, scaledWidth, scaledHeight);
      };
    },
    [drawSwitchFrame]
  );

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'switch-mock.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl space-y-4">
        <div className="relative w-full bg-black rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain bg-gradient-to-br from-sky-200 to-rose-100"
            style={{
              aspectRatio: `${SWITCH_WIDTH}/${SWITCH_HEIGHT}`,
            }}
          />
        </div>

        <div className="flex space-x-4">
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="cursor-pointer"
          />
          <Button
            onClick={handleDownload}
            disabled={!userImage}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
