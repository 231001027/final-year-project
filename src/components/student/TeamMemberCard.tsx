import Input from '../ui/Input';
import { Team, TeamMemberFields } from '../../types';

type MemberSlot = 1 | 2;

interface TeamMemberCardProps {
  memberNumber: MemberSlot;
  member: TeamMemberFields;
  onChange: (field: keyof TeamMemberFields, value: string) => void;
  accent: 'blue' | 'teal';
}

const accentStyles = {
  blue: {
    card: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
    avatar: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  teal: {
    card: 'bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-800',
    avatar: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  },
};

export function getTeamMember(team: Team, memberNumber: MemberSlot): TeamMemberFields {
  if (memberNumber === 1) {
    return {
      name: team.student1_name,
      roll_no: team.student1_roll_no,
      department: team.student1_department,
      year: team.student1_year,
      semester: team.student1_semester,
      section: team.student1_section,
    };
  }

  return {
    name: team.student2_name,
    roll_no: team.student2_roll_no,
    department: team.student2_department,
    year: team.student2_year,
    semester: team.student2_semester,
    section: team.student2_section,
  };
}

export function teamMemberToUpdates(
  memberNumber: MemberSlot,
  member: TeamMemberFields
): Partial<Team> {
  if (memberNumber === 1) {
    return {
      student1_name: member.name,
      student1_roll_no: member.roll_no,
      student1_department: member.department,
      student1_year: member.year,
      student1_semester: member.semester,
      student1_section: member.section,
    };
  }

  return {
    student2_name: member.name,
    student2_roll_no: member.roll_no,
    student2_department: member.department,
    student2_year: member.year,
    student2_semester: member.semester,
    student2_section: member.section,
  };
}

export default function TeamMemberCard({ memberNumber, member, onChange, accent }: TeamMemberCardProps) {
  const styles = accentStyles[accent];
  const avatarLabel = member.name.trim() ? member.name[0].toUpperCase() : `S${memberNumber}`;

  return (
    <div className={`p-4 rounded-lg border ${styles.card}`}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${styles.avatar}`}
        >
          {avatarLabel}
        </div>
        <p className="font-medium text-slate-900 dark:text-white">Student {memberNumber}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Input
          label="Team Member Name"
          placeholder="Enter name"
          value={member.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
        <Input
          label="Roll No"
          placeholder="Enter roll number"
          value={member.roll_no}
          onChange={(e) => onChange('roll_no', e.target.value)}
        />
        <Input
          label="Department"
          placeholder="Enter department"
          value={member.department}
          onChange={(e) => onChange('department', e.target.value)}
        />
        <Input
          label="Year"
          placeholder="Enter year"
          value={member.year}
          onChange={(e) => onChange('year', e.target.value)}
        />
        <Input
          label="Semester"
          placeholder="Enter semester"
          value={member.semester}
          onChange={(e) => onChange('semester', e.target.value)}
        />
        <Input
          label="Section"
          placeholder="Enter section"
          value={member.section}
          onChange={(e) => onChange('section', e.target.value)}
        />
      </div>
    </div>
  );
}
