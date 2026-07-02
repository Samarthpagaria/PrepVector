import React, { useState } from 'react';
import { Download, ChevronDown, MessageSquare, Activity } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface QuestionScore {
  question: string;
  score: number;
  feedback: string;
  confidence: number;
  communication: number;
  correctness: number;
}

interface ReportData {
  finalScore: number;
  confidence: number;
  communication: number;
  correctness: number;
  questionWiseScore: QuestionScore[];
}

interface ReportProps {
  report: ReportData;
}

const CircularProgress = ({ value, label, color }: { value: number, label: string, color: string }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((value || 0) / 10) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#121214] rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden group">
      <div 
        className="absolute w-24 h-24 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700"
        style={{ backgroundColor: color }}
      ></div>
      
      <div className="relative flex items-center justify-center w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-zinc-800/50"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1500 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white">{(value || 0).toFixed(1)}</span>
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">/ 10</span>
        </div>
      </div>
      <span className="text-sm font-semibold text-zinc-400 tracking-wide uppercase text-center">{label}</span>
    </div>
  );
};

const QuestionCard = ({ item, index }: { item: QuestionScore, index: number }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className={`bg-[#121214] border rounded-3xl overflow-hidden transition-all duration-500 ${isOpen ? 'border-zinc-700 shadow-xl' : 'border-zinc-800/50 hover:border-zinc-700'}`}>
      <div 
        className="p-5 md:p-6 flex items-start md:items-center justify-between cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-start md:items-center gap-4 flex-1 pr-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 transition-colors ${isOpen ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20'}`}>
            {index + 1}
          </div>
          <h3 className={`text-base md:text-lg font-medium transition-colors ${isOpen ? 'text-white' : 'text-zinc-300'}`}>
            {item.question}
          </h3>
        </div>
        <div className="flex items-center gap-6 shrink-0 mt-3 md:mt-0">
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black text-white">{(item.score || 0).toFixed(1)}</span>
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Score</span>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="text-zinc-400 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-5 md:p-6 border-t border-zinc-800/50 bg-[#0a0a0b]/30">
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
              <div className="p-4 bg-[#121214] rounded-2xl border border-zinc-800/50">
                <span className="text-[10px] md:text-xs text-zinc-500 block mb-1 uppercase font-bold tracking-widest">Confidence</span>
                <span className="text-xl md:text-2xl font-black text-blue-400">{(item.confidence || 0).toFixed(1)} <span className="text-xs text-zinc-600 font-semibold">/10</span></span>
              </div>
              <div className="p-4 bg-[#121214] rounded-2xl border border-zinc-800/50">
                <span className="text-[10px] md:text-xs text-zinc-500 block mb-1 uppercase font-bold tracking-widest">Communication</span>
                <span className="text-xl md:text-2xl font-black text-purple-400">{(item.communication || 0).toFixed(1)} <span className="text-xs text-zinc-600 font-semibold">/10</span></span>
              </div>
              <div className="p-4 bg-[#121214] rounded-2xl border border-zinc-800/50">
                <span className="text-[10px] md:text-xs text-zinc-500 block mb-1 uppercase font-bold tracking-widest">Correctness</span>
                <span className="text-xl md:text-2xl font-black text-amber-400">{(item.correctness || 0).toFixed(1)} <span className="text-xs text-zinc-600 font-semibold">/10</span></span>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                AI Feedback
              </h4>
              <p className="text-zinc-300 leading-relaxed text-sm md:text-base bg-[#121214] p-5 rounded-2xl border border-zinc-800/50 whitespace-pre-wrap">
                {item.feedback || "No feedback provided."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Report = ({ report }: ReportProps) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    
    // Use a small timeout to allow React to render the "Generating..." state
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const doc = new jsPDF();
      
      doc.setFillColor(16, 185, 129);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('Interview Assessment Report', 14, 25);
      
      doc.setFillColor(245, 245, 245);
      doc.rect(14, 50, 182, 30, 'F');

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'bold');
      doc.text(`Overall Score: ${(report?.finalScore || 0).toFixed(1)}/10`, 20, 62);
      doc.text(`Confidence: ${(report?.confidence || 0).toFixed(1)}/10`, 65, 62);
      doc.text(`Communication: ${(report?.communication || 0).toFixed(1)}/10`, 110, 62);
      doc.text(`Correctness: ${(report?.correctness || 0).toFixed(1)}/10`, 155, 62);

      const tableColumn = ["#", "Question", "Score", "Feedback"];
      const tableRows: any[] = [];

      (report?.questionWiseScore || []).forEach((q, index) => {
        const rowData = [
          index + 1,
          q.question,
          `${(q.score || 0).toFixed(1)}/10`,
          q.feedback || "N/A"
        ];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        startY: 95,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 6 },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 55 },
          2: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
          3: { cellWidth: 'auto' }
        },
        alternateRowStyles: { fillColor: [250, 250, 250] }
      });

      doc.save('Interview_Report.pdf');
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF report.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-zinc-400 font-medium animate-pulse">Generating detailed report...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Results Ready</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
            Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Report</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
            Here's a detailed breakdown of your mock interview. Review the feedback closely to improve your answering strategies.
          </p>
        </div>
        <button 
          onClick={handleDownloadPDF}
          disabled={isGeneratingPdf}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-200 font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:-translate-y-1 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:-translate-y-0"
        >
          {isGeneratingPdf ? (
            <>
              <div className="w-5 h-5 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download PDF
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
        <CircularProgress value={report.finalScore} label="Overall Score" color="#10b981" />
        <CircularProgress value={report.confidence} label="Confidence" color="#60a5fa" />
        <CircularProgress value={report.communication} label="Communication" color="#c084fc" />
        <CircularProgress value={report.correctness} label="Correctness" color="#fbbf24" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          Detailed Breakdown
          <span className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-full font-semibold">{(report.questionWiseScore || []).length} Questions</span>
        </h2>
        <div className="flex flex-col gap-5">
          {(report.questionWiseScore || []).map((q, idx) => (
            <QuestionCard key={idx} item={q} index={idx} />
          ))}
        </div>
      </div>
      
      <div className="h-20"></div>
    </div>
  );
};

export default Report;