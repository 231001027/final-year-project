import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProjectById } from '../../lib/dataStore';
import { Team, Project } from '../../types';
import DashboardLayout from '../../components/layout/Navbar';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { LoadingSpinner, EmptyState } from '../../components/ui/Loading';
import TeamMemberDetails from '../../components/student/TeamMemberDetails';
import { getTeamMember } from '../../components/student/TeamMemberCard';
import { BookOpen, User, Calendar, CheckCircle } from 'lucide-react';

export default function MyProject() {
  const { user } = useAuth();
  const team = user as Team;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [team.selected_project_id]);

  const fetchProject = async () => {
    if (!team.selected_project_id) {
      setLoading(false);
      return;
    }

    try {
      const projectData = await getProjectById(team.selected_project_id);
      setProject(projectData ?? null);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
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
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Project</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View details of your selected final year project
          </p>
        </div>

        {!project ? (
          <EmptyState
            icon={<BookOpen className="w-12 h-12" />}
            title="No Project Selected"
            description="You haven't selected a project yet. Go to Available Topics to browse and select one."
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Project Details */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 rounded-t-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="success" className="bg-white/20 text-white border-0">
                          Allocated
                        </Badge>
                      </div>
                      <div className="bg-white/20 rounded-full p-3">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge variant="success">Allocated</Badge>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                        {project.title.match(/^Title(\d+)/) && parseInt(project.title.match(/^Title(\d+)/)![1]) <= 16
                          ? 'Already Selected'
                          : project.title}
                      </h2>
                      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Description
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {project.title.match(/^Title(\d+)/) && parseInt(project.title.match(/^Title(\d+)/)![1]) <= 16
                          ? 'Your project has been pre-assigned by the faculty.'
                          : project.description}
                      </p>
                    </div>

                    {project.faculty_guide !== 'Not Assigned' && (
                      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                          Project Guide
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-semibold text-lg">
                            {project.faculty_guide[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {project.faculty_guide}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Faculty Guide</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <Card variant="elevated" className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-slate-800">
                <CardContent className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Project Confirmed</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Your project selection has been confirmed
                  </p>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Selection Date</p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {team.selection_date
                          ? new Date(team.selection_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                      <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Faculty Guide</p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {project.faculty_guide}
                      </p>
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Team Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TeamMemberDetails memberNumber={1} member={getTeamMember(team, 1)} accent="blue" />
                  <TeamMemberDetails memberNumber={2} member={getTeamMember(team, 2)} accent="teal" />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
