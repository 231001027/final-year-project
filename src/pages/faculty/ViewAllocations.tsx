import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllocationDetails } from '../../lib/dataStore';
import { Allocation, Team, Project, Faculty } from '../../types';
import DashboardLayout from '../../components/layout/Navbar';
import Card, { CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { LoadingSpinner, EmptyState } from '../../components/ui/Loading';
import { Search, Users, User, Calendar } from 'lucide-react';

interface AllocationWithDetails extends Allocation {
  team: Team;
  project: Project;
}

export default function ViewAllocations() {
  const { user } = useAuth();
  const faculty = user as Faculty;
  const [allocations, setAllocations] = useState<AllocationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllocations();
  }, [faculty]);

  const fetchAllocations = async () => {
    try {
      const data = await getAllocationDetails('allocated');
      const filtered = (data as AllocationWithDetails[]).filter(
        (alloc) => alloc.faculty_id === faculty?.id
      );
      setAllocations(filtered);
    } catch (error) {
      console.error('Error fetching allocations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAllocations = useMemo(() => {
    return allocations.filter(
      (alloc) =>
        alloc.team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alloc.team.team_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alloc.project.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alloc.team.student1_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alloc.team.student2_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allocations, searchTerm]);

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">View Allocations</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track project allocations and team assignments
          </p>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <Input
            placeholder="Search by team name, team ID, domain, or student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800">
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Allocations</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{allocations.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Allocations Table */}
        {filteredAllocations.length === 0 ? (
          <EmptyState
            icon={<Users className="w-12 h-12" />}
            title="No Allocations Found"
            description={
              allocations.length === 0
                ? 'No projects have been allocated yet.'
                : 'Try adjusting your search.'
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
                        Team
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Members
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Domain
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Faculty Guide
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredAllocations.map((alloc) => (
                      <tr key={alloc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-semibold text-sm">
                              {alloc.team.team_name[0]}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{alloc.team.team_name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{alloc.team.team_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="text-sm text-slate-700 dark:text-slate-300">
                                {alloc.team.student1_name || '—'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="text-sm text-slate-700 dark:text-slate-300">
                                {alloc.team.student2_name || '—'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <Badge variant="info" size="sm">
                              {alloc.project.domain}
                            </Badge>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                              {alloc.project.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-700 dark:text-slate-300">{alloc.project.faculty_guide}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            {new Date(alloc.allocation_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
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
    </DashboardLayout>
  );
}
