import { TeamMemberFields } from '../../types';

interface TeamMemberDetailsProps {
  memberNumber: 1 | 2;
  member: TeamMemberFields;
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

const fields: { key: keyof TeamMemberFields; label: string }[] = [
  { key: 'name', label: 'Team Member Name' },
  { key: 'roll_no', label: 'Roll No' },
  { key: 'department', label: 'Department' },
  { key: 'year', label: 'Year' },
  { key: 'semester', label: 'Semester' },
  { key: 'section', label: 'Section' },
];

export default function TeamMemberDetails({ memberNumber, member, accent }: TeamMemberDetailsProps) {
  const styles = accentStyles[accent];
  const avatarLabel = member.name.trim() ? member.name[0].toUpperCase() : `S${memberNumber}`;

  return (
    <div className={`p-4 rounded-lg border ${styles.card}`}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${styles.avatar}`}
        >
          {avatarLabel}
        </div>
        <p className="font-medium text-slate-900 dark:text-white">Student {memberNumber}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">
              {member[key].trim() || '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
