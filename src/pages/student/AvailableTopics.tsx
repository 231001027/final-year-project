import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  createAllocation,
  getAvailableProjects,
} from '../../lib/dataStore';
import { Team, Project } from '../../types';
import DashboardLayout from '../../components/layout/Navbar';
import Card, { CardContent, CardFooter } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ConfirmModal } from '../../components/ui/Modal';
import { LoadingSpinner, EmptyState } from '../../components/ui/Loading';
import { AlertTriangle, Search, Filter, BookOpen, CheckCircle } from 'lucide-react';

export default function AvailableTopics() {
  const { user, updateUser } = useAuth();
  const team = user as Team;
  const { showNotification } = useNotification();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; project: Project | null }>({
    open: false,
    project: null,
  });
  const [selecting, setSelecting] = useState(false);
  const [justSelected, setJustSelected] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const allProjects = (await getAvailableProjects()).sort((a, b) => {
        const numA = parseInt(a.title.match(/^Title(\d+)/)?.[1] || '999999', 10);
        const numB = parseInt(b.title.match(/^Title(\d+)/)?.[1] || '999999', 10);
        if (numA !== numB) return numA - numB;
        return a.title.localeCompare(b.title);
      });

      setProjects(allProjects);
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
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDomain = domainFilter === 'all' || project.domain === domainFilter;

      return matchesSearch && matchesDomain;
    });
  }, [projects, searchTerm, domainFilter]);

  const handleSelectProject = (project: Project) => {
    if (team.selected_project_id) {
      showNotification('warning', 'You have already selected a project');
      return;
    }
    setConfirmModal({ open: true, project });
  };

  const confirmSelection = async () => {
    if (!confirmModal.project) return;

    setSelecting(true);
    try {
      await createAllocation({
        project_id: confirmModal.project.id,
        team_id: team.id,
        faculty_id: null,
        status: 'allocated',
      });

      setJustSelected(true);

      const now = new Date().toISOString();
      await updateUser({
        selected_project_id: confirmModal.project.id,
        selection_date: now,
      });

      showNotification('success', 'Project selected successfully!');
      setConfirmModal({ open: false, project: null });
      fetchProjects();
    } catch (error) {
      console.error('Error selecting project:', error);
      const errorMessage = (error as any)?.message || 'Failed to select project. Please try again.';
      showNotification('error', errorMessage);
    } finally {
      setSelecting(false);
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
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Available Project Topics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Browse and select a project topic for your final year project
          </p>
        </div>

        {/* Success banner for just selected */}
        {justSelected && team.selected_project_id && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Project Selected Successfully</p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                You have successfully selected your project topic.
              </p>
            </div>
          </div>
        )}

        {/* Warning Banner if already selected (but not just selected) */}
        {team.selected_project_id && !justSelected && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">Project  Selected Successfully</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                You have selected a project successfully. 
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex gap-3">
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
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredProjects.length} of {projects.length} available projects
        </p>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-12 h-12" />}
            title="No Projects Found"
            description={
              projects.length === 0
                ? 'There are no available projects at the moment. Please check back later.'
                : 'Try adjusting your search or filters to find what you are looking for.'
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} variant="outlined" className="flex flex-col hover:shadow-lg transition-shadow">
                <CardContent className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="primary" size="sm">
                          {project.title.match(/^Title(\d+)/)?.[1] || 'N/A'}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                        {project.title.replace(/^Title\d+ - /, '')}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="info" size="sm">
                      {project.domain}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                </CardContent>
                <CardFooter className="border-t border-slate-100 dark:border-slate-700 pt-4">
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => handleSelectProject(project)}
                    disabled={!!team.selected_project_id}
                  >
                    {team.selected_project_id ? 'Already Selected' : 'Select This Topic'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, project: null })}
        onConfirm={confirmSelection}
        title="Confirm Project Selection"
        message={`Are you sure you want to select "${confirmModal.project?.title || ''}"? This action cannot be undone. Once selected, you cannot change your project.`}
        confirmText="Confirm Selection"
        variant="primary"
        isLoading={selecting}
      />
    </DashboardLayout>
  );
}
