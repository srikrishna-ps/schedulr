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
    <Card className="bg-gradient-to-br from-card to-muted/20 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          Process Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {processes.map((process, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 bg-muted/10 rounded-lg border border-primary/10">
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
            <div className="flex items-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeProcess(index)}
                className="w-full"
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