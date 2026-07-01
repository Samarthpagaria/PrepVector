import React from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

interface Project {
  name: string;
  type: string;
  url: string;
  description: string;
}

interface ProjectFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ projects = [], onChange }) => {
  const addProject = () => {
    const newProject: Project = {
      name: "",
      type: "",
      url: "",
      description: ""
    };
    onChange([...projects, newProject]);
  };

  const removeProject = (indexToRemove: number) => {
    onChange(projects.filter((_, index) => index !== indexToRemove));
  };

  const updateProject = (index: number, fieldName: keyof Project, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [fieldName]: value };
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-50 via-emerald-500 to-emerald-200 bg-clip-text text-transparent">
            Projects
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Add your projects</p>
        </div>
        
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="max-sm:hidden">Add Project</span>
        </button>
      </div>

      <div className="space-y-6">
        {projects.map((proj, index) => (
          <div key={index} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4 relative group">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-zinc-300">Project #{index + 1}</h3>
              <button
                onClick={() => removeProject(index)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Remove Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Project Name</label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => updateProject(index, "name", e.target.value)}
                  placeholder="e.g. E-Commerce Platform"
                  className="w-full px-3 py-2 bg-[#121214] border border-zinc-700/80 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Project Type</label>
                <input
                  type="text"
                  value={proj.type}
                  onChange={(e) => updateProject(index, "type", e.target.value)}
                  placeholder="e.g. Personal, Academic, Open Source"
                  className="w-full px-3 py-2 bg-[#121214] border border-zinc-700/80 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-zinc-400">Project URL (Optional)</label>
                <input
                  type="url"
                  value={proj.url}
                  onChange={(e) => updateProject(index, "url", e.target.value)}
                  placeholder="e.g. https://github.com/username/project"
                  className="w-full md:w-1/2 px-3 py-2 bg-[#121214] border border-zinc-700/80 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-zinc-400">Description</label>
                <textarea
                  value={proj.description}
                  onChange={(e) => updateProject(index, "description", e.target.value)}
                  placeholder="Describe your project, your role, and what you accomplished..."
                  className="w-full min-h-[120px] p-3 rounded-lg bg-[#121214] border border-zinc-700/80 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 resize-y transition-all text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-500 text-sm">No projects added yet.</p>
            <button 
              onClick={addProject}
              className="mt-3 text-emerald-500 text-sm font-medium hover:text-emerald-400 transition-colors"
            >
              + Add your first project
            </button>
          </div>
        )}
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

export default ProjectForm;
