"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Upload, X, Laptop, Code, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubUrl: "",
    liveUrl: ""
  });
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }

    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return alert("Title and description are required.");
    
    setIsSubmitting(true);
    
    // Parse tech stack into array
    const techStackArray = formData.techStack.split(',').map(t => t.trim()).filter(t => t.length > 0);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          techStack: techStackArray,
          images
        })
      });

      if (res.ok) {
        router.push("/dashboard/projects");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit project.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/dashboard/projects" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Laptop size={24} className="text-purple-600" /> Share Your Project
            </h1>
            <p className="text-sm text-gray-500 mt-1">Showcase what you've been working on to the community.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Project Title *</label>
              <input
                type="text"
                required
                maxLength={60}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="E.g., Campus Event Manager"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does your project do? What problem does it solve?"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none resize-none"
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tech Stack</label>
              <input
                type="text"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                placeholder="React, Node.js, MongoDB (comma separated)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GitHub Link */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Code size={16} /> GitHub Repository
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* Live Link */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <LinkIcon size={16} /> Live Demo
                </label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Screenshots (Up to 3)</label>
              <div className="flex flex-wrap gap-4 mb-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-red-500 hover:bg-red-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-600 transition-colors cursor-pointer bg-gray-50">
                    <Upload size={24} />
                    <span className="text-[10px] mt-1 font-medium">Add Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin mr-2" size={20} /> Submitting Project...</>
                ) : (
                  "Share Project"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
