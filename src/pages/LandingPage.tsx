import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  GraduationCap,
  Users,
  BookOpen,
  ShieldCheck,
  Clock,
  Lightbulb,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Team Management',
    description: 'Create and manage student teams with ease. Each team can select their preferred project topic.',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Project Topics',
    description: 'Browse diverse project topics across multiple domains.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Fair Allocation',
    description: 'Ensure fair project allocation with real-time availability updates and conflict prevention.',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Real-time Updates',
    description: 'Instant updates when projects are selected, ensuring no duplicate allocations.',
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: 'Smart Suggestions',
    description: 'Find projects matching your interests with domain-based filtering and search.',
  },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">ProjectPortal</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <Link to="/login/faculty">
                <Button variant="ghost" size="sm">
                  Faculty Login
                </Button>
              </Link>
              <Link to="/login/team">
                <Button size="sm">Team Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium mb-6">
                <ShieldCheck className="w-4 h-4" />
                Final Year Project Management System
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                Streamline Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  Project Allotment
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
                A modern platform for final-year students to manage project topic allotment efficiently. Browse and select projects with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/login/team">
                  <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Student Login
                  </Button>
                </Link>
                <Link to="/login/faculty">
                  <Button variant="outline" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Faculty Portal
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Decorative circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-72 h-72 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 blur-3xl opacity-60" />
                </div>
                {/* Card stack */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -top-8 -left-8 w-64 h-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 transform rotate-[-8deg] opacity-80">
                      <div className="h-3 w-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded mb-2" />
                      <div className="h-2 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-600 rounded mb-1" />
                      <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-600 rounded" />
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs rounded">
                        Available
                      </div>
                    </div>
                    <div className="w-72 h-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-5">
                      <div className="h-3 w-28 bg-gradient-to-r from-blue-500 to-teal-500 rounded mb-3" />
                      <div className="h-2 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-600 rounded mb-1.5" />
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-600 rounded mb-1.5" />
                      <div className="h-2 w-2/3 bg-slate-100 dark:bg-slate-600 rounded mb-3" />
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">AI/ML</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-56 h-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 transform rotate-[6deg] opacity-80">
                      <div className="h-3 w-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded mb-2" />
                      <div className="h-2 w-28 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-600 rounded mb-1" />
                      <div className="h-2 w-1/2 bg-slate-100 dark:bg-slate-600 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Everything you need to manage final year project allotment efficiently.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
