# P-37: Falling Bodies, Kepler's Laws & Universal Gravitation Lab

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Author: Shamsuddin Piash](https://img.shields.io/badge/Author-Shamsuddin%20Piash-0ea5e9.svg)](https://piashoverflow.github.io)
[![BUET ME](https://img.shields.io/badge/Institution-BUET%20'25-10b981.svg)](https://buet.ac.bd)

> **Interactive Computational Physics Simulator & Pedagogical Workbench**  
> Developed by **Shamsuddin Piash** | Department of Mechanical Engineering, Bangladesh University of Engineering and Technology (BUET).  
> Covers **HSC Physics 1st Paper, Chapter 6 (Gravitation & Gravity / মহাকর্ষ ও অভিকর্ষ)** — Topic Code **P-37**.

---

## 🔬 Core Physical Principles & Mathematical Formulations

### 1. Galileo's Laws of Falling Bodies (গ্যালিলিওর পড়ন্ত বস্তুর সূত্রাবলী)
In an ideal vacuum devoid of air resistance, all falling bodies released from rest at the same height experience identical gravitational acceleration $g$:
$$\text{Law 1: } v \propto t \implies v = gt$$
$$\text{Law 2: } h \propto t^2 \implies h = \frac{1}{2}gt^2$$
$$\text{Law 3: } v^2 \propto h \implies v^2 = 2gh$$

In atmospheric air with density $\rho$, drag coefficient $C_d$, and projected area $A$, falling objects asymptotically approach terminal velocity $v_t$:
$$v_t = \sqrt{\frac{2mg}{\rho C_d A}}$$

---

### 2. Kepler's Three Laws of Planetary Motion (কেপলারের গ্রহীয় গতির সূত্রাবলী)
1. **Law of Ellipses (কক্ষপথের সূত্র)**:
   $$r(\theta) = \frac{a(1 - e^2)}{1 + e\cos\theta}$$
   where $a$ is the semi-major axis and $e$ is orbital eccentricity ($0 \le e < 1$).
2. **Law of Equal Areas (ক্ষেত্রফলের সূত্র)**:
   $$\frac{dA}{dt} = \frac{L}{2m} = \text{constant}$$
   Direct consequence of conservation of orbital angular momentum under central force fields.
3. **Harmonic Law (পর্যায়কালের সূত্র)**:
   $$T^2 = \left(\frac{4\pi^2}{GM}\right) a^3 \implies \frac{T^2}{a^3} = \text{constant}$$

---

### 3. Newton's Universal Gravitation in Vector Form (মহাকর্ষ বলের ভেক্টর রূপ)
The mutual gravitational attraction between masses $m_1$ and $m_2$ separated by displacement $\vec{r}_{12}$:
$$\vec{F}_{12} = -G \frac{m_1 m_2}{|\vec{r}_{12}|^2} \hat{r}_{12} = -G \frac{m_1 m_2}{|\vec{r}_{12}|^3} \vec{r}_{12}$$
$$\vec{F}_{12} = -\vec{F}_{21} \quad \text{(Newton's Third Law)}$$

---

### 4. Inertial Mass vs. Gravitational Mass & Equivalence Principle (জড় ভর বনাম মহাকর্ষীয় ভর)
- **Inertial mass**: $m_i = \frac{F}{a}$ (resistance to linear acceleration)
- **Gravitational mass**: $m_g = \frac{Fr^2}{GM}$ (response to gravitational fields)
- **Einstein's Weak Equivalence Principle**:
  $$m_i \equiv m_g \implies a = g$$
  No local experiment inside a closed chamber can distinguish uniform linear acceleration from a gravitational field.

---

## 🚀 Getting Started & Local Development

```bash
# Clone repository
git clone https://github.com/piashoverflow/P-37-Gravitation-Falling-Bodies-Kepler.git
cd P-37-Gravitation-Falling-Bodies-Kepler

# Install dependencies
npm install

# Launch Vite development server
npm run dev

# Build for production / Vercel
npm run build
```

---

## 🌐 1-Click Deployment to Vercel
This project is configured for out-of-the-box zero-config deployment on [Vercel](https://vercel.com). Simply import this repository into your Vercel dashboard and click **Deploy**.

---

## 📜 License
MIT License © 2026 **Shamsuddin Piash**. See [LICENSE](LICENSE) for details.
