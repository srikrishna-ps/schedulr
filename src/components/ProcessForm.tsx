import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Process } from '@/types/scheduler';

interface ProcessFormProps {
  processes: Process[];
  onProcessesChange: (processes: Process[]) => void;
  needsPriority: boolean;
}

export const ProcessForm = ({ processes, onProcessesChange, needsPriority }: ProcessFormProps) => {
  const [nextId, setNextId] = useState(1);

  const addProcess = () => {
    const newProcess: Process = {
      id: `P${nextId}`,
      arrivalTime: 0,
      burstTime: 1,
      priority: needsPriority ? 1 : undefined,
    };
    onProcessesChange([...processes, newProcess]);
    setNextId(nextId + 1);
  };

  const removeProcess = (index: number) => {
    const updatedProcesses = processes.filter((_, i) => i !== index);
    onProcessesChange(updatedProcesses);
  };

  const updateProcess = (index: number, field: keyof Process, value: string | number) => {
    const updatedProcesses = processes.map((process, i) => {
      if (i === index) {
        return { ...process, [field]: value };
      }
      return process;
    });
    onProcessesChange(updatedProcesses);
  };

  return (
    <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary bg-gradient-to-br from-card to-muted/20 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          Process Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {processes.map((process, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-muted/10 rounded-lg border border-primary/10 items-end">
            <div>
              <Label htmlFor={`id-${index}`}>Process ID</Label>
              <Input
                id={`id-${index}`}
                value={process.id}
                onChange={(e) => updateProcess(index, 'id', e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div>
              <Label htmlFor={`arrival-${index}`}>Arrival Time</Label>
              <Input
                id={`arrival-${index}`}
                type="number"
                min="0"
                value={process.arrivalTime}
                onChange={(e) => updateProcess(index, 'arrivalTime', parseInt(e.target.value) || 0)}
                className="bg-background/50"
              />
            </div>
            <div>
              <Label htmlFor={`burst-${index}`}>Burst Time</Label>
              <Input
                id={`burst-${index}`}
                type="number"
                min="1"
                value={process.burstTime}
                onChange={(e) => updateProcess(index, 'burstTime', parseInt(e.target.value) || 1)}
                className="bg-background/50"
              />
            </div>
            {needsPriority && (
              <div>
                <Label htmlFor={`priority-${index}`}>Priority</Label>
                <Input
                  id={`priority-${index}`}
                  type="number"
                  min="1"
                  value={process.priority || 1}
                  onChange={(e) => updateProcess(index, 'priority', parseInt(e.target.value) || 1)}
                  className="bg-background/50"
                />
              </div>
            )}
            <div className="flex flex-col w-full">
              <Label className="mb-1">Delete Process</Label>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeProcess(index)}
                className="w-full h-10"
                style={{ minHeight: '2.5rem' }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button onClick={addProcess} className="w-full bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Process
        </Button>
      </CardContent>
    </Card>
  );
};