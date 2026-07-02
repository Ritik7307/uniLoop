"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Plus, Search, Laptop, Code, Heart, Globe } from "lucide-react";


export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProjects();
  }, [search]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const url = search ? `/api/projects?search=${encodeURIComponent(search)}` : "/api/projects";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <Laptop className="text-purple-600" size={32} /> Project Showcase
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Discover innovative work built by RGIPT students.</p>
          </div>
          <Link href="/dashboard/projects/new">
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all transform hover:scale-[1.02]">
              <Plus size={20} /> Share Project
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Search by title, description, or tech stack (e.g. React, Python)..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all text-gray-700 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="min-h-[40vh] flex justify-center items-center">
            <Loader2 className="animate-spin text-purple-600" size={40} />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Laptop size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Be the first to share your innovative work with the campus community!</p>
            <Link href="/dashboard/projects/new">
              <button className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors">
                Submit Project
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <Link key={project._id} href={`/dashboard/projects/${project._id}`} className="group h-full">
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full transform group-hover:-translate-y-1">
                  
                  {/* Thumbnail */}
                  <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden border-b border-gray-100">
                    {project.images?.[0] ? (
                      <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 bg-purple-50/50">
                        <Laptop size={40} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {project.githubUrl && (
                        <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-700 hover:text-purple-600 transition-colors">
                          <Code size={16} />
                        </div>
                      )}
                      {project.liveUrl && (
                        <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-700 hover:text-purple-600 transition-colors">
                          <Globe size={16} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                      By <span className="font-semibold text-gray-700">{project.authorName}</span> • {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ''}
                    </p>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed flex-1">
                      {project.description}
                    </p>
                    
                    {/* Tech Stack Tags */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {project.techStack.slice(0, 3).map((tech: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-[10px] font-bold tracking-wide uppercase">
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold tracking-wide">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
