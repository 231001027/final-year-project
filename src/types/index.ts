export interface TeamMemberFields {
  name: string;
  roll_no: string;
  department: string;
  year: string;
  semester: string;
  section: string;
}

export interface Team {
  id: string;
  team_id: string;
  team_name: string;
  password_hash?: string;
  student1_name: string;
  student1_email: string;
  student1_roll_no: string;
  student1_department: string;
  student1_year: string;
  student1_semester: string;
  student1_section: string;
  student2_name: string;
  student2_email: string;
  student2_roll_no: string;
  student2_department: string;
  student2_year: string;
  student2_semester: string;
  student2_section: string;
  department: string;
  selected_project_id: string | null;
  selection_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  domain: string;
  description: string;
  faculty_guide: string;
  max_teams: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  allocated_teams?: number;
}

export interface Allocation {
  id: string;
  project_id: string;
  team_id: string;
  faculty_id: string | null;
  allocation_date: string;
  status: 'allocated' | 'completed' | 'cancelled';
}

export interface AllocationWithDetails extends Allocation {
  team?: Team;
  project?: Project;
}

export interface AuthState {
  user: Team | null;
  isAuthenticated: boolean;
}
