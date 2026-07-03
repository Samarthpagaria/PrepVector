import React from 'react';
import ModernTemplate from '../assets/ModernTemplate';
import MinimalTemplate from '../assets/MinimalTemplate';
import MinimalImageTemplate from '../assets/MinimalImageTemplate';
import ClassicTemplate from '../assets/ClassicTemplate';
import AestheticTemplate from '../assets/AestheticTemplate';

interface ResumePreviewProps {
  data: any;
  template: string;
  accentColor: string;
  classes?: string;
  hideScroll?: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template, accentColor, classes = "", hideScroll = false }) => {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />;
      case "aesthetic":
        return <AestheticTemplate data={data} accentColor={accentColor} />;
      case "classic":
      default:
        // Adding Classic as a fallback since it exists in assets
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  return (
    <div className={`w-full bg-gray-100 flex justify-center rounded-xl ${hideScroll ? 'min-h-full py-8' : 'overflow-y-auto h-full'}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#a1a1aa transparent' }}>
      {/* 
        This wrapper holds the actual resume content. 
        It has standard borders/shadows for the web view, but they are removed during printing.
      */}
      <div 
        id="resume-preview" 
        className={`bg-white border border-gray-200 w-full max-w-[8.5in] min-h-[11in] shadow-xl print:shadow-none print:border-none ${classes}`}
      >
        {renderTemplate()}
      </div>

      {/* 
        =============================================================================
        PRINT STYLES EXPLANATION
        =============================================================================
        The CSS below specifically handles what happens when the user clicks "Print" 
        or "Save as PDF" in their browser.
        
        1. @page { size: letter; margin: 0; }
           - Forces the PDF output format to standard US Letter size (8.5x11 inches).
           - Removes browser default margins (headers/footers with dates/URLs).
           
        2. @media print { ... }
           - These styles ONLY apply during the printing process.
           
        3. body * { visibility: hidden; }
           - Hides the ENTIRE application UI (sidebars, navbars, buttons, etc.).
           
        4. #resume-preview, #resume-preview * { visibility: visible; }
           - Brings ONLY the resume template back into view.
           
        5. #resume-preview { position: absolute; left: 0; top: 0; ... }
           - Forces the resume to perfectly align to the top-left corner of the PDF.
           - Ensures it fills the exact dimensions of the letter page without bleeding.
        =============================================================================
      */}
      <style>{`
        @page {
          size: letter;
          margin: 0;
        }
        @media print {
          html, body {
            width: 8.5in;
            height: 11in;
            overflow: hidden;
            background: white;
          }
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePreview;
