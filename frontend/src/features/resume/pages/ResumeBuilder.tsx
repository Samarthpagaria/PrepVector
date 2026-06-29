import { useParams } from "react-router";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Resume Builder</h2>
      <p>Editing resume: {resumeId}</p>
    </div>
  );
};

export default ResumeBuilder;
