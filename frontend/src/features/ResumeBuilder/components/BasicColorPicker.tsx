import { Portal } from "@ark-ui/react/portal";
import { ColorPicker, parseColor } from "@ark-ui/react/color-picker";
import { PipetteIcon, Palette } from "lucide-react";
import React from "react";

interface BasicColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export default function BasicColorPicker({ color, onChange }: BasicColorPickerProps) {
  let parsedColor;
  try {
    parsedColor = parseColor(color || "#10b981");
  } catch {
    parsedColor = parseColor("#10b981");
  }

  return (
    <div className="w-full">
      <ColorPicker.Root 
        value={parsedColor} 
        onValueChange={(details) => onChange(details.valueAsString)}
      >
        <div className="space-y-4">
          {/* Header with input and color swatch */}
          <ColorPicker.Trigger className="flex items-center gap-2 text-sm text-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30 hover:ring-emerald-500/50 transition-all px-3 py-2 rounded-lg font-medium cursor-pointer w-full outline-hidden">
            <Palette size={16} />
            <span className="max-sm:hidden">Accent</span>
          </ColorPicker.Trigger>

          {/* Color Picker Content */}
          <Portal>
            <ColorPicker.Positioner>
              <ColorPicker.Content className="bg-[#121214] border border-zinc-800 rounded-xl p-4 shadow-2xl space-y-4 z-50 w-72">
                {/* Color Area */}
                <ColorPicker.Area className="w-full h-32 rounded-md overflow-hidden relative">
                  <ColorPicker.AreaBackground className="w-full h-full" />
                  <ColorPicker.AreaThumb className="absolute w-4 h-4 bg-white border-2 border-zinc-900 rounded-full shadow-xs -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
                </ColorPicker.Area>

                {/* Eye Dropper and Sliders */}
                <div className="flex items-center gap-3">
                  <ColorPicker.EyeDropperTrigger className="p-2 text-zinc-400 hover:text-emerald-400 border border-zinc-700 rounded-md hover:bg-zinc-800 transition-colors">
                    <PipetteIcon className="w-4 h-4" />
                  </ColorPicker.EyeDropperTrigger>

                  <div className="flex-1 space-y-3">
                    {/* Hue Slider */}
                    <ColorPicker.ChannelSlider
                      channel="hue"
                      className="relative w-full h-3 rounded-full overflow-hidden cursor-pointer"
                    >
                      <ColorPicker.ChannelSliderTrack className="w-full h-full bg-linear-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500" />
                      <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-4 h-4 bg-white border-2 border-zinc-900 rounded-full shadow-xs -translate-y-1/2 -translate-x-1/2" />
                    </ColorPicker.ChannelSlider>

                    {/* Alpha Slider */}
                    <ColorPicker.ChannelSlider
                      channel="alpha"
                      className="relative w-full h-3 rounded-full overflow-hidden cursor-pointer"
                    >
                      <ColorPicker.TransparencyGrid className="w-full h-full [--size:8px]" />
                      <ColorPicker.ChannelSliderTrack className="w-full h-full" />
                      <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-4 h-4 bg-white border-2 border-zinc-900 rounded-full shadow-xs -translate-y-1/2 -translate-x-1/2" />
                    </ColorPicker.ChannelSlider>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="flex gap-2">
                  <ColorPicker.ChannelInput
                    channel="hex"
                    className="flex-1 px-3 py-2 text-sm border border-zinc-700 rounded-md bg-[#1e1e22] text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 uppercase"
                  />
                  <ColorPicker.ChannelInput
                    channel="alpha"
                    className="w-16 px-3 py-2 text-sm border border-zinc-700 rounded-md bg-[#1e1e22] text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </Portal>
        </div>
        <ColorPicker.HiddenInput />
      </ColorPicker.Root>
    </div>
  );
}
