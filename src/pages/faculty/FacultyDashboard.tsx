import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllocatedProjectIds, getProjects, getTeams } from '../../lib/dataStore';
import { Faculty } from '../../types';
import DashboardLayout from '../../components/layout/Navbar';
import Card, { CardContent } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/Loading';
import { FolderKanban, Users, CheckCircle, Clock, TrendingUp, BookOpen } from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  availableProjects: number;
  allocatedProjects: number;
  totalTeams: number;
  myProjects: number;
}

export default function FacultyDashboard() {
  const { user } = useAuth();
  const faculty = user as Faculty;
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    availableProjects: 0,
    allocatedProjects: 0,
    totalTeams: 0,
    myProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [faculty]);

  const fetchDashboardData = async () => {
    try {
      const allProjects = await getProjects();
      const myProjects = allProjects.filter((project) => project.created_by === faculty.id).length;
      const allocatedIds = await getAllocatedProjectIds();
      const allocatedProjects = allocatedIds.size;
      const totalProjects = allProjects.length;
      const availableProjects = totalProjects - allocatedProjects;
      const totalTeams = (await getTeams()).length;

      setStats({
        totalProjects,
        availableProjects,
        allocatedProjects,
        totalTeams,
        myProjects,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const statCards = [
    {
      label: 'Total Topics',
      value: stats.totalProjects,
      icon: <FolderKanban className="w-6 h-6" />,
      color: 'blue',
      bgCard: 'from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800',
      bgIcon: 'bg-blue-100 dark:bg-blue-900/30',
      textIcon: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Available Topics',
      value: stats.availableProjects,
      icon: <Clock className="w-6 h-6" />,
      color: 'teal',
      bgCard: 'from-teal-50 to-white dark:from-teal-900/20 dark:to-slate-800',
      bgIcon: 'bg-teal-100 dark:bg-teal-900/30',
      textIcon: 'text-teal-600 dark:text-teal-400',
    },
    {
      label: 'Allocated Topics',
      value: stats.allocatedProjects,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'green',
      bgCard: 'from-green-50 to-white dark:from-green-900/20 dark:to-slate-800',
      bgIcon: 'bg-green-100 dark:bg-green-900/30',
      textIcon: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Total Teams',
      value: stats.totalTeams,
      icon: <Users className="w-6 h-6" />,
      color: 'purple',
      bgCard: 'from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-800',
      bgIcon: 'bg-purple-100 dark:bg-purple-900/30',
      textIcon: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome, {faculty.name}!</h1>
          <p className="text-blue-100">
            Manage final year projects, track allocations, and monitor team progress from your dashboard.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index} className={`bg-gradient-to-br ${stat.bgCard}`}>
              <CardContent className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${stat.bgIcon} flex items-center justify-center ${stat.textIcon}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Projects */}
          <Card>
            <CardContent className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.myProjects}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Projects Created by You</p>
            </CardContent>
          </Card>

          {/* Allocation Rate */}
          <Card>
            <CardContent className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalProjects > 0
                  ? Math.round((stats.allocatedProjects / stats.totalProjects) * 100)
                  : 0}
                %
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Allocation Rate</p>
            </CardContent>
          </Card>

          {/* Teams Without Projects */}
          <Card>
            <CardContent className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalTeams - stats.allocatedProjects}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Teams Without Projects</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardContent>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/faculty/topics"
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <FolderKanban className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                <p className="font-medium text-slate-900 dark:text-white">Manage Topics</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Add, edit, or delete projects</p>
              </a>
              <a
                href="/faculty/allocations"
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Users className="w-6 h-6 text-teal-600 dark:text-teal-400 mb-2" />
                <p className="font-medium text-slate-900 dark:text-white">View Allocations</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Track project assignments</p>
              </a>
              <a
                href="/faculty/topics/new"
                className="p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                <p className="font-medium text-slate-900 dark:text-white">Add New Topic</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Create a new project</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
