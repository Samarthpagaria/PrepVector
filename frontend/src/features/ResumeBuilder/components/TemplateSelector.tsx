import { Check, Layout } from 'lucide-react';
import React, { useState } from 'react';

const templates = [
  {
    id: "classic",
    name: "Classic",
    preview: "A clean, traditional resume format with clear sections and professional typography."
  },
  {
    id: "modern",
    name: "Modern",
    preview: "A sleek, contemporary design with a prominent header and clear visual hierarchy."
  },
  {
    id: "minimal",
    name: "Minimal",
    preview: "A highly spacious, elegant format focusing on typography and whitespace."
  },
  {
    id: "minimal-image",
    name: "Minimal (Image)",
    preview: "A layout featuring a profile image and clean sidebar contacts."
  },
  {
    id: "aesthetic",
    name: "Aesthetic",
    preview: "A beautiful 2-column layout with gradients, timeline indicators, and skill bars."
  },
  {
    id: "editorial",
    name: "Editorial",
    preview: "A stylish two-column layout with a light gray background and bold typography."
  },
  {
    id: "vibrant",
    name: "Vibrant",
    preview: "A highly visual, block-based layout with vibrant colors, pills, and dynamic shape accents."
  },
  {
    id: "scrapbook",
    name: "Scrapbook",
    preview: "A highly creative scrapbook-style layout with polaroids, sticky notes, and marker highlights."
  },
  {
    id: "cinematic",
    name: "Cinematic",
    preview: "A striking dark-themed layout with a massive hero image, white wireframe borders, and star accents."
  },
  {
    id: "studio",
    name: "Studio",
    preview: "A highly stylized beige layout with a giant name typography, rounded profile cards, and oversized quote marks."
  },
  {
    id: "aurora",
    name: "Aurora",
    preview: "A dark neon cyberpunk aesthetic with glassmorphism cards and a glowing pink timeline."
  }
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onChange: (id: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative'>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className='flex items-center gap-2 text-sm text-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30 hover:ring-emerald-500/50 transition-all px-3 py-2 rounded-lg font-medium'
      >
        <Layout size={16} /> 
        <span className='max-sm:hidden'>Template</span>
      </button>

      {isOpen && (
        <div className='absolute top-full right-0 w-72 p-3 mt-2 space-y-3 z-50 bg-[#121214] rounded-xl border border-zinc-800 shadow-2xl max-h-[60vh] overflow-y-auto' style={{ scrollbarWidth: 'thin', scrollbarColor: '#a1a1aa transparent' }}>
          {templates.map((template) => (
            <div 
              key={template.id} 
              onClick={() => {
                onChange(template.id);
                setIsOpen(false);
              }} 
              className={`relative p-3 border rounded-lg cursor-pointer transition-all ${
                selectedTemplate === template.id 
                  ? "border-emerald-500 bg-emerald-500/10" 
                  : "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50"
              }`}
            >
              <h4 className="font-semibold text-zinc-200 text-sm">{template.name}</h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{template.preview}</p>
              
              {selectedTemplate === template.id && (
                <div className="absolute top-3 right-3 text-emerald-500">
                  <Check size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
