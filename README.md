# 🦁 ZooNavigator

ZooNavigator is an advanced, holistic system designed for two-stage navigation optimization, integrating an AI-powered assistant and synchronized 2D & 3D spatial visualization.  
The system demonstrates true **Design Completeness**. It provides a continuous, automated workflow managing the visitor's journey from the exact moment they enter the zoo until their departure, entirely moving away from simple, isolated CRUD-only operations.

---

## 🚀 Key Features

### 1. Advanced Two-Stage Routing & Optimization Engine
* **Spatial Modeling:** The zoo’s structural layout is modeled as a weighted graph $G=(V,E)$ (vertices as destinations/exhibits, edges as walkways) using the `JGraphT` library.
* **Stage 1 – Dijkstra's Algorithm:** Computes the shortest paths between all pairs of visitor-selected locations in real-time, building a comprehensive, virtual distance matrix.
* **Stage 2 – Two-Opt TSP Optimization:** Resolves the Traveling Salesman Problem (TSP) on the selected subset of destinations. This heuristic algorithm prevents intersecting paths and drastically reduces computation time from exponential complexity $O(N!)$ to fast polynomial complexity, allowing instantaneous server responses.

### 2. Intelligent AI Navigation Assistant (`ZooWise`)
* **Core Technology:** Deep server-side integration with an advanced large language model powered by the `LangChain4j` framework.
* **Context-Aware Reasoning:** The AI is dynamically fed the mathematical graph structure of the zoo, the visitor's real-time location, and current spatial conditions to provide mathematically sound, personalized recommendations.
* **Real-Time Communication:** Utilizes asynchronous `WebSockets (STOMP Protocol)` for full-duplex session-based chat, eliminating standard HTTP latency and resource-heavy client pooling.

### 3. Synchronized 2D & 3D Graphical Mapping
* **2D Interactive View:** Dynamic map interface driven by native `SVG Rendering` inside React, allowing immediate color shifts and path highlights based on the active state.
* **3D Spatial View (`Map3DView`):** Seamless transitions to an immersive, spatial perspective, providing realistic depth, landmarks, and walkway orientations for the visitor.
* **Unified State Management:** Both mapping engines share a single global state in React (**Single Source of Truth**). Transitioning between 2D and 3D views requires **no re-fetching** of data from the backend, reducing memory overhead.

### 4. Enterprise-Grade Security (`OWASP Top 10`)
* **Authentication & Authorization:** Secure stateless architecture utilizing `JWT (JSON Web Tokens)` mapped directly to Role-Based Access Control (`RBAC`).
* **Route Protection:** Complete encapsulation and ironclad blocking of administrative endpoints (`/api/v1/admin/**`) through a customized Spring Security Filter Chain.
* **Parameterized Queries:** Native mitigation against code injection vulnerabilities (`SQL Injection`) by enforcing Hibernate/Spring Data JPA abstraction models.
* **Data Cryptography:** Strong cryptographic hashing of administrator and user passwords using the `BCryptPasswordEncoder` hashing function.

---

## 🛠️ Tech Stack & Architecture

### Backend – Spring Boot (Java 3-Tier Model)
* **Controller Layer:** Exposes robust RESTful APIs and handles bidirectional asynchronous WebSocket traffic.
* **Service Layer:** Houses the core business logic, encompassing graph operations, the TSP engine, JWT authentication filters, and transactional integrity (`@Transactional`).
* **Repository Layer:** Governs abstracted, safe access to the database using Spring Data JPA.

### Frontend – React
* **Component-Based Architecture:** Modular, reusable layout structure featuring distinct, isolated components (`ZooMap`, `ChatApp`, `RoutePath`).
* **Global State Management:** Instantaneous synchronization across user choices, maps, and chat modules utilizing React Hooks (`useState`, `useEffect`).
* **UI/UX:** Fully responsive design layout with smart loading states for a fluid user experience.

---

## 📂 Backend Core Directory Structure

```text
src/main/java/com/example/zoo/
│
├── Controllers/       # API Handling & Endpoints (REST & WebSockets)
├── Entities/          # Database Models & Entities (Users, Destination, Route)
├── Repositories/      # Data Access Objects (UserRepo, DestinationRepo) - Spring Data JPA
├── Service/           # Core Business Logic, TSP Engine, Auth & AI (AuthService, RouteService)
└── Exceptions/        # Centralized Global Exception Handling (AppExceptions)
