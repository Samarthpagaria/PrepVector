import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getPublicResumeById } from "../../ResumeBuilder/services/resumeBuilder.api";
import ResumePreview from "../../ResumeBuilder/components/ResumePreview";
import Loader from "../../../components/shared/Loader";

const Preview = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        if (!resumeId) return;
        const data = await getPublicResumeById(resumeId);
        if (data.resume) {
          const fetchedData = { ...data.resume };
          // Map professional_info (from backend) to personal_info (frontend schema)
          if (fetchedData.professional_info && !fetchedData.personal_info) {
              fetchedData.personal_info = fetchedData.professional_info;
          }
          setResumeData(fetchedData);
          document.title = `${fetchedData.title || 'Resume'} - PrepVector`;
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Resume not found or is private.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResume();
  }, [resumeId]);

  if (isLoading) return <Loader fullScreen text="Loading resume..." />;

  if (error || !resumeData) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-200 flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-bold mb-4 text-emerald-500">Oops!</h2>
        <p className="text-lg text-zinc-400">{error || "Resume not found or is private."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-[1000px] bg-white rounded-xl shadow-2xl overflow-hidden">
         <ResumePreview 
            data={resumeData} 
            template={resumeData.template || "classic"} 
            accentColor={resumeData.accent_color || "#10b981"} 
          />
      </div>
    </div>
  );
};

export default Preview;
