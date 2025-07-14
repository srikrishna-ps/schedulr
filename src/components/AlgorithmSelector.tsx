import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SchedulingAlgorithm } from '@/types/scheduler';
import { Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';

interface AlgorithmSelectorProps {
  algorithm: SchedulingAlgorithm;
  onAlgorithmChange: (algorithm: SchedulingAlgorithm) => void;
  timeQuantum: number;
  onTimeQuantumChange: (quantum: number) => void;
  onRunScheduler: () => void;
  onResetScheduler: () => void;
  isCalculating: boolean;
}

export const AlgorithmSelector = ({
  algorithm,
  onAlgorithmChange,
  timeQuantum,
  onTimeQuantumChange,
  onRunScheduler,
  onResetScheduler,
  isCalculating
}: AlgorithmSelectorProps) => {
  return (
    <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary bg-gradient-to-br from-card to-accent/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          Scheduling Algorithm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="algorithm">Algorithm</Label>
          <Select value={algorithm} onValueChange={onAlgorithmChange}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="FCFS">First Come First Serve (FCFS)</SelectItem>
              <SelectItem value="SJF">Shortest Job First (SJF)</SelectItem>
              <SelectItem value="Priority">Priority Scheduling</SelectItem>
              <SelectItem value="RoundRobin">Round Robin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {algorithm === 'RoundRobin' && (
          <div>
            <Label htmlFor="timeQuantum">Time Quantum</Label>
            <Input
              id="timeQuantum"
              type="number"
              min="1"
              value={timeQuantum}
              onChange={(e) => onTimeQuantumChange(parseInt(e.target.value) || 1)}
              className="bg-background/50"
            />
          </div>
        )}

        <div className="text-sm text-muted-foreground p-3 bg-muted/20 rounded-lg border border-primary/10">
          {algorithm === 'FCFS' && "Executes processes in order of arrival time."}
          {algorithm === 'SJF' && "Executes shortest burst time process first (non-preemptive)."}
          {algorithm === 'Priority' && "Executes highest priority process first (lower number = higher priority)."}
          {algorithm === 'RoundRobin' && "Each process gets equal time slices in cyclic manner."}
        </div>
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onRunScheduler}
            disabled={isCalculating}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Play className="w-4 h-4 mr-2" />
            {isCalculating ? 'Scheduling...' : 'Run Scheduler'}
          </Button>
          <Button
            onClick={onResetScheduler}
            variant="outline"
            className="border-primary/20 hover:bg-primary/10"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};