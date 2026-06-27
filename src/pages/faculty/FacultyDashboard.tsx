import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTeams, getProjects, getAllocationDetails } from '../../lib/dataStore';
import { Team, Project, AllocationWithDetails } from '../../types';
import DashboardLayout from '../../components/layout/Navbar';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/Loading';
import { Users, BookOpen, CheckCircle, Clock } from 'lucide-react';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allocations, setAllocations] = useState<AllocationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsData, projectsData, allocationsData] = await Promise.all([
        getTeams(),
        getProjects(),
        getAllocationDetails(),
      ]);
      setTeams(teamsData);
      setProjects(projectsData);
      setAllocations(allocationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalTeams: teams.length,
    totalProjects: projects.length,
    allocatedProjects: allocations.length,
    unallocatedTeams: teams.filter((t) => !t.selected_project_id).length,
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Faculty Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View student project selections
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalTeams}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Teams</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalProjects}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.allocatedProjects}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Allocated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.unallocatedTeams}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Allocated Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle>Project Allocations</CardTitle>
          </CardHeader>
          <CardContent>
            {allocations.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No project allocations yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Team</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Team ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Project</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Domain</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Selection Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((allocation) => (
                      <tr key={allocation.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {allocation.team?.team_name}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {allocation.team?.team_id}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-900 dark:text-white">
                            {allocation.project?.title}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="info">{allocation.project?.domain}</Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {new Date(allocation.allocation_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unallocated Teams */}
        <Card>
          <CardHeader>
            <CardTitle>Teams Without Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.unallocatedTeams === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>All teams have selected projects</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Team</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Team ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams
                      .filter((t) => !t.selected_project_id)
                      .map((team) => (
                        <tr key={team.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-900 dark:text-white">
                              {team.team_name}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                            {team.team_id}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                            {team.department}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
