import { useParams } from "react-router";

const Preview = () => {
  const { resumeId } = useParams();
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 p-8">
      <h2 className="text-2xl font-bold mb-4">Preview</h2>
      <p>Previewing resume: {resumeId}</p>
    </div>
  );
};

export default Preview;
