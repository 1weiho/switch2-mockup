import { Button } from '@/components/ui/button'
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
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useState } from 'react'

const gradients = [
  { name: 'Sky to Rose', from: '#7dd3fc', to: '#fda4af' },
  { name: 'Emerald to Teal', from: '#6ee7b7', to: '#5eead4' },
  { name: 'Violet to Indigo', from: '#a78bfa', to: '#818cf8' },
  { name: 'Amber to Orange', from: '#fcd34d', to: '#fb923c' },
]

interface BackgroundSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectBackground: (background: { from: string; to: string } | null) => void
}

export default function BackgroundSelectionDialog({
  open,
  onOpenChange,
  onSelectBackground,
}: BackgroundSelectionDialogProps) {
  const [selectedBackground, setSelectedBackground] = useState<string | null>(
    null,
  )
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleSelectBackground = () => {
    if (selectedBackground === 'transparent') {
      onSelectBackground(null)
    } else {
      const gradient = gradients.find((g) => g.name === selectedBackground)
      if (gradient) {
        onSelectBackground(gradient)
      }
    }
    onOpenChange(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Background</DialogTitle>
            <DialogDescription>
              Choose a background color for the canvas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RadioGroup
              onValueChange={setSelectedBackground}
              defaultValue={selectedBackground || gradients[0].name}
            >
              {gradients.map((gradient) => (
                <div
                  key={gradient.name}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem value={gradient.name} id={gradient.name} />
                  <Label
                    htmlFor={gradient.name}
                    className="flex items-center gap-2 justify-between w-full"
                  >
                    {gradient.name}
                    <div
                      className="w-8 h-8 rounded"
                      style={{
                        background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
                      }}
                    />
                  </Label>
                </div>
              ))}
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem value="transparent" id="transparent" />
                <Label htmlFor="transparent">Transparent</Label>
              </div>
            </RadioGroup>
          </div>
          <Button onClick={handleSelectBackground}>Apply Background</Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select Background</DrawerTitle>
          <DrawerDescription>
            Choose a background color for the canvas.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 m-6">
          <RadioGroup
            onValueChange={setSelectedBackground}
            defaultValue={selectedBackground || gradients[0].name}
          >
            {gradients.map((gradient) => (
              <div key={gradient.name} className="flex items-center space-x-2">
                <RadioGroupItem value={gradient.name} id={gradient.name} />
                <Label
                  htmlFor={gradient.name}
                  className="flex items-center gap-2 justify-between w-full"
                >
                  {gradient.name}
                  <div
                    className="w-8 h-8 rounded"
                    style={{
                      background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
                    }}
                  />
                </Label>
              </div>
            ))}
            <div className="flex items-center space-x-2 py-2">
              <RadioGroupItem value="transparent" id="transparent" />
              <Label htmlFor="transparent">Transparent</Label>
            </div>
          </RadioGroup>
        </div>

        <DrawerFooter className="pt-2">
          <Button onClick={handleSelectBackground}>Apply Background</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
