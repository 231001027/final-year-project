-- Initial schema migration
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS faculty (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  department TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  description TEXT NOT NULL,
  faculty_guide TEXT NOT NULL,
  max_teams INTEGER DEFAULT 1,
  created_by UUID REFERENCES faculty(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id TEXT UNIQUE NOT NULL,
  team_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  student1_name TEXT DEFAULT '',
  student1_email TEXT DEFAULT '',
  student1_roll_no TEXT DEFAULT '',
  student1_department TEXT DEFAULT '',
  student1_year TEXT DEFAULT '',
  student1_semester TEXT DEFAULT '',
  student1_section TEXT DEFAULT '',
  student2_name TEXT DEFAULT '',
  student2_email TEXT DEFAULT '',
  student2_roll_no TEXT DEFAULT '',
  student2_department TEXT DEFAULT '',
  student2_year TEXT DEFAULT '',
  student2_semester TEXT DEFAULT '',
  student2_section TEXT DEFAULT '',
  department TEXT NOT NULL,
  selected_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  selection_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
  allocation_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'allocated' CHECK (status IN ('allocated', 'completed', 'cancelled')),
  UNIQUE(project_id, team_id)
);

CREATE INDEX IF NOT EXISTS idx_teams_selected_project ON teams(selected_project_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_allocations_project ON allocations(project_id);
CREATE INDEX IF NOT EXISTS idx_allocations_team ON allocations(team_id);
