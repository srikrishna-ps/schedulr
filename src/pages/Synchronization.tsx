import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Users, Book, UtensilsCrossed, Lock } from 'lucide-react';
import { set } from 'date-fns';

const Synchronization = () => {
  const [isRunning, setIsRunning] = useState(false);

  // Producer-Consumer State
  const [buffer, setBuffer] = useState<number[]>([]);
  const [bufferSize] = useState(5);
  const [produced, setProduced] = useState(0);
  const [consumed, setConsumed] = useState(0);
  const [semaphores, setSemaphores] = useState({
    empty: 5,
    full: 0,
    mutex: 1
  });

  // Readers-Writers State
  const [readers, setReaders] = useState(0);
  const [writers, setWriters] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const [rwSemaphores, setRwSemaphores] = useState({
    rw_mutex: 1,
    mutex: 1
  });

  // Dining Philosophers State
  const [philosophers, setPhilosophers] = useState([
    { id: 0, state: 'thinking', leftFork: false, rightFork: false },
    { id: 1, state: 'thinking', leftFork: false, rightFork: false },
    { id: 2, state: 'thinking', leftFork: false, rightFork: false },
    { id: 3, state: 'thinking', leftFork: false, rightFork: false },
    { id: 4, state: 'thinking', leftFork: false, rightFork: false }
  ]);

  // Dining Philosophers Fork State
  const [forks, setForks] = useState([false, false, false, false, false]);

  const ProducerConsumer = () => {
    const produce = () => {
      if (semaphores.empty > 0 && semaphores.mutex > 0) {
        setSemaphores(prev => ({ ...prev, empty: prev.empty - 1, mutex: 0 }));
        setTimeout(() => {
          const item = Date.now() % 100;
          setBuffer(prev => [...prev, item]);
          setProduced(prev => prev + 1);
          setSemaphores(prev => ({ ...prev, full: prev.full + 1, mutex: 1 }));
        }, 1000);
      }
    };

    const consume = () => {
      if (semaphores.full > 0 && semaphores.mutex > 0) {
        setSemaphores(prev => ({ ...prev, full: prev.full - 1, mutex: 0 }));
        setTimeout(() => {
          setBuffer(prev => prev.slice(1));
          setConsumed(prev => prev + 1);
          setSemaphores(prev => ({ ...prev, empty: prev.empty + 1, mutex: 1 }));
        }, 1000);
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Producer-Consumer Problem</h3>
          <p className="text-muted-foreground">
            Producers add items to a shared buffer, consumers remove them
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary p-3">
            <CardHeader className="p-3">
              <CardTitle className="text-lg">Semaphores</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex justify-between">
                <span>Empty:</span>
                <Badge variant="outline">{semaphores.empty}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Full:</span>
                <Badge variant="outline">{semaphores.full}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Mutex:</span>
                <Badge variant={semaphores.mutex ? "default" : "destructive"}>
                  {semaphores.mutex ? "Available" : "Locked"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary p-3">
            <CardHeader className="p-3">
              <CardTitle className="text-lg">Buffer</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="grid grid-cols-5 gap-2 mb-4">
                {Array.from({ length: bufferSize }, (_, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 border-2 border-dashed rounded flex items-center justify-center text-sm ${buffer[i] !== undefined ? 'bg-primary/20 border-primary' : 'border-muted-foreground/30'}`}
                  >
                    {buffer[i] || ''}
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground text-center">
                Size: {buffer.length} / {bufferSize}
              </div>
            </CardContent>
          </Card>

          <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary p-3">
            <CardHeader className="p-3">
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex justify-between">
                <span>Produced:</span>
                <Badge>{produced}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Consumed:</span>
                <Badge>{consumed}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center space-x-4">
          <Button onClick={produce} disabled={semaphores.empty === 0 || semaphores.mutex === 0}>
            Produce Item
          </Button>
          <Button onClick={consume} disabled={semaphores.full === 0 || semaphores.mutex === 0}>
            Consume Item
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setBuffer([]);
              setProduced(0);
              setConsumed(0);
              setSemaphores({ empty: 5, full: 0, mutex: 1 });
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    );
  };

  const ReadersWriters = () => {
    const startReading = () => {
      if (rwSemaphores.mutex > 0) {
        setRwSemaphores(prev => ({ ...prev, mutex: 0 }));
        setTimeout(() => {
          setReadCount(prev => prev + 1);
          if (readCount === 0 && rwSemaphores.rw_mutex > 0) {
            setRwSemaphores(prev => ({ ...prev, rw_mutex: 0 }));
          }
          setReaders(prev => prev + 1);
          setRwSemaphores(prev => ({ ...prev, mutex: 1 }));
        }, 500);
      }
    };

    const stopReading = () => {
      if (readers > 0 && rwSemaphores.mutex > 0) {
        setRwSemaphores(prev => ({ ...prev, mutex: 0 }));
        setTimeout(() => {
          setReaders(prev => prev - 1);
          setReadCount(prev => prev - 1);
          if (readCount === 1) {
            setRwSemaphores(prev => ({ ...prev, rw_mutex: 1 }));
          }
          setRwSemaphores(prev => ({ ...prev, mutex: 1 }));
        }, 500);
      }
    };

    const startWriting = () => {
      if (rwSemaphores.rw_mutex > 0) {
        setRwSemaphores(prev => ({ ...prev, rw_mutex: 0 }));
        setWriters(1);
      }
    };

    const stopWriting = () => {
      if (writers > 0) {
        setWriters(0);
        setRwSemaphores(prev => ({ ...prev, rw_mutex: 1 }));
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Readers-Writers Problem</h3>
          <p className="text-muted-foreground">
            Multiple readers can access data simultaneously, but writers need exclusive access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary p-3">
            <CardHeader className="p-3">
              <CardTitle className="flex items-center space-x-2">
                <Book className="h-5 w-5" />
                <span>Readers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">{readers}</div>
                <div className="text-sm text-muted-foreground">Active Readers</div>
              </div>
              <div className="space-x-2">
                <Button onClick={startReading} disabled={rwSemaphores.mutex === 0}>
                  Start Reading
                </Button>
                <Button onClick={stopReading} disabled={readers === 0}>
                  Stop Reading
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary p-3">
            <CardHeader className="p-3">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Writers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">{writers}</div>
                <div className="text-sm text-muted-foreground">Active Writers</div>
              </div>
              <div className="space-x-2">
                <Button onClick={startWriting} disabled={rwSemaphores.rw_mutex === 0}>
                  Start Writing
                </Button>
                <Button onClick={stopWriting} disabled={writers === 0}>
                  Stop Writing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary p-3">
          <CardHeader className="p-3">
            <CardTitle>Semaphore Status</CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            <div className="flex justify-between">
              <span>RW Mutex (Resource):</span>
              <Badge variant={rwSemaphores.rw_mutex ? "default" : "destructive"}>
                {rwSemaphores.rw_mutex ? "Available" : "Locked"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Mutex (ReadCount):</span>
              <Badge variant={rwSemaphores.mutex ? "default" : "destructive"}>
                {rwSemaphores.mutex ? "Available" : "Locked"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Read Count:</span>
              <Badge variant="outline">{readCount}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const DiningPhilosophers = () => {
    const positions = [
      { x: 50, y: 10 },  // top
      { x: 85, y: 35 },  // top-right
      { x: 70, y: 75 },  // bottom-right
      { x: 30, y: 75 },  // bottom-left
      { x: 15, y: 35 }   // top-left
    ];

    const forkPositions = [
      { x: 67, y: 22 },  // between 0 and 1
      { x: 77, y: 55 },  // between 1 and 2
      { x: 50, y: 85 },  // between 2 and 3
      { x: 23, y: 55 },  // between 3 and 4
      { x: 33, y: 22 }   // between 4 and 0
    ];

    const pickUpForks = (philosopherId: number) => {
      const leftFork = (philosopherId + 4) % 5;
      const rightFork = philosopherId;

      // Simple deadlock prevention: odd philosophers pick right fork first
      const firstFork = philosopherId % 2 === 0 ? leftFork : rightFork;
      const secondFork = philosopherId % 2 === 0 ? rightFork : leftFork;

      setPhilosophers(prev => prev.map(p =>
        p.id === philosopherId
          ? { ...p, state: 'hungry' }
          : p
      ));

      const tryEat = () => {
        setForks(currentForks => {
          if (!currentForks[firstFork] && !currentForks[secondFork]) {
            const newForks = [...currentForks];
            newForks[firstFork] = true;
            newForks[secondFork] = true;

            setPhilosophers(prev => prev.map(p =>
              p.id === philosopherId
                ? { ...p, state: 'eating', leftFork: true, rightFork: true }
                : p
            ));

            setTimeout(() => {
              setForks(f => {
                const releasedForks = [...f];
                releasedForks[firstFork] = false;
                releasedForks[secondFork] = false;
                return releasedForks;
              });

              setPhilosophers(prev => prev.map(p =>
                p.id === philosopherId
                  ? { ...p, state: 'thinking', leftFork: false, rightFork: false }
                  : p
              ));
            }, 3000);

            return newForks;
          } else {
            setTimeout(tryEat, 1000); // Retry after 1 second if forks are not available
            return currentForks; // Return current state of forks;
          }
        });
      };
      setTimeout(tryEat, 1000); // Retry after 1 second if forks are not available
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Dining Philosophers Problem</h3>
          <p className="text-muted-foreground">
            Five philosophers sit around a table, each needs two forks to eat
          </p>
        </div>

        <div className="flex justify-center">
          <div className="relative w-96 h-96 bg-muted/20 rounded-full border-2 border-muted">
            {/* Table */}
            <div className="absolute inset-8 bg-background rounded-full border border-border flex items-center justify-center">
              <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
            </div>

            {/* Philosophers */}
            {philosophers.map((philosopher, index) => (
              <div
                key={philosopher.id}
                className={`absolute w-16 h-16 rounded-full border-2 flex items-center justify-center text-xs font-bold cursor-pointer transform -translate-x-8 -translate-y-8 ${philosopher.state === 'thinking' ? 'bg-blue-500 border-blue-600 text-white' :
                  philosopher.state === 'hungry' ? 'bg-yellow-500 border-yellow-600 text-white' :
                    'bg-green-500 border-green-600 text-white'
                  }`}
                style={{
                  left: `${positions[index].x}%`,
                  top: `${positions[index].y}%`
                }}
                onClick={() => pickUpForks(philosopher.id)}
              >
                P{philosopher.id}
              </div>
            ))}

            {/* Forks */}
            {forkPositions.map((fork, index) => (
              <div
                key={index}
                className={`absolute w-8 h-2 rounded transform -translate-x-4 -translate-y-1 ${forks[index] ? 'bg-red-500' : 'bg-gray-400'
                  }`}
                style={{
                  left: `${fork.x}%`,
                  top: `${fork.y}%`,
                  transform: `translate(-50%, -50%) rotate(${index * 72}deg)`
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {philosophers.map(philosopher => (
            <Card key={philosopher.id} className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">P{philosopher.id}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge
                  variant={
                    philosopher.state === 'thinking' ? 'default' :
                      philosopher.state === 'hungry' ? 'secondary' :
                        'destructive'
                  }
                  className="text-xs"
                >
                  {philosopher.state}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Click on a philosopher to make them hungry and try to pick up forks
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-primary/30 mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              Process Synchronization
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Explore classic synchronization problems and semaphore-based solutions
            </p>
          </CardHeader>
        </Card>

        <Tabs defaultValue="producer-consumer" className="space-y-6">
          <TabsList className="flex w-full justify-center gap-2 bg-background/90 border border-border/60 shadow-md rounded-xl h-16 p-0">
            <TabsTrigger value="producer-consumer" className="relative flex-1 h-full px-6 py-3 text-lg font-bold text-muted-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 data-[state=active]:text-primary group flex items-center justify-center">
              <span className="relative inline-block">
                Producer-Consumer
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-primary rounded transition-all duration-300 group-hover:w-full data-[state=active]:w-full"></span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="readers-writers" className="relative flex-1 h-full px-6 py-3 text-lg font-bold text-muted-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 data-[state=active]:text-primary group flex items-center justify-center">
              <span className="relative inline-block">
                Readers-Writers
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-primary rounded transition-all duration-300 group-hover:w-full data-[state=active]:w-full"></span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="dining-philosophers" className="relative flex-1 h-full px-6 py-3 text-lg font-bold text-muted-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 data-[state=active]:text-primary group flex items-center justify-center">
              <span className="relative inline-block">
                Dining Philosophers
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-primary rounded transition-all duration-300 group-hover:w-full data-[state=active]:w-full"></span>
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="producer-consumer">
            <ProducerConsumer />
          </TabsContent>

          <TabsContent value="readers-writers">
            <ReadersWriters />
          </TabsContent>

          <TabsContent value="dining-philosophers">
            <DiningPhilosophers />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Synchronization;