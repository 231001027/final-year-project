import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { getProjectById, updateProject } from '../../lib/dataStore';
import DashboardLayout from '../../components/layout/Navbar';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/Loading';
import { ArrowLeft, Save } from 'lucide-react';

interface FormData {
  title: string;
  domain: string;
  description: string;
  faculty_guide: string;
}

const domains = [
  'Artificial Intelligence',
  'Machine Learning',
  'Web Development',
  'Mobile Development',
  'IoT',
  'Blockchain',
  'Cloud Computing',
  'Cybersecurity',
  'Data Science',
  'Computer Vision',
  'Natural Language Processing',
  'Augmented Reality',
  'Virtual Reality',
  'Other',
];

export default function EditTopic() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    domain: '',
    description: '',
    faculty_guide: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const data = id ? await getProjectById(id) : undefined;

      if (!data) {
        showNotification('error', 'Project not found');
        navigate('/faculty/topics');
        return;
      }

      setFormData({
        title: data.title,
        domain: data.domain,
        description: data.description,
        faculty_guide: data.faculty_guide,
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      showNotification('error', 'Failed to load project');
      navigate('/faculty/topics');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.domain.trim()) newErrors.domain = 'Domain is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.faculty_guide.trim()) newErrors.faculty_guide = 'Faculty guide is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (!id) throw new Error('Project ID is required');

      const updated = await updateProject(id, formData);
      if (!updated) throw new Error('Project not found');

      showNotification('success', 'Project updated successfully');
      navigate('/faculty/topics');
    } catch (error) {
      console.error('Error updating project:', error);
      showNotification('error', 'Failed to update project');
    } finally {
      setSaving(false);
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
      <div className="space-y-6 max-w-2xl">
        <button
          onClick={() => navigate('/faculty/topics')}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Manage Topics
        </button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Project Topic</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Project Title"
                placeholder="Enter project title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={errors.title}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Domain
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a domain</option>
                  {domains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
                {errors.domain && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.domain}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter project description"
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                {errors.description && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                )}
              </div>

              <Input
                label="Faculty Guide"
                placeholder="Enter faculty guide name"
                value={formData.faculty_guide}
                onChange={(e) => setFormData({ ...formData, faculty_guide: e.target.value })}
                error={errors.faculty_guide}
                helperText="Name of the faculty who will guide this project"
              />



              <div className="flex gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => navigate('/faculty/topics')}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
