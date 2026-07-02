import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetInterviewReport } from '../hooks/useInterview';
import { ChevronLeft, BrainCircuit, Activity, MessageSquare, Target, CheckCircle, Download, Loader2 } from 'lucide-react';
import Loader from '../../../components/shared/Loader';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend
} from 'recharts';
import jsPDF from 'jspdf';
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
        <button onClick={() => navigate('/history')} className="text-indigo-600 hover:underline flex items-center gap-2">
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
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => navigate('/history')}
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Back to History
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-indigo-600" />
              Interview Performance Report
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Detailed breakdown of your AI interview performance.
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/30 px-6 py-4 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-center gap-4">
            <div>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Final Score</p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-indigo-700 dark:text-indigo-300 leading-none">{finalScore}</span>
                <span className="text-lg text-indigo-500 dark:text-indigo-400 font-bold pb-1">/ 10</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
              <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Metrics Overview
          </button>
          <button
            onClick={() => setActiveTab('detailed')}
            className={`${
              activeTab === 'detailed'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Detailed Feedback
          </button>
        </nav>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Radar Chart */}
          <div id="radar-chart-container" className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white self-start mb-6">Skill Balance</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#9ca3af' }} />
                  <Radar name="Score" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full grid grid-cols-3 gap-2 mt-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{confidence}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Confidence</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{communication}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Communication</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{correctness}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Correctness</p>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div id="bar-chart-container" className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Performance Trend per Question</h3>
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Score" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Confidence" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Correctness" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Feedback Tab Content */}
      {activeTab === 'detailed' && (
        <div className="space-y-6">
          {questionWiseScore?.map((item: any, index: number) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                {/* Question Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                      Q{index + 1}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
                      {item.question}
                    </h3>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 mt-4 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-indigo-500" />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">AI Feedback</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {item.feedback || "No feedback provided."}
                    </p>
                  </div>
                </div>

                {/* Score Pills Section */}
                <div className="flex flex-row md:flex-col gap-3 min-w-[140px] flex-wrap">
                  <div className="bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Score</span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{item.score}/10</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Confidence</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{item.confidence}/10</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-amber-100 dark:border-amber-900/50 rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Correctness</span>
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{item.correctness}/10</span>
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
