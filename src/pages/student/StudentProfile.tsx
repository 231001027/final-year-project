import { useAuth } from '../../context/AuthContext';
import { Team, Project } from '../../types';
import DashboardLayout from '../../components/layout/Navbar';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import TeamMemberDetails from '../../components/student/TeamMemberDetails';
import { getTeamMember } from '../../components/student/TeamMemberCard';
import { Building, Users, Calendar, Hash, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProjectById } from '../../lib/dataStore';

export default function StudentProfile() {
  const { user } = useAuth();
  const team = user as Team;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (team.selected_project_id) {
      getProjectById(team.selected_project_id).then((project) => setSelectedProject(project || null)).catch(console.error);
    }
  }, [team.selected_project_id]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View your team profile information
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 rounded-t-xl">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-3xl">
                    {team.team_name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{team.team_name}</h2>
                    <p className="text-blue-100">{team.team_id}</p>
                    <div className="mt-2">
                      {team.selected_project_id ? (
                        <Badge className="bg-white/20 text-white">Project Selected</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700">No Project Yet</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                      <Hash className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Team ID</p>
                      <p className="font-medium text-slate-900 dark:text-white">{team.team_id}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Team Name</p>
                      <p className="font-medium text-slate-900 dark:text-white">{team.team_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Department</p>
                      <p className="font-medium text-slate-900 dark:text-white">{team.department}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Registration Date</p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {new Date(team.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Project Card */}
          {selectedProject && (
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Selected Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      {selectedProject.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="info">{selectedProject.domain}</Badge>
                      <Badge variant="success">Allocated</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Description</p>
                    <p className="text-slate-700 dark:text-slate-300">{selectedProject.description}</p>
                  </div>
                  {team.selection_date && (
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Selection Date</p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {new Date(team.selection_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team Members Card */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-4">
                <TeamMemberDetails memberNumber={1} member={getTeamMember(team, 1)} accent="blue" />
                <TeamMemberDetails memberNumber={2} member={getTeamMember(team, 2)} accent="teal" />
              </div>

              <div className="text-center pt-2">
                <Badge variant="info">Team of 2 Members</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
