import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, GitBranch, Lock, Database, HardDrive, ArrowRight } from 'lucide-react';

const modules = [
  {
    title: 'CPU Scheduling Algorithms',
    description: 'Simulate and visualize various CPU scheduling algorithms including FCFS, SJF, SRTF, Priority Scheduling, and Round Robin.',
    icon: Cpu,
    path: '/cpu-scheduling',
    features: ['Gantt Chart Visualization', 'Interactive Process Input', 'Performance Metrics', 'Algorithm Comparison']
  },
  {
    title: 'System Call Visualizer',
    description: 'Understand system calls like fork(), exec(), wait(), and exit() through interactive process tree visualization.',
    icon: GitBranch,
    path: '/system-calls',
    features: ['Process Tree Visualization', 'System Call Simulation', 'State Transitions', 'PID Management']
  },
  {
    title: 'Process Synchronization',
    description: 'Explore semaphore-based solutions to classic synchronization problems with visual animations.',
    icon: Lock,
    path: '/synchronization',
    features: ['Producer-Consumer Problem', 'Readers-Writers Problem', 'Dining Philosophers', 'Semaphore Operations']
  },
  {
    title: 'Page Replacement Algorithms',
    description: 'Simulate memory management through various page replacement strategies and analyze their performance.',
    icon: Database,
    path: '/page-replacement',
    features: ['FIFO Algorithm', 'Optimal Algorithm', 'LRU Algorithm', 'LFU Algorithm']
  },
  {
    title: 'Disk Scheduling',
    description: 'Visualize disk head movement patterns and optimize seek times using different scheduling algorithms.',
    icon: HardDrive,
    path: '/disk-scheduling',
    features: ['FCFS Scheduling', 'SSTF Algorithm', 'SCAN Algorithm', 'Seek Time Analysis']
  }
];

const Home = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Operating Systems Concepts</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Interactive simulations and visualizations to help you understand core operating system concepts.
          All algorithms run client-side with real-time visual feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.path} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <module.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="text-sm">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {module.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to={module.path}>
                <Button className="w-full group">
                  Explore Module
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This educational tool provides hands-on experience with fundamental operating system concepts.
          Each module includes interactive simulations, step-by-step visualizations, and performance analysis
          to help you understand how these algorithms work in practice.
        </p>
      </div>
    </div>
  );
};

export default Home;