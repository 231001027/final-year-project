import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { getProjectById, getProjects } from '../../lib/dataStore';
import { Team, Project, TeamMemberFields } from '../../types';
import DashboardLayout from '../../components/layout/Navbar';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import TeamMemberCard, {
  getTeamMember,
  teamMemberToUpdates,
} from '../../components/student/TeamMemberCard';
import { Users, BookOpen, CheckCircle2, Clock, AlertCircle, ArrowRight, FolderKanban, Save } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/Loading';

interface DashboardStats {
  totalProjects: number;
  hasSelectedProject: boolean;
  selectedProject: Project | null;
}

export default function StudentDashboard() {
  const { user, updateUser } = useAuth();
  const team = user as Team;
  const { showNotification } = useNotification();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    hasSelectedProject: false,
    selectedProject: null,
  });
  const [loading, setLoading] = useState(true);
  const [student1, setStudent1] = useState<TeamMemberFields>(() => getTeamMember(team, 1));
  const [student2, setStudent2] = useState<TeamMemberFields>(() => getTeamMember(team, 2));
  const [savingMembers, setSavingMembers] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [team]);

  useEffect(() => {
    setStudent1(getTeamMember(team, 1));
    setStudent2(getTeamMember(team, 2));
  }, [team]);

  const fetchDashboardData = async () => {
    try {
      const allProjects = await getProjects();

      const selectedProject = team.selected_project_id
        ? (await getProjectById(team.selected_project_id)) ?? null
        : null;

      setStats({
        totalProjects: allProjects.length,
        hasSelectedProject: !!team.selected_project_id,
        selectedProject,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleStudentChange = (
    memberNumber: 1 | 2,
    field: keyof TeamMemberFields,
    value: string
  ) => {
    if (memberNumber === 1) {
      setStudent1((prev) => ({ ...prev, [field]: value }));
    } else {
      setStudent2((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveMembers = async () => {
    setSavingMembers(true);
    try {
      await updateUser({
        ...teamMemberToUpdates(1, student1),
        ...teamMemberToUpdates(2, student2),
      });
      showNotification('success', 'Team member details saved successfully');
    } catch (error) {
      console.error('Error saving team members:', error);
      showNotification('error', 'Failed to save team member details');
    } finally {
      setSavingMembers(false);
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
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome, {team.team_name}!</h1>
          <p className="text-blue-100">
            {stats.hasSelectedProject
              ? 'You have successfully selected your project. Good luck with your work!'
              : 'Explore available project topics and select one for your final year project.'}
          </p>
        </div>

        {/* Team Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Team Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Team ID</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{team.team_id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Team Name</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{team.team_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Department</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{team.department}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                <div className="mt-1">
                  {stats.hasSelectedProject ? (
                    <Badge variant="success">Project Selected</Badge>
                  ) : (
                    <Badge variant="warning">Pending Selection</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Team Members</p>
                <Button
                  size="sm"
                  onClick={handleSaveMembers}
                  isLoading={savingMembers}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Member Details
                </Button>
              </div>
              <div className="grid lg:grid-cols-2 gap-4">
                <TeamMemberCard
                  memberNumber={1}
                  member={student1}
                  onChange={(field, value) => handleStudentChange(1, field, value)}
                  accent="blue"
                />
                <TeamMemberCard
                  memberNumber={2}
                  member={student2}
                  onChange={(field, value) => handleStudentChange(2, field, value)}
                  accent="teal"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800">
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Available Projects</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalProjects}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-slate-800">
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                {stats.hasSelectedProject ? (
                  <CheckCircle2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                ) : (
                  <Clock className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Selection Status</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.hasSelectedProject ? 'Done' : 'Pending'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <Users className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Team Size</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">2 Members</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Project or CTA */}
        {stats.hasSelectedProject && stats.selectedProject ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                Your Selected Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {stats.selectedProject.description.substring(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="info">{stats.selectedProject.domain}</Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-teal-200 dark:border-teal-800">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Faculty Guide:</span> {stats.selectedProject.faculty_guide}
                  </p>
                  {team.selection_date && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      <span className="font-medium">Selected on:</span>{' '}
                      {new Date(team.selection_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
                <Link to="/student/my-project" className="block mt-4">
                  <button className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium flex items-center gap-1">
                    View Full Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No Project Selected Yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                You haven't selected a project yet. Browse available topics and select one for your final year project.
              </p>
              <Link to="/student/topics">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  Browse Available Topics
                </button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
