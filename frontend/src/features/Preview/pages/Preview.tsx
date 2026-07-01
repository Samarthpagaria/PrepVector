import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../../../components/shared/Loader';
import ResumePreview from '@/features/ResumeBuilder/components/ResumePreview';
import { dummyResumeData } from '@/features/ResumeBuilder/pages/Resumebuilder';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const Preview = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const [resumeData, setResumeData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadResume = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const resume = dummyResumeData.find(r => r._id === resumeId || r.id === resumeId);
            if (resume) {
                setResumeData(resume);
            } else {
                setError("Resume not found");
            }
        } catch (err) {
            setError("Failed to load resume");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (resumeId) {
            loadResume();
        } else {
            setError("No resume ID provided");
            setLoading(false);
        }
    }, [resumeId]);

    if (loading) {
        return <Loader fullScreen text="Loading Preview..." />;
    }

    if (error || !resumeData) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-zinc-200 font-sans'>
                <p className="text-xl font-semibold mb-4">Resume not found</p>
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center text-emerald-500 hover:text-emerald-400 transition-colors font-medium"
                >
                    <ArrowLeft className='mr-2 w-4 h-4' />
                    go to home page
                </button>
            </div>
        );
    }

    return (
        <div className='bg-[#09090b] min-h-screen py-10 px-4'>
            <div className='max-w-4xl mx-auto'>
                <div className="mb-6 flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
                <div className="rounded-xl overflow-hidden shadow-2xl bg-white">
                    <ResumePreview 
                        data={resumeData} 
                        template={resumeData.template || 'classic'} 
                        accentColor={resumeData.accent_color || '#10b981'} 
                        classes='py-10 bg-white'
                    />
                </div>
            </div>
        </div>
    );
}

export default Preview