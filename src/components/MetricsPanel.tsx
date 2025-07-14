import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProcessMetrics } from '@/types/scheduler';
import { BarChart3, Clock, Timer } from 'lucide-react';

interface MetricsPanelProps {
  processMetrics: ProcessMetrics[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
}

export const MetricsPanel = ({ 
  processMetrics, 
  averageWaitingTime, 
  averageTurnaroundTime 
}: MetricsPanelProps) => {
  if (processMetrics.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-card to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Run the scheduler to see performance metrics
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card to-accent/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Average Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Average Waiting Time</p>
                <p className="text-2xl font-bold text-primary">{averageWaitingTime.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg border border-secondary/20">
            <div className="flex items-center gap-3">
              <Timer className="w-6 h-6 text-secondary-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Average Turnaround Time</p>
                <p className="text-2xl font-bold text-secondary-foreground">{averageTurnaroundTime.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="rounded-lg border border-primary/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20">
                <TableHead className="font-semibold">Process ID</TableHead>
                <TableHead className="font-semibold">Arrival</TableHead>
                <TableHead className="font-semibold">Burst</TableHead>
                <TableHead className="font-semibold">Completion</TableHead>
                <TableHead className="font-semibold">Turnaround</TableHead>
                <TableHead className="font-semibold">Waiting</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processMetrics.map((process, index) => (
                <TableRow 
                  key={process.id}
                  className="hover:bg-muted/10 animate-in fade-in duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TableCell className="font-medium">{process.id}</TableCell>
                  <TableCell>{process.arrivalTime}</TableCell>
                  <TableCell>{process.burstTime}</TableCell>
                  <TableCell>{process.completionTime}</TableCell>
                  <TableCell className="font-semibold text-secondary-foreground">
                    {process.turnaroundTime}
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    {process.waitingTime}
                  </TableCell>
                  <TableCell>{process.priority || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};