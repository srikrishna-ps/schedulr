import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Menu, X, Cpu, GitBranch, Lock, HardDrive, Database } from 'lucide-react';

const navItems = [
  {
    path: '/',
    name: 'Home',
    icon: Menu,
    description: 'Overview of all modules'
  },
  {
    path: '/cpu-scheduling',
    name: 'CPU Scheduling',
    icon: Cpu,
    description: 'FCFS, SJF, SRTF, Priority, Round Robin'
  },
  {
    path: '/system-calls',
    name: 'System Calls',
    icon: GitBranch,
    description: 'Process tree visualization'
  },
  {
    path: '/synchronization',
    name: 'Synchronization',
    icon: Lock,
    description: 'Semaphores & classic problems'
  },
  {
    path: '/page-replacement',
    name: 'Page Replacement',
    icon: Database,
    description: 'FIFO, Optimal, LRU, LFU'
  },
  {
    path: '/disk-scheduling',
    name: 'Disk Scheduling',
    icon: HardDrive,
    description: 'FCFS, SSTF, SCAN algorithms'
  }
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Link to="/" className="text-2xl font-bold text-primary">
              OS Concepts Simulator
            </Link>
          </div>

          <div className="hidden lg:flex space-x-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="flex items-center space-x-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold">Navigation</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                  >
                    <Card className={`p-4 hover:bg-muted/50 transition-colors ${
                      isActive ? 'bg-primary/10 border-primary' : ''
                    }`}>
                      <div className="flex items-start space-x-3">
                        <item.icon className="h-5 w-5 mt-0.5 text-primary" />
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};