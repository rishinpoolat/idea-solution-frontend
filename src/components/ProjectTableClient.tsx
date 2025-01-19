"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Modal from './Modal';

interface Project {
  id: string;
  title: string;
  description: string;
  solutions: string;
}

const ITEMS_PER_PAGE = 15;

const ProjectTableClient = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchProjects = async (page: number) => {
    const start = page * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE - 1;

    try {
      const { data, error, count } = await supabase
        .from('project_view')
        .select('id, title, description, solutions', { count: 'exact' })
        .range(start, end);

      if (error) throw error;

      // Check if we have more items to load
      if (count) {
        setHasMore(start + ITEMS_PER_PAGE < count);
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching projects:', err);
      throw err;
    }
  };

  useEffect(() => {
    const loadInitialProjects = async () => {
      try {
        const data = await fetchProjects(0);
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadInitialProjects();
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const newProjects = await fetchProjects(nextPage);
      
      setProjects(prev => [...prev, ...newProjects]);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Error loading more projects:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoadingMore(false);
    }
  };

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, text.lastIndexOf(' ', maxLength)) + '...';
  };

  const parseSolutions = (solutionsText: string) => {
    if (!solutionsText) return [];
    return solutionsText.split('Solution')
      .filter(Boolean)
      .map(solution => ({
        title: `Solution ${solution.match(/\d+/)?.[0] || ''}`,
        content: solution
          .replace(/^\d+:\s*\*\*/g, '')
          .replace(/\*\*/g, '')
          .trim()
      }));
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-lg font-medium text-gray-700">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-red-500 p-4">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group relative bg-white/90 backdrop-blur-sm rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-gray-900 transition-colors">
                {project.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {truncateDescription(project.description)}
              </p>
              
              <button
                onClick={() => {
                  setSelectedProject(project);
                  setShowModal(true);
                }}
                className="px-4 py-2 text-sm bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow"
              >
                Read more
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className={`px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
              loadingMore ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loadingMore ? 'Loading...' : 'Load More Projects'}
          </button>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProject(null);
        }}
        title={selectedProject?.title || ''}
      >
        {selectedProject && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Project Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Suggested Solutions
              </h3>
              <div className="space-y-6">
                {parseSolutions(selectedProject.solutions).map((solution, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">
                      {solution.title}
                    </h4>
                    <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                      {solution.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ProjectTableClient;