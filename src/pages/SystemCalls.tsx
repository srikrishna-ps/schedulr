import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch, Play, RotateCcw } from 'lucide-react';

interface ProcessNode {
  pid: number;
  parentPid: number | null;
  command: string;
  state: 'New' | 'Ready' | 'Running' | 'Waiting' | 'Terminated';
  children: ProcessNode[];
}

const SystemCalls = () => {
  const [processTree, setProcessTree] = useState<ProcessNode>({
    pid: 1,
    parentPid: null,
    command: 'init',
    state: 'Running',
    children: []
  });
  const [nextPid, setNextPid] = useState(2);
  const [selectedProcess, setSelectedProcess] = useState<number>(1);
  const [log, setLog] = useState<string[]>(['System initialized with init process (PID: 1)']);

  const addLog = (message: string) => {
    setLog(prev => [...prev, message]);
  };

  const findProcess = (tree: ProcessNode, pid: number): ProcessNode | null => {
    if (tree.pid === pid) return tree;
    for (const child of tree.children) {
      const found = findProcess(child, pid);
      if (found) return found;
    }
    return null;
  };

  const updateProcessTree = (tree: ProcessNode, pid: number, updates: Partial<ProcessNode>): ProcessNode => {
    if (tree.pid === pid) {
      return { ...tree, ...updates };
    }
    return {
      ...tree,
      children: tree.children.map(child => updateProcessTree(child, pid, updates))
    };
  };

  const handleFork = () => {
    const parent = findProcess(processTree, selectedProcess);
    if (!parent) return;

    const newProcess: ProcessNode = {
      pid: nextPid,
      parentPid: selectedProcess,
      command: `child_${nextPid}`,
      state: 'New',
      children: []
    };

    const updateTree = (tree: ProcessNode): ProcessNode => {
      if (tree.pid === selectedProcess) {
        return { ...tree, children: [...tree.children, newProcess] };
      }
      return {
        ...tree,
        children: tree.children.map(updateTree)
      };
    };

    setProcessTree(updateTree(processTree));
    setNextPid(nextPid + 1);
    addLog(`fork() called by PID ${selectedProcess}, created child PID ${nextPid}`);
    
    // Simulate state transitions
    setTimeout(() => {
      setProcessTree(prev => updateProcessTree(prev, nextPid, { state: 'Ready' }));
      addLog(`Process ${nextPid} moved to Ready state`);
    }, 1000);
  };

  const handleExec = () => {
    const process = findProcess(processTree, selectedProcess);
    if (!process) return;

    const newCommand = `exec_program_${Date.now() % 1000}`;
    setProcessTree(updateProcessTree(processTree, selectedProcess, { 
      command: newCommand,
      state: 'Running'
    }));
    addLog(`exec() called by PID ${selectedProcess}, replaced with '${newCommand}'`);
  };

  const handleWait = () => {
    const process = findProcess(processTree, selectedProcess);
    if (!process || process.children.length === 0) {
      addLog(`wait() called by PID ${selectedProcess}, but no children to wait for`);
      return;
    }

    setProcessTree(updateProcessTree(processTree, selectedProcess, { state: 'Waiting' }));
    addLog(`wait() called by PID ${selectedProcess}, waiting for child processes`);

    // Simulate child completion
    setTimeout(() => {
      const childPid = process.children[0].pid;
      setProcessTree(prev => updateProcessTree(prev, childPid, { state: 'Terminated' }));
      addLog(`Child process ${childPid} terminated`);
      
      setTimeout(() => {
        setProcessTree(prev => updateProcessTree(prev, selectedProcess, { state: 'Running' }));
        addLog(`Process ${selectedProcess} resumed after wait()`);
      }, 1000);
    }, 2000);
  };

  const handleExit = () => {
    if (selectedProcess === 1) {
      addLog('Cannot terminate init process (PID 1)');
      return;
    }

    setProcessTree(updateProcessTree(processTree, selectedProcess, { state: 'Terminated' }));
    addLog(`exit() called by PID ${selectedProcess}, process terminated`);
    setSelectedProcess(1);
  };

  const reset = () => {
    setProcessTree({
      pid: 1,
      parentPid: null,
      command: 'init',
      state: 'Running',
      children: []
    });
    setNextPid(2);
    setSelectedProcess(1);
    setLog(['System initialized with init process (PID: 1)']);
  };

  const renderProcessTree = (process: ProcessNode, level = 0) => {
    const isSelected = process.pid === selectedProcess;
    const indent = level * 24;

    return (
      <div key={process.pid} className="space-y-2">
        <div 
          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
            isSelected ? 'bg-primary/20 border border-primary' : 'bg-muted/50 hover:bg-muted'
          }`}
          style={{ marginLeft: `${indent}px` }}
          onClick={() => setSelectedProcess(process.pid)}
        >
          <div className={`w-3 h-3 rounded-full ${
            process.state === 'Running' ? 'bg-green-500' :
            process.state === 'Ready' ? 'bg-yellow-500' :
            process.state === 'Waiting' ? 'bg-blue-500' :
            process.state === 'Terminated' ? 'bg-red-500' :
            'bg-gray-500'
          }`} />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm">PID: {process.pid}</span>
              <span className="text-sm text-muted-foreground">|</span>
              <span className="text-sm">{process.command}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              State: {process.state}
              {process.parentPid && ` | Parent: ${process.parentPid}`}
            </div>
          </div>
          {level > 0 && <GitBranch className="h-4 w-4 text-muted-foreground" />}
        </div>
        {process.children.map(child => renderProcessTree(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">System Call Visualizer</h1>
        <p className="text-muted-foreground">
          Simulate system calls and visualize process tree creation and management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Process Tree</CardTitle>
            <CardDescription>
              Click on a process to select it, then use system calls below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-96 overflow-y-auto space-y-2">
              {renderProcessTree(processTree)}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Selected: PID {selectedProcess}</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Running</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span>Ready</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Waiting</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>Terminated</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Calls</CardTitle>
              <CardDescription>
                Execute system calls on the selected process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleFork} className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4" />
                  <span>fork()</span>
                </Button>
                <Button onClick={handleExec} variant="outline" className="flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>exec()</span>
                </Button>
                <Button onClick={handleWait} variant="outline" className="flex items-center space-x-2">
                  <span>wait()</span>
                </Button>
                <Button onClick={handleExit} variant="destructive" className="flex items-center space-x-2">
                  <span>exit()</span>
                </Button>
              </div>
              <Button onClick={reset} variant="secondary" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Simulation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto space-y-1 font-mono text-sm">
                {log.map((entry, index) => (
                  <div key={index} className="text-muted-foreground">
                    <span className="text-xs text-muted-foreground/70">
                      [{index.toString().padStart(3, '0')}]
                    </span>{' '}
                    {entry}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemCalls;