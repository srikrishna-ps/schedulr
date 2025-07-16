import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Menu, X, Cpu, GitBranch, Lock, HardDrive, Database } from 'lucide-react';

const navItems = [
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
      <nav
        className="fixed left-1/2 top-6 z-50 -translate-x-1/2 w-[98vw] max-w-7xl rounded-2xl bg-background shadow-2xl px-8 py-4 flex items-center justify-between transition-all duration-300 font-sans backdrop-blur-lg border border-border/40 overflow-x-auto whitespace-nowrap supports-[backdrop-filter]:bg-background/80"
        style={{ fontFamily: 'DM Sans, Segoe UI, Helvetica Neue, Arial, Liberation Sans, sans-serif' }}
      >
        {/* Logo and hamburger (when concise)*/}
        <div className="flex items-center gap-6 min-w-0 flex-shrink-0 whitespace-nowrap">
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="lg:hidden flex items-center justify-center rounded-md p-2 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="text-xl md:text-2xl font-bold text-primary whitespace-nowrap select-none min-w-0 overflow-hidden text-ellipsis">
            Schedulr
          </Link>
        </div>

        {/* Desktop/tablet navigation */}
        <div className="hidden lg:flex gap-2 min-w-0 whitespace-nowrap">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={'ghost'}
                  className={`flex items-center gap-2 px-4 py-2 text-lg rounded-lg font-medium min-w-0 whitespace-nowrap bg-transparent relative group transition-none hover:bg-transparent focus:bg-transparent active:bg-transparent`}
                  style={{ fontFamily: 'inherit' }}
                >
                  <item.icon className="h-5 w-5" />
                  <span className={`inline text-ellipsis overflow-hidden whitespace-nowrap relative after:content-[''] after:block after:h-[3px] after:rounded-full after:bg-primary after:scale-x-0 after:transition-transform after:duration-200 after:ease-in-out after:origin-left group-hover:after:scale-x-100 group-focus:after:scale-x-100 ${isActive ? 'text-primary' : ''} group-hover:text-primary group-focus:text-primary`}>
                    {item.name}
                  </span>
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile hamburger (floating, inside nav) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 md:hidden" onClick={() => setIsOpen(false)}>
          <div
            className="mt-24 w-[90vw] max-w-xs rounded-2xl bg-background shadow-2xl border border-border/40 p-6 flex flex-col gap-4 animate-fadeIn"
            style={{ fontFamily: 'DM Sans, Segoe UI, Helvetica Neue, Arial, Liberation Sans, sans-serif' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-2 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Close navigation menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {/* Add Home to mobile menu only */}
              <Link
                key="/"
                to="/"
                onClick={() => setIsOpen(false)}
              >
                <div
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${location.pathname === '/' ? 'bg-primary/10 border border-primary' : 'hover:bg-muted/50'}`}
                >
                  <Menu className="h-5 w-5 text-primary" />
                  <span className="font-medium">Home</span>
                </div>
              </Link>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                  >
                    <div
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive ? 'bg-primary/10 border border-primary' : 'hover:bg-muted/50'}`}
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{item.name}</span>
                    </div>
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