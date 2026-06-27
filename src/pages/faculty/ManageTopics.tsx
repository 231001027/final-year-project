import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import {
  deleteProject,
  getProjects,
  hasActiveAllocationForProject,
} from '../../lib/dataStore';
import { Project } from '../../types';
import DashboardLayout from '../../components/layout/Navbar';
import Card, { CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ConfirmModal } from '../../components/ui/Modal';
import { LoadingSpinner, EmptyState } from '../../components/ui/Loading';
import { stripProjectTitlePrefix } from '../../lib/projectTitle';
import { Plus, Search, Filter, BookOpen, Edit, Trash2 } from 'lucide-react';

export default function ManageTopics() {
  const { showNotification } = useNotification();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; project: Project | null }>({
    open: false,
    project: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projects = (await getProjects()).sort((a, b) => {
        const numA = parseInt(a.title.match(/^Title(\d+)/)?.[1] || '999999', 10);
        const numB = parseInt(b.title.match(/^Title(\d+)/)?.[1] || '999999', 10);
        if (numA !== numB) return numA - numB;
        return a.title.localeCompare(b.title);
      });
      setProjects(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      showNotification('error', 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const domains = useMemo(() => {
    const uniqueDomains = new Set(projects.map((p) => p.domain));
    return ['all', ...Array.from(uniqueDomains).sort()];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.faculty_guide.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDomain = domainFilter === 'all' || project.domain === domainFilter;

      return matchesSearch && matchesDomain;
    });
  }, [projects, searchTerm, domainFilter]);

  const handleDelete = async () => {
    if (!deleteModal.project) return;

    setDeleting(true);
    try {
      if (await hasActiveAllocationForProject(deleteModal.project.id)) {
        showNotification('error', 'Cannot delete a project that has been allocated to a team');
        setDeleting(false);
        setDeleteModal({ open: false, project: null });
        return;
      }

      const deleted = await deleteProject(deleteModal.project.id);

      if (!deleted) throw new Error('Project not found');

      showNotification('success', 'Project deleted successfully');
      setProjects((prev) => prev.filter((p) => p.id !== deleteModal.project!.id));
      setDeleteModal({ open: false, project: null });
    } catch (error) {
      console.error('Error deleting project:', error);
      showNotification('error', 'Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };



  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Topics</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Create, edit, and delete project topics
            </p>
          </div>
          <Link to="/faculty/topics/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Add New Topic</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by title, description, or faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Domains</option>
                {domains
                  .filter((d) => d !== 'all')
                  .map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-12 h-12" />}
            title="No Projects Found"
            description={
              projects.length === 0
                ? 'No projects have been created yet. Click "Add New Topic" to create one.'
                : 'Try adjusting your search or filters.'
            }
            action={
              <Link to="/faculty/topics/new">
                <Button size="sm">Add New Topic</Button>
              </Link>
            }
          />
        ) : (
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Domain
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Faculty Guide
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="font-medium text-slate-900 dark:text-white truncate">
                              {stripProjectTitlePrefix(project.title)}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {project.description.substring(0, 50)}...
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="info" size="sm">
                            {project.domain}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-700 dark:text-slate-300">{project.faculty_guide}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/faculty/topics/edit/${project.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteModal({ open: true, project })}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, project: null })}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteModal.project ? stripProjectTitlePrefix(deleteModal.project.title) : ''}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleting}
      />
    </DashboardLayout>
  );
}
