'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/services/project.service';
import { ProjectInput, TaskInput } from '@/schemas';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { ProjectsHeader } from '@/components/projects/ProjectsHeader';
import { ProjectList } from '@/components/projects/ProjectList';
import { ProjectDetails } from '@/components/projects/ProjectDetails';
import { ProjectDialog, TaskDialog, DeleteProjectDialog } from '@/components/projects/ProjectDialogs';
import { ProjectsPageSkeleton } from '@/components/projects/ProjectsPageSkeleton';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const { projects, loading, createProject, updateProject, deleteProject, updateProjectInState } = useProjects();
  const { createTask } = useTasks();

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsProjectDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectDialogOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateTask = () => {
    if (!selectedProject) return;
    setIsTaskDialogOpen(true);
  };

  const handleProjectSubmit = async (data: ProjectInput) => {
    if (editingProject) {
      const updated = await updateProject(editingProject.id, data);
      if (selectedProject?.id === updated.id) {
        setSelectedProject(updated);
      }
    } else {
      const newProject = await createProject(data);
      setSelectedProject(newProject);
    }
  };

  const handleTaskSubmit = async (data: TaskInput) => {
    if (!selectedProject) return;
    
    const newTask = await createTask(data);
    const updatedProject = {
      ...selectedProject,
      tasks: [...selectedProject.tasks, newTask],
    };
    
    updateProjectInState(updatedProject);
    setSelectedProject(updatedProject);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    await deleteProject(projectToDelete.id);
    
    if (selectedProject?.id === projectToDelete.id) {
      const remainingProjects = projects.filter(p => p.id !== projectToDelete.id);
      setSelectedProject(remainingProjects[0] || null);
    }
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    updateProjectInState(updatedProject);
    setSelectedProject(updatedProject);
  };

  if (loading) {
    return <ProjectsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <ProjectsHeader onCreateProject={handleCreateProject} />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProjectList
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={handleSelectProject}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
          />
        </div>
        
        <div className="lg:col-span-2">
          <ProjectDetails
            project={selectedProject}
            onCreateTask={handleCreateTask}
            onProjectUpdate={handleProjectUpdate}
          />
        </div>
      </div>

      <ProjectDialog
        isOpen={isProjectDialogOpen}
        onClose={() => setIsProjectDialogOpen(false)}
        project={editingProject}
        onSubmit={handleProjectSubmit}
      />

      {selectedProject && (
        <TaskDialog
          isOpen={isTaskDialogOpen}
          onClose={() => setIsTaskDialogOpen(false)}
          projectId={selectedProject.id}
          onSubmit={handleTaskSubmit}
        />
      )}

      <DeleteProjectDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        project={projectToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}