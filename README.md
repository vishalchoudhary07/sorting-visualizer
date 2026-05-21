# Sort.Viz — Advanced Sorting Algorithm Visualizer

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://vishalchoudhary07.github.io/sorting-visualizer/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)]()

Sort.Viz is a highly interactive, beautifully designed web application built to visualize how different sorting algorithms work under the hood. 

Designed with performance in mind, the application uses **JavaScript Generator Functions** (`function*`) to handle step-by-step algorithm execution, ensuring the UI remains buttery smooth without dropping frames, even on low-spec hardware.

## 🚀 Live Demo
**Check out the live application here:** [Sort.Viz Live Demo](https://vishalchoudhary07.github.io/sorting-visualizer/)

## ✨ Key Features
* **Hyper-Modern UI:** Features a sleek, responsive Glassmorphism design with seamless Dark and Light theme toggling.
* **8 Sorting Algorithms:** Includes both simple and complex sorts (Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix).
* **5 Visual Styles:** Watch the arrays sort via Bar Charts, Scatter Dots, Radial/Circular Graphs, Waveforms, or Color Spectrums.
* **Granular Control:** Adjust array sizes, sorting speeds, or pause/resume the execution at any time.
* **Step-by-Step Mode:** Manually step forward or backward through the algorithm using on-screen controls or keyboard arrows to truly understand the logic.
* **Live Analytics:** Tracks comparisons, array swaps, elapsed time, and renders a live tracking graph on an HTML5 Canvas.
* **Custom Data Inputs:** Generate Random, Nearly Sorted, Reversed, or Sawtooth arrays, or input your own custom comma-separated list of numbers.

## 🧠 Algorithms Included
| Algorithm | Best Time | Average Time | Worst Time | Space | Stable |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Bubble** | O(n) | O(n²) | O(n²) | O(1) | Yes |
| **Selection** | O(n²) | O(n²) | O(n²) | O(1) | No |
| **Insertion** | O(n) | O(n²) | O(n²) | O(1) | Yes |
| **Merge** | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| **Quick** | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| **Heap** | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| **Counting** | O(n + k) | O(n + k) | O(n + k) | O(k) | Yes |
| **Radix** | O(nk) | O(nk) | O(nk) | O(n + k) | Yes |

## 🛠️ Technical Architecture
This project was built entirely with **Vanilla Web Technologies**—no heavy frameworks or external libraries were used.
* **Frontend:** HTML5, CSS3 (Flexbox/Grid, Custom Properties, Backdrop Filters).
* **Logic Engine:** Vanilla JavaScript (ES6+).
* **Rendering:** HTML5 `<canvas>` API for high-performance visual drawing.
* **State Management:** Asynchronous execution paused and resumed natively via JS Generators (`yield`).

## 💻 How to Run Locally
Because this project requires no backend or build steps, running it locally is instant.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/vishalchoudhary07/sorting-visualizer.git](https://github.com/vishalchoudhary07/sorting-visualizer.git)
