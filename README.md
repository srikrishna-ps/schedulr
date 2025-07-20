# Schedulr - The OS Concepts Simulator

## Overview

Schedulr is an interactive web application designed to help students understand and visualize core Operating System concepts. It provides hands-on simulations and visualizations for CPU scheduling, system calls, process synchronization, page replacement, and disk scheduling algorithms. All modules run client-side with real-time visual feedback.

## Features

- Minimalistic and modern UI with consistent and accessible design
- Gantt charts and process metrics for CPU scheduling
- System call visualizer with process tree simulation
- Classic synchronization problems (Producer-Consumer, Readers-Writers, Dining Philosophers)
- Page replacement algorithm simulations (FIFO, LRU, LFU, Optimal)
- Disk scheduling visualizations (FCFS, SSTF, SCAN, C-SCAN)

## Future updates

- **Preemptive Scheduling Support**  
  Adding preemptive algorithms to enhance task prioritization and system responsiveness.

- **Real-Time Scheduling Algorithms (RTOS)**  
  Introducing algorithms like Rate Monotonic (RM) and Earliest Deadline First (EDF) for real-time task management.

- **Multi-Process Scheduling**  
  Implementing multi-process scheduling for better CPU utilization and efficient concurrent task handling visualization.

- **Memory Allocation Algorithms**    
  Implemention of First Fit, Best Fit and Wirst Fit memory allocation algorithms and it's visualization.


## Tech Stack

- React (TypeScript)
- Vite
- Tailwind CSS
- shadcn-ui component library

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (v8 or higher)

### Installation

Clone the repository:

```
git clone https://github.com/srikrishna-ps/schedulr.git
cd schedulr
```

Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

The app will be available at `http://localhost:8080` (or as indicated in your terminal).

## Usage

- Use the navigation bar (or the "Explore Module" button of the corresponding module) to explore different OS concepts modules.
- Each module provides interactive controls and visualizations.
- The UI is responsive and works on desktop, tablet, and mobile devices.

## Deployment

You can deploy this project using any static hosting provider (e.g., Vercel, Netlify, GitHub Pages) or through the Lovable platform.

To build for production:

```
npm run build
```

The output will be in the `dist/` directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.

## License

This project is provided for educational purposes.

---

*Developed by SriKrishna Pejathaya P S and Nafees S*
