import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timer, Plus, Trash2, RotateCcw, Play } from 'lucide-react';

interface RTTask {
  id: string;
  execution: number;
  period: number;
}

interface DeadlineMiss {
  task: number;
  time: number;
}

interface TimelineResult {
  schedule: (number | null)[];
  misses: DeadlineMiss[];
}

const TASK_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444',
  '#a855f7', '#06b6d4', '#ec4899', '#84cc16',
];

const MAX_TIMELINE = 100;

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

const simulate = (tasks: RTTask[], horizon: number, policy: 'RM' | 'EDF'): TimelineResult => {
  const schedule: (number | null)[] = Array(horizon).fill(null);
  const misses: DeadlineMiss[] = [];
  let jobs: { task: number; remaining: number; deadline: number }[] = [];

  for (let t = 0; t < horizon; t++) {
    // A job still unfinished at its deadline is a miss; it is dropped
    jobs = jobs.filter(job => {
      if (job.deadline <= t) {
        misses.push({ task: job.task, time: job.deadline });
        return false;
      }
      return true;
    });

    // Release new jobs (implicit deadline = next release)
    tasks.forEach((task, i) => {
      if (t % task.period === 0) {
        jobs.push({ task: i, remaining: task.execution, deadline: t + task.period });
      }
    });

    if (jobs.length > 0) {
      jobs.sort((a, b) =>
        policy === 'RM'
          ? tasks[a.task].period - tasks[b.task].period || a.task - b.task
          : a.deadline - b.deadline || a.task - b.task
      );
      const job = jobs[0];
      schedule[t] = job.task;
      job.remaining -= 1;
      if (job.remaining === 0) {
        jobs = jobs.filter(j => j !== job);
      }
    }
  }

  // Unfinished jobs whose deadline falls exactly at the horizon
  jobs.forEach(job => {
    if (job.deadline <= horizon && job.remaining > 0) {
      misses.push({ task: job.task, time: job.deadline });
    }
  });

  return { schedule, misses };
};

const Timeline = ({
  tasks,
  result,
  horizon,
}: {
  tasks: RTTask[];
  result: TimelineResult;
  horizon: number;
}) => (
  <div className="overflow-x-auto pb-2">
    <div className="inline-block min-w-full">
      {tasks.map((task, taskIndex) => (
        <div key={task.id} className="flex items-center gap-3 mb-1.5">
          <div className="w-24 shrink-0 text-sm font-medium flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{ backgroundColor: TASK_COLORS[taskIndex % TASK_COLORS.length] }}
            />
            {task.id}
          </div>
          <div className="flex">
            {Array.from({ length: horizon }, (_, t) => {
              const running = result.schedule[t] === taskIndex;
              const isRelease = t % task.period === 0;
              const isMiss = result.misses.some(m => m.task === taskIndex && m.time === t + 1);
              return (
                <div
                  key={t}
                  title={`t=${t}${running ? ` - ${task.id} running` : ''}${isRelease ? ' - job released' : ''}${isMiss ? ' - DEADLINE MISS' : ''}`}
                  className={`h-7 w-4 shrink-0 border-b border-border/40 ${
                    isRelease ? 'border-l-2 border-l-primary/70' : 'border-l border-l-border/20'
                  } ${isMiss ? 'ring-2 ring-inset ring-destructive' : ''}`}
                  style={{
                    backgroundColor: running
                      ? TASK_COLORS[taskIndex % TASK_COLORS.length]
                      : undefined,
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}
      {/* time axis */}
      <div className="flex items-center gap-3">
        <div className="w-24 shrink-0" />
        <div className="flex">
          {Array.from({ length: horizon }, (_, t) => (
            <div key={t} className="w-4 shrink-0 text-[9px] text-muted-foreground text-left">
              {t % 5 === 0 ? t : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const RealTimeScheduling = () => {
  const [tasks, setTasks] = useState<RTTask[]>([
    { id: 'T1', execution: 1, period: 4 },
    { id: 'T2', execution: 1, period: 5 },
    { id: 'T3', execution: 2, period: 10 },
  ]);
  const [results, setResults] = useState<{
    rm: TimelineResult;
    edf: TimelineResult;
    horizon: number;
    hyperperiod: number;
  } | null>(null);
  const [inputsLocked, setInputsLocked] = useState(false);

  const updateTask = (index: number, field: 'execution' | 'period', value: number) => {
    setTasks(ts => ts.map((t, i) => (i === index ? { ...t, [field]: Math.max(1, value) } : t)));
  };

  const addTask = () => {
    if (tasks.length >= 6) return;
    const n = tasks.length + 1;
    setTasks(ts => [...ts, { id: `T${n}`, execution: 1, period: 8 }]);
  };

  const removeTask = (index: number) => {
    setTasks(ts => ts.filter((_, i) => i !== index).map((t, i) => ({ ...t, id: `T${i + 1}` })));
  };

  const runSimulation = () => {
    if (tasks.some(t => t.execution > t.period)) return;
    setInputsLocked(true);
    const hyperperiod = tasks.reduce((acc, t) => lcm(acc, t.period), 1);
    const horizon = Math.min(hyperperiod, MAX_TIMELINE);
    setResults({
      rm: simulate(tasks, horizon, 'RM'),
      edf: simulate(tasks, horizon, 'EDF'),
      horizon,
      hyperperiod,
    });
  };

  const reset = () => {
    setResults(null);
    setInputsLocked(false);
  };

  const utilization = tasks.reduce((sum, t) => sum + t.execution / t.period, 0);
  const rmBound = tasks.length * (Math.pow(2, 1 / tasks.length) - 1);
  const invalidTask = tasks.find(t => t.execution > t.period);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-primary/30 mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Timer className="w-8 h-8 text-primary" />
            </div>
            Real-Time Scheduling Simulator
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            Schedule periodic tasks with Rate Monotonic and Earliest Deadline First, and compare them over the hyperperiod.
          </p>
        </CardHeader>
      </Card>

      <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary">
        <CardHeader>
          <CardTitle>Periodic Task Set</CardTitle>
          <p className="text-sm text-muted-foreground">
            Each task releases a job every period; the job needs its execution time before the next release
            (implicit deadline). RM fixes priority by period - shorter period wins. EDF picks whichever job's
            deadline is nearest.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <div key={task.id} className="flex flex-wrap items-end gap-4">
                <div className="w-16 flex items-center gap-2 pb-2 font-medium">
                  <span
                    className="w-3 h-3 rounded-sm inline-block"
                    style={{ backgroundColor: TASK_COLORS[i % TASK_COLORS.length] }}
                  />
                  {task.id}
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`exec-${i}`} className="text-xs">Execution Time (C)</Label>
                  <Input
                    id={`exec-${i}`}
                    type="number"
                    min="1"
                    className="w-28"
                    value={task.execution}
                    onChange={(e) => updateTask(i, 'execution', parseInt(e.target.value) || 1)}
                    disabled={inputsLocked}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`period-${i}`} className="text-xs">Period = Deadline (T)</Label>
                  <Input
                    id={`period-${i}`}
                    type="number"
                    min="1"
                    className="w-28"
                    value={task.period}
                    onChange={(e) => updateTask(i, 'period', parseInt(e.target.value) || 1)}
                    disabled={inputsLocked}
                  />
                </div>
                <div className="pb-1 text-sm text-muted-foreground w-28">
                  U = {(task.execution / task.period).toFixed(3)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTask(i)}
                  disabled={inputsLocked || tasks.length <= 1}
                  aria-label={`Remove ${task.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {invalidTask && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm">
              {invalidTask.id} has execution time greater than its period - it can never meet its deadline.
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={addTask} variant="outline" disabled={inputsLocked || tasks.length >= 6} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
            <Button onClick={runSimulation} disabled={inputsLocked || !!invalidTask} className="gap-2">
              <Play className="w-4 h-4" />
              Run Both Schedulers
            </Button>
            <Button onClick={reset} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60 shadow-md bg-background/90 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Schedulability Analysis</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Total Utilization</div>
            <div className="text-2xl font-bold text-primary">{(utilization * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">U = sum of C/T over all tasks</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Rate Monotonic</div>
            <div className="text-lg font-semibold">
              {utilization <= rmBound ? (
                <Badge className="text-sm">Guaranteed schedulable</Badge>
              ) : utilization <= 1 ? (
                <Badge variant="secondary" className="text-sm">Not guaranteed - simulate</Badge>
              ) : (
                <Badge variant="destructive" className="text-sm">Overloaded</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Liu-Layland bound: n(2^(1/n) - 1) = {(rmBound * 100).toFixed(1)}% for n = {tasks.length}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Earliest Deadline First</div>
            <div className="text-lg font-semibold">
              {utilization <= 1 ? (
                <Badge className="text-sm">Guaranteed schedulable</Badge>
              ) : (
                <Badge variant="destructive" className="text-sm">Overloaded</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">EDF is optimal: schedulable exactly when U is at most 100%</p>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          {[
            { name: 'Rate Monotonic (RM)', key: 'rm' as const, note: 'Fixed priority: the task with the shortest period always preempts longer-period tasks.' },
            { name: 'Earliest Deadline First (EDF)', key: 'edf' as const, note: 'Dynamic priority: at every instant, the job with the nearest absolute deadline runs.' },
          ].map(({ name, key, note }) => {
            const res = results[key];
            return (
              <Card key={key} className="border border-border/60 shadow-md bg-background/90 backdrop-blur-md">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle>{name}</CardTitle>
                    {res.misses.length === 0 ? (
                      <Badge>All deadlines met</Badge>
                    ) : (
                      <Badge variant="destructive">{res.misses.length} deadline miss{res.misses.length > 1 ? 'es' : ''}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{note}</p>
                </CardHeader>
                <CardContent>
                  <Timeline tasks={tasks} result={res} horizon={results.horizon} />
                  {res.misses.length > 0 && (
                    <div className="mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm">
                      Missed deadlines:{' '}
                      {res.misses.map(m => `${tasks[m.task].id} at t=${m.time}`).join(', ')}. The unfinished job is
                      dropped at its deadline.
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          <p className="text-xs text-muted-foreground">
            Green left ticks mark job releases; a red outline marks the slot before a missed deadline.
            Timeline shows {results.horizon} time units
            {results.hyperperiod > results.horizon
              ? ` (hyperperiod is ${results.hyperperiod}, truncated for display)`
              : ` - one full hyperperiod (LCM of periods)`}.
          </p>
        </>
      )}
    </div>
  );
};

export default RealTimeScheduling;
