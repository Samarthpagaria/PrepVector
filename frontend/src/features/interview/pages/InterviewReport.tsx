import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useGetInterviewReport } from '../hooks/useInterview';
import { ChevronLeft, BrainCircuit, Activity, MessageSquare, Target, CheckCircle, Download, Loader2 } from 'lucide-react';
import Loader from '../../../components/shared/Loader';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend
} from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

const InterviewReport = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const { data: reportData, isLoading, error } = useGetInterviewReport(interviewId as string);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloading, setIsDownloading] = useState(false);

  if (isLoading) return <Loader text="Analyzing interview performance..." />;
  
  if (error || !reportData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
        <p className="text-red-500 mb-4">Failed to load interview report.</p>
        <button onClick={() => navigate('/app/history')} className="text-indigo-600 hover:underline flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to History
        </button>
      </div>
    );
  }

  // Data mapping
  const { finalScore, confidence, communication, correctness, questionWiseScore } = reportData;

  const radarData = [
    { subject: 'Confidence', A: confidence || 0, fullMark: 10 },
    { subject: 'Communication', A: communication || 0, fullMark: 10 },
    { subject: 'Correctness', A: correctness || 0, fullMark: 10 },
  ];

  const barData = questionWiseScore?.map((q: any, i: number) => ({
    name: `Q${i + 1}`,
    Score: q.score || 0,
    Confidence: q.confidence || 0,
    Communication: q.communication || 0,
    Correctness: q.correctness || 0,
  })) || [];
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // 1. Header Information
      pdf.setFontSize(22);
      pdf.setTextColor(79, 70, 229); // Indigo 600
      pdf.text("Interview Performance Report", 14, 20);
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Final Overall Score: ${finalScore} / 10`, 14, 30);
      pdf.text(`Confidence: ${confidence} / 10 | Communication: ${communication} / 10 | Correctness: ${correctness} / 10`, 14, 37);

      pdf.setDrawColor(220, 220, 220);
      pdf.line(14, 43, pageWidth - 14, 43);

      let currentY = 50;

      // 2. Capture Charts
      const originalTab = activeTab;
      if (activeTab !== 'overview') {
        setActiveTab('overview');
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const radarNode = document.getElementById('radar-chart-container');
      const barNode = document.getElementById('bar-chart-container');

      if (radarNode && barNode) {
        const radarCanvas = await html2canvas(radarNode, { scale: 2 });
        const barCanvas = await html2canvas(barNode, { scale: 2 });

        const radarImg = radarCanvas.toDataURL('image/png');
        const barImg = barCanvas.toDataURL('image/png');

        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Skill Balance", 14, currentY);
        pdf.addImage(radarImg, 'PNG', 14, currentY + 5, 80, 80);

        pdf.text("Performance Trend", 110, currentY);
        pdf.addImage(barImg, 'PNG', 100, currentY + 5, 90, 80);

        currentY += 95;
      }

      if (originalTab !== 'overview') {
        setActiveTab(originalTab);
      }

      // 3. Question Wise Detailed Feedback (Table)
      pdf.setFontSize(16);
      pdf.text("Detailed Feedback", 14, currentY + 10);
      currentY += 15;

      const tableData = questionWiseScore?.map((q: any, i: number) => [
        `Q${i + 1}`,
        q.question,
        `Score: ${q.score}/10\nConf: ${q.confidence}/10\nCorr: ${q.correctness}/10`,
        q.feedback
      ]) || [];

      autoTable(pdf, {
        startY: currentY,
        head: [['#', 'Question', 'Metrics', 'AI Feedback']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 55 },
          2: { cellWidth: 30 },
          3: { cellWidth: 'auto' }
        },
        styles: { fontSize: 10, cellPadding: 4, overflow: 'linebreak' },
      });

      // 4. Save
      pdf.save(`Interview_Report_${interviewId}.pdf`);

    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => navigate('/app/history')}
            className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Back to History
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <Activity className="w-7 h-7 text-emerald-500" />
              <span className="bg-linear-to-r from-green-50 via-emerald-500 to-green-50 bg-clip-text text-transparent">
                Interview Performance Report
              </span>
            </h1>
            <p className="text-zinc-400 mt-2 text-sm sm:text-base">
              Detailed breakdown of your AI interview performance.
            </p>
          </div>
          <div className="bg-emerald-500/10 px-6 py-4 rounded-2xl border border-emerald-500/20 flex items-center gap-4">
            <div>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Final Score</p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-emerald-400 leading-none">{finalScore}</span>
                <span className="text-lg text-emerald-500/60 font-bold pb-1">/ 10</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-sm hidden sm:flex">
              <BrainCircuit className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-800 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Metrics Overview
          </button>
          <button
            onClick={() => setActiveTab('detailed')}
            className={`${
              activeTab === 'detailed'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Detailed Feedback
          </button>
        </nav>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Radar Chart */}
          <div id="radar-chart-container" className="bg-[#121214] rounded-2xl p-6 border border-zinc-800 shadow-sm flex flex-col items-center justify-between">
            <h3 className="text-base font-semibold text-zinc-100 self-start mb-4">Skill Balance</h3>
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                  <PolarGrid stroke="#27272a" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full grid grid-cols-3 gap-2 mt-4 text-center border-t border-zinc-800/50 pt-5">
              <div>
                <p className="text-xl font-bold text-emerald-400">{Number(confidence || 0).toFixed(1)}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Confidence</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-400">{Number(communication || 0).toFixed(1)}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Comm.</p>
              </div>
              <div>
                <p className="text-xl font-bold text-amber-400">{Number(correctness || 0).toFixed(1)}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Correctness</p>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div id="bar-chart-container" className="lg:col-span-2 bg-[#121214] rounded-2xl p-6 border border-zinc-800 shadow-sm">
            <h3 className="text-base font-semibold text-zinc-100 mb-4">Performance Trend per Question</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)', color: '#fff' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px', color: '#a1a1aa' }} />
                  <Bar dataKey="Score" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="Confidence" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="Correctness" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Feedback Tab Content */}
      {activeTab === 'detailed' && (
        <div className="space-y-4">
          {questionWiseScore?.map((item: any, index: number) => (
            <div key={index} className="bg-[#121214] rounded-2xl p-5 md:p-6 border border-zinc-800 shadow-sm hover:border-zinc-700 transition-colors">
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                {/* Question Section */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded bg-emerald-500/10 text-emerald-400 font-bold text-xs shrink-0 mt-0.5">
                      Q{index + 1}
                    </span>
                    <h3 className="text-base font-medium text-zinc-100 leading-relaxed">
                      {item.question}
                    </h3>
                  </div>
                  
                  <div className="bg-zinc-900/50 rounded-xl p-4 mt-4 border border-zinc-800/80">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                      <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">AI Feedback</h4>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {item.feedback || "No feedback provided."}
                    </p>
                  </div>
                </div>

                {/* Score Pills Section */}
                <div className="flex flex-row md:flex-col gap-2 min-w-[140px] flex-wrap md:border-l border-zinc-800/50 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-800/50">
                  <div className="bg-zinc-900/80 border border-emerald-500/20 rounded-xl p-2.5 flex flex-1 md:flex-none items-center justify-between shadow-sm">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Score</span>
                    <span className="text-sm font-bold text-emerald-400">{item.score}/10</span>
                  </div>
                  <div className="bg-zinc-900/80 border border-blue-500/20 rounded-xl p-2.5 flex flex-1 md:flex-none items-center justify-between shadow-sm">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Confidence</span>
                    <span className="text-sm font-bold text-blue-400">{item.confidence}/10</span>
                  </div>
                  <div className="bg-zinc-900/80 border border-amber-500/20 rounded-xl p-2.5 flex flex-1 md:flex-none items-center justify-between shadow-sm">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Correctness</span>
                    <span className="text-sm font-bold text-amber-400">{item.correctness}/10</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default InterviewReport;
