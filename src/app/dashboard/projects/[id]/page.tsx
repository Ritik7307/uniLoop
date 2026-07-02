"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Code, Globe, Laptop, MessageCircle, ShieldCheck, AlertCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const projectId = unwrappedParams.id;
  const { user } = useStore();
  
  const [project, setProject] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const data = await res.json();
        if (res.ok) {
          setProject(data.project);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [projectId, user]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[50vh] flex flex-col justify-center items-center text-gray-500 space-y-4">
        <AlertCircle size={48} className="text-gray-400" />
        <h2 className="text-xl font-bold text-gray-900">Project not found</h2>
        <button onClick={() => router.back()} className="mt-4 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium">Go Back</button>
      </div>
    );
  }

  const isOwner = user && ((user as any).id === project.authorId || user.uid === project.authorId);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`/api/projects/${project._id}`, { method: 'DELETE' });
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Projects
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Main Content Area */}
          <div className="flex flex-col md:flex-row">
            
            {/* Left: Images */}
            <div className="w-full md:w-1/2 p-6 md:p-8 bg-gray-50/50 border-r border-gray-100 flex flex-col gap-4">
              <div className="relative aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
                {project.images?.[activeImage] ? (
                  <img 
                    src={project.images[activeImage]} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Laptop size={64} className="text-gray-300" />
                )}
              </div>
              
              {project.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {project.images.map((img: string, idx: number) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-purple-600' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                    </button>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors shadow-sm">
                    <Code size={18} /> View Code
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors shadow-sm">
                    <Globe size={18} /> Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
                  {project.title}
                </h1>
                
                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-purple-100">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-10 flex-1">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">About the Project</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              {/* Author & Actions */}
              <div className="mt-auto border-t border-gray-100 pt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-lg font-bold text-purple-700 uppercase">
                    {project.authorName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      {project.authorName} {isOwner && "(You)"} <ShieldCheck size={16} className="text-purple-600" />
                    </p>
                    <p className="text-xs text-gray-500 font-medium">Built by a verified student</p>
                  </div>
                </div>

                {isOwner ? (
                  <button onClick={handleDelete} className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                    <Trash2 size={18} /> Delete Project
                  </button>
                ) : (
                  <Link href={`/dashboard/chat?product=${project._id}&seller=${project.authorId}`}>
                    <button className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                      <MessageCircle size={18} /> Message Creator
                    </button>
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
