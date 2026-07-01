// Understand this page code .
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, BriefcaseBusiness, Link, Plus, Trash2, Save } from 'lucide-react';

interface PersonalInfoData {
  image?: string | File;
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  profession?: string;
  customLinks?: { name: string; url: string }[];
  removeBg?: boolean;
}

interface PersonalInfoFormProps {
  data: PersonalInfoData;
  onChange: (field: string, value: any) => void;
}

const fields = [
  {key: "full_name", label: "Full Name", icon: User, type: "text", required: true, placeholder: "John Doe"},
  {key: "email", label: "Email Address", icon: Mail, type: "email", required: true, placeholder: "john@example.com"},
  {key: "phone", label: "Phone Number", icon: Phone, type: "tel", placeholder: "+1 234 567 8900"},
  {key: "location", label: "Location", icon: MapPin, type: "text", placeholder: "New York, NY"},
  {key: "profession", label: "Profession", icon: BriefcaseBusiness, type: "text", placeholder: "Software Engineer"}
];

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  const [removeBg, setRemoveBg] = useState(data.removeBg || false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange('image', e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold bg-linear-to-r from-green-50 via-emerald-500 to-green-200 bg-clip-text text-transparent">
          Personal Information
        </h2>
        <p className="text-sm text-zinc-400 mt-1">Get started with the personal information</p>
      </div>

      {/* Image Upload */}
      <div className="flex items-center gap-6">
        <label className="cursor-pointer group flex items-center gap-4">
          {data.image ? (
            <img 
              src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image as Blob)} 
              alt="user-image" 
              className="h-16 w-16 rounded-full object-cover ring-2 ring-emerald-500/50 group-hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-zinc-900 border border-dashed border-zinc-700 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-950/20 transition-all duration-300">
              <User className="size-6 text-zinc-500 group-hover:text-emerald-400 transition-colors duration-300" />
            </div>
          )}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          {!data.image && <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">upload user image</span>}
        </label>
        
        {data.image && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
            <span className="text-sm font-medium text-zinc-300">Remove Background</span>
            <button 
              type="button"
              onClick={() => {
                const newValue = !removeBg;
                setRemoveBg(newValue);
                onChange('removeBg', newValue);
              }}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${removeBg ? 'bg-emerald-500' : 'bg-zinc-700'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${removeBg ? 'translate-x-4.5' : 'translate-x-1'}`} />
            </button>
          </div>
        )}
      </div>

      {/* Form Fields Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
        {fields.map((field) => (
          <div key={field.key} className={`flex flex-col gap-1.5 ${field.key === 'full_name' ? 'md:col-span-2' : ''}`}>
            <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
              <field.icon className="w-4 h-4 text-emerald-500/70" />
              {field.label}
              {field.required && <span className="text-red-400">*</span>}
            </label>
            <input 
              name={field.key}
              type={field.type}
              value={data[field.key as keyof PersonalInfoData] as string || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
            />
          </div>
        ))}
      </div>

      {/* Dynamic Links Section */}
      <div className="flex flex-col gap-3 mt-2">
        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2 border-b border-zinc-800/60 pb-2 mb-1">
          <Link className="w-4 h-4 text-emerald-500/70" />
          Profile Links
        </h3>
        
        {(data.customLinks || []).map((link, index) => (
          <div key={index} className="flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
            <div className="flex-1 flex flex-col gap-2 bg-black py-1 px-1.5 rounded-xl">
              <input 
                placeholder="Platform (e.g. LinkedIn, GitHub)"
                value={link.name}
                onChange={(e) => {
                  const newLinks = [...(data.customLinks || [])];
                  newLinks[index].name = e.target.value;
                  onChange('customLinks', newLinks);
                }}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
              />
              <input 
                placeholder="URL (e.g. https://github.com/...)"
                value={link.url}
                onChange={(e) => {
                  const newLinks = [...(data.customLinks || [])];
                  newLinks[index].url = e.target.value;
                  onChange('customLinks', newLinks);
                }}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
              />
            </div>
            <button 
              type="button"
              onClick={() => {
                const newLinks = (data.customLinks || []).filter((_, i) => i !== index);
                onChange('customLinks', newLinks);
              }}
              className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all shadow-sm"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => {
            const newLinks = [...(data.customLinks || []), { name: '', url: '' }];
            onChange('customLinks', newLinks);
          }}
          className="flex items-center justify-center gap-2 w-full py-2.5 mt-1 border border-dashed border-zinc-700 rounded-lg text-sm font-medium text-emerald-500 hover:bg-emerald-950/20 hover:border-emerald-500/50 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      </div>

      <div className="pt-4 mt-2 border-t border-zinc-800/60 flex justify-end">
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold rounded-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
