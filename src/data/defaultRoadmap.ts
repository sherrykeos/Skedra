import type { StudyDay, RoadmapSubtopic, Subtask, Priority, TrackId, SubjectId } from '../types/roadmap';

// Helper to format date as YYYY-MM-DD
function getDateStr(startDate: Date, dayOffset: number): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().split('T')[0];
}

// Helper to create subtasks strictly fitting around ~90 mins per track session (45m learn, 15m revise, 30m pyq)
function createSubtasks(
  dayNum: number,
  subtopicPrefix: string,
  subtopicName: string,
  learnMins = 45,
  reviseMins = 15,
  pyqMins = 30,
  includeLearn = true,
  track?: TrackId,
  subjectId?: SubjectId,
  subjectName?: string
): Subtask[] {
  const tasks: Subtask[] = [];
  if (includeLearn && learnMins > 0) {
    tasks.push({
      id: `d${dayNum}-${subtopicPrefix}-learn`,
      title: `Concept & Core Theory: ${subtopicName}`,
      type: 'learn',
      estimatedMinutes: learnMins,
      completed: false,
      track,
      subjectId,
      subjectName,
    });
  }
  if (reviseMins > 0) {
    tasks.push({
      id: `d${dayNum}-${subtopicPrefix}-revise`,
      title: `Formula & Short Notes Revision: ${subtopicName}`,
      type: 'revise',
      estimatedMinutes: reviseMins,
      completed: false,
      track,
      subjectId,
      subjectName,
    });
  }
  if (pyqMins > 0) {
    tasks.push({
      id: `d${dayNum}-${subtopicPrefix}-pyq`,
      title: `GATE PYQs (2014-2026): ${subtopicName}`,
      type: 'pyq',
      estimatedMinutes: pyqMins,
      completed: false,
      track,
      subjectId,
      subjectName,
    });
  }
  return tasks;
}

interface RawDayItem {
  subjectId: SubjectId;
  subjectName: string;
  topic: string;
  phase: string;
  track: TrackId;
  isProtected?: boolean;
  isMilestone?: boolean;
  milestoneTitle?: string;
  subtopics: {
    id: string;
    name: string;
    description: string;
    weightage: Priority;
    isFamiliar?: boolean;
    learnMins?: number;
    reviseMins?: number;
    pyqMins?: number;
  }[];
}

// -------------------------------------------------------------
// TRACK A: MATHEMATICS CURRICULUM (Engineering Math + Discrete Math)
// -------------------------------------------------------------
const MATH_TOPICS: RawDayItem[] = [
  // 1. Linear Algebra: Matrices & Determinants (Familiar)
  {
    subjectId: 'eng-math',
    subjectName: 'Engineering Mathematics',
    topic: 'Linear Algebra: Matrices & Determinants',
    track: 'math',
    phase: 'Track A & B: Parallel Foundations',
    subtopics: [
      {
        id: 'em-mat-prop',
        name: 'Matrix Operations, Determinants & Inverse',
        description: 'Matrix multiplication, orthogonal matrices, determinant properties, adjoint, Gauss-Jordan rank',
        weightage: 'high',
        isFamiliar: true,
        learnMins: 60,
        reviseMins: 30,
        pyqMins: 60,
      },
    ],
  },
  // 2. Linear Algebra: Systems of Linear Equations (Familiar)
  {
    subjectId: 'eng-math',
    subjectName: 'Engineering Mathematics',
    topic: 'Linear Algebra: Systems of Linear Equations',
    track: 'math',
    phase: 'Track A & B: Parallel Foundations',
    subtopics: [
      {
        id: 'em-sys-eq',
        name: 'Homogeneous & Non-Homogeneous Systems',
        description: 'Consistency, augmented matrix row echelon form, unique, infinite and no-solution criteria',
        weightage: 'high',
        isFamiliar: true,
        learnMins: 65,
        reviseMins: 25,
        pyqMins: 60,
      },
    ],
  },
  // 3. Linear Algebra: Eigenvalues & Vectors (Familiar)
  {
    subjectId: 'eng-math',
    subjectName: 'Engineering Mathematics',
    topic: 'Linear Algebra: Eigenvalues & Diagonalization',
    track: 'math',
    phase: 'Track A & B: Parallel Foundations',
    subtopics: [
      {
        id: 'em-eigen',
        name: 'Eigenvalues, Cayley-Hamilton & Diagonalization',
        description: 'Characteristic equation, trace and determinant relations, algebraic/geometric multiplicity, spectral theorem',
        weightage: 'high',
        isFamiliar: true,
        learnMins: 70,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 4. Discrete Math: Set Theory & Relations (Familiar)
  {
    subjectId: 'discrete-math',
    subjectName: 'Discrete Mathematics',
    topic: 'Set Theory, Relations & Partitions',
    track: 'math',
    phase: 'Track A & B: Parallel Foundations',
    subtopics: [
      {
        id: 'dm-sets-rel',
        name: 'Power Sets, Inclusion-Exclusion & Equivalence Relations',
        description: 'Set laws, Cartesian product, reflexive/symmetric/transitive relations, equivalence classes, partitions',
        weightage: 'high',
        isFamiliar: true,
        learnMins: 60,
        reviseMins: 30,
        pyqMins: 60,
      },
    ],
  },
  // 5. Discrete Math: POSETs, Lattices & Functions
  {
    subjectId: 'discrete-math',
    subjectName: 'Discrete Mathematics',
    topic: 'POSETs, Lattices & Function Types',
    track: 'math',
    phase: 'Track A & B: Parallel Foundations',
    subtopics: [
      {
        id: 'dm-poset-lat',
        name: 'Hasse Diagrams, Bounds & Lattices',
        description: 'Maximal/minimal elements, distributive and complemented lattices, injective, surjective, bijective functions',
        weightage: 'medium',
        isFamiliar: true,
        learnMins: 65,
        reviseMins: 30,
        pyqMins: 60,
      },
    ],
  },
  // 6. Discrete Math: Propositional Logic (Familiar)
  {
    subjectId: 'discrete-math',
    subjectName: 'Discrete Mathematics',
    topic: 'Mathematical Logic: Propositional Logic',
    track: 'math',
    phase: 'Track A & B: Core Computer Science & Discrete Foundations',
    subtopics: [
      {
        id: 'dm-prop-logic',
        name: 'Truth Tables, Equivalences & Normal Forms',
        description: 'Tautology, contradiction, logical equivalences, Modus Ponens, resolution refutation, CNF and DNF',
        weightage: 'high',
        isFamiliar: true,
        learnMins: 60,
        reviseMins: 30,
        pyqMins: 60,
      },
    ],
  },
  // 7. Discrete Math: Predicate Logic (First-Order Logic)
  {
    subjectId: 'discrete-math',
    subjectName: 'Discrete Mathematics',
    topic: 'Predicate Logic (First-Order Logic)',
    track: 'math',
    phase: 'Track A & B: Core Computer Science & Discrete Foundations',
    subtopics: [
      {
        id: 'dm-fol',
        name: 'Quantifiers & English-to-Logic Translation',
        description: 'Universal and existential quantifiers, domain scope, negation rules, valid and satisfiable formulas',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 8. Discrete Math: Combinatorics & Recurrences
  {
    subjectId: 'discrete-math',
    subjectName: 'Discrete Mathematics',
    topic: 'Combinatorics & Recurrence Relations',
    track: 'math',
    phase: 'Track A & B: Core Computer Science & Discrete Foundations',
    subtopics: [
      {
        id: 'dm-comb-rec',
        name: 'Permutations, Combinations & Pigeonhole Principle',
        description: 'Generalized pigeonhole principle, binomial coefficients, homogeneous and non-homogeneous linear recurrences',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 9. Discrete Math: Graph Theory Basics
  {
    subjectId: 'discrete-math',
    subjectName: 'Discrete Mathematics',
    topic: 'Graph Theory: Basics, Cycles & Bipartite Graphs',
    track: 'math',
    phase: 'Track A & B: Advanced Discrete & Algorithms Core',
    subtopics: [
      {
        id: 'dm-graph-basics',
        name: 'Handshaking Lemma, Paths & Isomorphism',
        description: 'Degrees, regular graphs, bipartite characterization (no odd cycles), Eulerian and Hamiltonian cycles',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 10. Discrete Math: Graph Theory Connectivity & Planarity
  {
    subjectId: 'discrete-math',
    subjectName: 'Discrete Mathematics',
    topic: 'Graph Theory: Trees, Planarity & Coloring',
    track: 'math',
    phase: 'Track A & B: Advanced Discrete & Algorithms Core',
    isMilestone: true,
    milestoneTitle: 'Discrete Mathematics Foundation Benchmark',
    subtopics: [
      {
        id: 'dm-trees-planar',
        name: 'Tree Properties, Euler Formula & Chromatic Number',
        description: 'n vertices n-1 edges, Cayley formula n^(n-2), Euler planar formula V - E + F = 2, Kuratowski theorem',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 11. Engineering Math: Calculus Limits & Continuity
  {
    subjectId: 'eng-math',
    subjectName: 'Engineering Mathematics',
    topic: 'Calculus: Limits, Continuity & Differentiability',
    track: 'math',
    phase: 'Track A & B: Advanced Math & Systems Track',
    subtopics: [
      {
        id: 'em-calc-limits',
        name: 'L\'Hospital\'s Rule & Mean Value Theorems',
        description: 'Indeterminate forms, continuity at a point, Rolle theorem, Lagrange and Cauchy Mean Value Theorems',
        weightage: 'medium',
        isFamiliar: true,
        learnMins: 65,
        reviseMins: 25,
        pyqMins: 60,
      },
    ],
  },
  // 12. Engineering Math: Calculus Maxima/Minima & Integration
  {
    subjectId: 'eng-math',
    subjectName: 'Engineering Mathematics',
    topic: 'Calculus: Maxima, Minima & Definite Integrals',
    track: 'math',
    phase: 'Track A & B: Advanced Math & Systems Track',
    subtopics: [
      {
        id: 'em-calc-extrema',
        name: 'Single & Multivariable Extrema, Definite Integrals',
        description: 'First and second derivative tests, saddle points, properties of definite integrals',
        weightage: 'medium',
        isFamiliar: false,
        learnMins: 70,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 13. Engineering Math: Probability & Bayes Theorem
  {
    subjectId: 'eng-math',
    subjectName: 'Engineering Mathematics',
    topic: 'Probability: Conditional Probability & Bayes Theorem',
    track: 'math',
    phase: 'Track A & B: Probability & Architecture Track',
    subtopics: [
      {
        id: 'em-prob-bayes',
        name: 'Axioms, Independent Events & Bayes Rule',
        description: 'Law of total probability, conditional probability, diagnostic test false positive/negative calculations',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 14. Engineering Math: Probability Distributions
  {
    subjectId: 'eng-math',
    subjectName: 'Engineering Mathematics',
    topic: 'Probability Distributions & Statistics',
    track: 'math',
    phase: 'Track A & B: Probability & Architecture Track',
    isMilestone: true,
    milestoneTitle: 'Engineering Mathematics Full Coverage Milestone',
    subtopics: [
      {
        id: 'em-prob-dist',
        name: 'Discrete & Continuous Distributions, Mean & Variance',
        description: 'Binomial, Poisson, Uniform, Exponential, and Normal distributions, expectation, variance, covariance',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
];

// -------------------------------------------------------------
// TRACK B: CORE COMPUTER SCIENCE CURRICULUM
// -------------------------------------------------------------
const CORE_CS_TOPICS: RawDayItem[] = [
  // 1. Digital Logic: Number Systems & Boolean Algebra
  {
    subjectId: 'digital-logic',
    subjectName: 'Digital Logic',
    topic: 'Boolean Algebra, 2s Complement & K-Maps',
    track: 'core-cs',
    phase: 'Track A & B: Parallel Foundations',
    subtopics: [
      {
        id: 'dl-num-kmap',
        name: 'Number Systems, Overflow & K-Map Minimization',
        description: 'Signed magnitude, 1s/2s complement arithmetic overflow, SOP/POS, don\'t cares, prime implicants',
        weightage: 'high',
        isFamiliar: true,
        learnMins: 65,
        reviseMins: 25,
        pyqMins: 60,
      },
    ],
  },
  // 2. Digital Logic: Combinational Circuits
  {
    subjectId: 'digital-logic',
    subjectName: 'Digital Logic',
    topic: 'Combinational Circuits: Multiplexers & Adders',
    track: 'core-cs',
    phase: 'Track A & B: Parallel Foundations',
    subtopics: [
      {
        id: 'dl-comb',
        name: '2:1/4:1/8:1 MUX Realization & Full Adders',
        description: 'Multiplexer logic expansion, half/full adder delay, carry lookahead principle, decoders, encoders',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 3. Digital Logic: Sequential Circuits
  {
    subjectId: 'digital-logic',
    subjectName: 'Digital Logic',
    topic: 'Sequential Circuits: Flip-Flops & Counters',
    track: 'core-cs',
    phase: 'Track A & B: Parallel Foundations',
    subtopics: [
      {
        id: 'dl-seq',
        name: 'Latches, Flip-Flops, Setup/Hold Time & FSM',
        description: 'SR, JK, D, T excitation tables, race condition, synchronous/asynchronous Mod-N counters, state machines',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 4. C Programming: Variables, Pointers & Memory
  {
    subjectId: 'prog-ds',
    subjectName: 'Programming & Data Structures',
    topic: 'C Programming: Pointers & Memory Allocation',
    track: 'core-cs',
    phase: 'Track A & B: Parallel Foundations',
    subtopics: [
      {
        id: 'pds-pointers',
        name: 'Pointers, Arrays, Parameter Passing & Dynamic Memory',
        description: 'Pointer arithmetic, pointers to pointers, call by value/reference, malloc, calloc, free, scope',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 5. C Programming: Recursion & Structures
  {
    subjectId: 'prog-ds',
    subjectName: 'Programming & Data Structures',
    topic: 'C Programming: Recursion & Struct Padding',
    track: 'core-cs',
    phase: 'Track A & B: Core Computer Science & Discrete Foundations',
    subtopics: [
      {
        id: 'pds-recursion',
        name: 'Call Stack Tracing, Tail Recursion & Structures',
        description: 'Tree recursion, static variables in recursive calls, structure memory padding, alignment, unions',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 6. Data Structures: Stacks & Queues
  {
    subjectId: 'prog-ds',
    subjectName: 'Programming & Data Structures',
    topic: 'Linear Structures: Stacks & Queues',
    track: 'core-cs',
    phase: 'Track A & B: Core Computer Science & Discrete Foundations',
    subtopics: [
      {
        id: 'pds-stacks-queues',
        name: 'Infix/Postfix, Evaluation & Circular Queues',
        description: 'Stack applications, operator precedence, circular queue empty/full conditions, deque, 2-stack queue',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 70,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 7. Data Structures: Linked Lists & Hashing
  {
    subjectId: 'prog-ds',
    subjectName: 'Programming & Data Structures',
    topic: 'Linked Lists & Hash Tables',
    track: 'core-cs',
    phase: 'Track A & B: Core Computer Science & Discrete Foundations',
    subtopics: [
      {
        id: 'pds-lists-hash',
        name: 'Singly/Doubly Lists, Cycle Detection & Collision Resolution',
        description: 'Floyd cycle finding, list reversal, collision handling (chaining, linear/quadratic probing, double hashing)',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 8. Data Structures: Binary Trees & BST
  {
    subjectId: 'prog-ds',
    subjectName: 'Programming & Data Structures',
    topic: 'Trees: Binary Trees & Binary Search Trees',
    track: 'core-cs',
    phase: 'Track A & B: Core Computer Science & Discrete Foundations',
    subtopics: [
      {
        id: 'pds-trees-bst',
        name: 'Traversals, Tree Reconstruction & BST Operations',
        description: 'Preorder, Inorder, Postorder, reconstruct from traversal pairs, BST insert, delete, predecessor, successor',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 9. Data Structures: Balanced Trees & Heaps
  {
    subjectId: 'prog-ds',
    subjectName: 'Programming & Data Structures',
    topic: 'Balanced Trees: AVL Trees & Binary Heaps',
    track: 'core-cs',
    phase: 'Track A & B: Core Computer Science & Discrete Foundations',
    isMilestone: true,
    milestoneTitle: 'Data Structures Core Benchmark',
    subtopics: [
      {
        id: 'pds-avl-heaps',
        name: 'AVL Rotations, Max/Min Heaps & HeapSort',
        description: 'LL, RR, LR, RL balance factor rotations, O(n) heap build algorithm, Priority Queue operations',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 10. Algorithms: Asymptotic Analysis & Master Theorem
  {
    subjectId: 'algorithms',
    subjectName: 'Algorithms',
    topic: 'Asymptotic Analysis & Recurrences',
    track: 'core-cs',
    phase: 'Track A & B: Advanced Discrete & Algorithms Core',
    subtopics: [
      {
        id: 'algo-asymp-master',
        name: 'Big-O, Omega, Theta & Master Theorem',
        description: 'Comparing growth of functions, extended Master theorem cases, substitution and recursion tree methods',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 11. Algorithms: Divide & Conquer Sorting
  {
    subjectId: 'algorithms',
    subjectName: 'Algorithms',
    topic: 'Divide & Conquer: Sorting & Order Statistics',
    track: 'core-cs',
    phase: 'Track A & B: Advanced Discrete & Algorithms Core',
    subtopics: [
      {
        id: 'algo-sorting',
        name: 'Merge Sort, Quick Sort & QuickSelect',
        description: 'Worst/average complexities, stability, in-place behavior, comparison lower bound Omega(n log n), Counting sort',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 12. Algorithms: Greedy Algorithms
  {
    subjectId: 'algorithms',
    subjectName: 'Algorithms',
    topic: 'Greedy Algorithms: Huffman & Minimum Spanning Trees',
    track: 'core-cs',
    phase: 'Track A & B: Advanced Discrete & Algorithms Core',
    subtopics: [
      {
        id: 'algo-greedy',
        name: 'Fractional Knapsack, Huffman Coding & Kruskal/Prim',
        description: 'Greedy choice property, prefix codes, Disjoint Set Union (DSU) with union-by-rank and path compression',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 13. Algorithms: Dynamic Programming Part 1
  {
    subjectId: 'algorithms',
    subjectName: 'Algorithms',
    topic: 'Dynamic Programming: Knapsack & Coin Change',
    track: 'core-cs',
    phase: 'Track A & B: Advanced Discrete & Algorithms Core',
    subtopics: [
      {
        id: 'algo-dp-1',
        name: 'Overlapping Subproblems, 0/1 Knapsack & Coin Change',
        description: 'Memoization vs tabulation, space optimization, subset sum problem',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 80,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 14. Algorithms: Dynamic Programming Part 2
  {
    subjectId: 'algorithms',
    subjectName: 'Algorithms',
    topic: 'Dynamic Programming: LCS, Matrix Chain & LIS',
    track: 'core-cs',
    phase: 'Track A & B: Advanced Discrete & Algorithms Core',
    subtopics: [
      {
        id: 'algo-dp-2',
        name: 'LCS, Matrix Chain Multiplication & Longest Increasing Subseq',
        description: 'Optimal parenthesization recurrence, printing LCS solutions, time and space complexity analysis',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 80,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 15. Algorithms: Graph Traversals & Shortest Paths
  {
    subjectId: 'algorithms',
    subjectName: 'Algorithms',
    topic: 'Graph Algorithms: Traversals & Shortest Paths',
    track: 'core-cs',
    phase: 'Track A & B: Advanced Discrete & Algorithms Core',
    subtopics: [
      {
        id: 'algo-graphs',
        name: 'BFS, DFS, Topological Sort, Dijkstra & Bellman-Ford',
        description: 'Cycle detection, DAG ordering, Kosaraju SCC, non-negative edge Dijkstra, negative cycle Bellman-Ford',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 80,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 16. Algorithms & TOC: NP-Completeness & Finite Automata
  {
    subjectId: 'algorithms',
    subjectName: 'Algorithms',
    topic: 'Complexity Classes: P, NP & NP-Complete',
    track: 'core-cs',
    phase: 'Track A & B: Automata & Compiler Track',
    subtopics: [
      {
        id: 'algo-np',
        name: 'P, NP, Reductions & NP-Complete Problems',
        description: 'Deterministic vs non-deterministic polynomial verifiers, 3-SAT, Vertex Cover, Clique, Independent Set',
        weightage: 'medium',
        isFamiliar: false,
        learnMins: 70,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 17. TOC: DFA & NFA
  {
    subjectId: 'toc',
    subjectName: 'Theory of Computation',
    topic: 'Finite Automata: DFA, NFA & Minimization',
    track: 'core-cs',
    phase: 'Track A & B: Automata & Compiler Track',
    subtopics: [
      {
        id: 'toc-fa-min',
        name: 'DFA Construction, Subset Construction & Table Filling',
        description: 'String acceptance, counting mod-k languages, epsilon-NFA to DFA, Myhill-Nerode equivalence theorem',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 18. TOC: Regular Expressions & Pumping Lemma
  {
    subjectId: 'toc',
    subjectName: 'Theory of Computation',
    topic: 'Regular Expressions & Pumping Lemma',
    track: 'core-cs',
    phase: 'Track A & B: Automata & Compiler Track',
    subtopics: [
      {
        id: 'toc-regex-pump',
        name: 'Arden\'s Theorem, Pumping Lemma & Closure Properties',
        description: 'Regex algebraic identities, proving non-regularity via pumping lemma, closure under union, intersection, complement',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 19. TOC: CFGs & Pushdown Automata
  {
    subjectId: 'toc',
    subjectName: 'Theory of Computation',
    topic: 'Context-Free Grammars & Pushdown Automata',
    track: 'core-cs',
    phase: 'Track A & B: Automata & Compiler Track',
    subtopics: [
      {
        id: 'toc-cfg-pda',
        name: 'Grammar Ambiguity, CNF & DPDA vs NPDA',
        description: 'Inherently ambiguous grammars, Chomsky normal form, acceptance by empty stack vs final state, DCFL vs CFL',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 20. TOC: Turing Machines & Decidability
  {
    subjectId: 'toc',
    subjectName: 'Theory of Computation',
    topic: 'Turing Machines, Decidability & Rice\'s Theorem',
    track: 'core-cs',
    phase: 'Track A & B: Automata & Compiler Track',
    isMilestone: true,
    milestoneTitle: 'Theory of Computation Milestone',
    subtopics: [
      {
        id: 'toc-tm-undecidable',
        name: 'Halting Problem, Rice\'s Theorem & Chomsky Hierarchy',
        description: 'Recursive vs RE languages, diagonalization proof, PCP, Rice Theorem part 1 & 2, closure summary',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 80,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 21. Compiler Design: Lexical Analysis & Parsing Basics
  {
    subjectId: 'compiler',
    subjectName: 'Compiler Design',
    topic: 'Lexical Analysis & Syntax FIRST/FOLLOW Sets',
    track: 'core-cs',
    phase: 'Track A & B: Automata & Compiler Track',
    subtopics: [
      {
        id: 'cd-lex-first-follow',
        name: 'Tokens, LEX Specification & FIRST/FOLLOW Computation',
        description: 'Lexical lookahead buffers, computing FIRST and FOLLOW sets with epsilon productions',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 22. Compiler Design: Parsers & Code Optimization
  {
    subjectId: 'compiler',
    subjectName: 'Compiler Design',
    topic: 'Parsers: LL(1), LR Parsers & Code Optimization',
    track: 'core-cs',
    phase: 'Track A & B: Automata & Compiler Track',
    subtopics: [
      {
        id: 'cd-parsers-opt',
        name: 'LL(1) Conflicts, LR(0)/SLR/LALR, SDT & Optimization',
        description: 'Shift-reduce/reduce-reduce conflicts, S-attributed vs L-attributed definitions, DAG, basic blocks, loop optimization',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 80,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 23. Operating Systems: Processes, Threads & CPU Scheduling
  {
    subjectId: 'os',
    subjectName: 'Operating Systems',
    topic: 'Processes, Threads & CPU Scheduling',
    track: 'core-cs',
    phase: 'Track A & B: Operating Systems & Databases Track',
    subtopics: [
      {
        id: 'os-proc-sched',
        name: 'PCB, Context Switch, FCFS, SJF, SRTF & Round Robin',
        description: 'fork() system calls, user vs kernel threads, Gantt chart, average turnaround time, waiting time',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 24. Operating Systems: Synchronization & Semaphores
  {
    subjectId: 'os',
    subjectName: 'Operating Systems',
    topic: 'Process Synchronization: Semaphores & Classical Problems',
    track: 'core-cs',
    phase: 'Track A & B: Operating Systems & Databases Track',
    subtopics: [
      {
        id: 'os-sync-sem',
        name: 'Critical Section, Peterson\'s Algorithm & Semaphores',
        description: 'Mutual exclusion, progress, bounded waiting, counting and binary semaphores, Producer-Consumer, Reader-Writer',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 80,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 25. Operating Systems: Deadlocks & Banker's Algorithm
  {
    subjectId: 'os',
    subjectName: 'Operating Systems',
    topic: 'Deadlocks: Detection, Prevention & Avoidance',
    track: 'core-cs',
    phase: 'Track A & B: Operating Systems & Databases Track',
    subtopics: [
      {
        id: 'os-deadlock-banker',
        name: '4 Coffman Conditions, Resource Allocation Graphs & Banker\'s Algo',
        description: 'Safe state calculation, Available, Max, Allocation, Need matrices, deadlock handling strategies',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 26. Operating Systems: Memory Management & Paging
  {
    subjectId: 'os',
    subjectName: 'Operating Systems',
    topic: 'Memory Management: Paging & Multi-Level Page Tables',
    track: 'core-cs',
    phase: 'Track A & B: Operating Systems & Databases Track',
    subtopics: [
      {
        id: 'os-paging-tlb',
        name: 'Page Size, Multi-Level Page Tables & TLB Hit Ratio',
        description: 'Logical to physical address translation, Effective Memory Access Time (EMAT) with TLB, internal fragmentation',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 80,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 27. Operating Systems: Virtual Memory & File Systems
  {
    subjectId: 'os',
    subjectName: 'Operating Systems',
    topic: 'Virtual Memory, Page Replacement & Disk Scheduling',
    track: 'core-cs',
    phase: 'Track A & B: Operating Systems & Databases Track',
    isMilestone: true,
    milestoneTitle: 'Operating Systems Mastery Benchmark',
    subtopics: [
      {
        id: 'os-virt-disk',
        name: 'FIFO, LRU, Optimal Page Replacement, Inodes & Disk Scheduling',
        description: 'Belady\'s anomaly, thrashing, Unix inode addressable capacity, SSTF, SCAN, C-SCAN, LOOK seek calculations',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 28. Databases: ER Model & Relational Algebra
  {
    subjectId: 'dbms',
    subjectName: 'Databases (DBMS)',
    topic: 'ER Model & Relational Algebra Operators',
    track: 'core-cs',
    phase: 'Track A & B: Operating Systems & Databases Track',
    subtopics: [
      {
        id: 'dbms-er-algebra',
        name: 'Cardinality Ratios, Weak Entities & Relational Algebra',
        description: 'Mapping ER diagrams to minimum relational tables, Select, Project, Join, Division, Relational completeness',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 29. Databases: SQL Queries & Tuple Calculus
  {
    subjectId: 'dbms',
    subjectName: 'Databases (DBMS)',
    topic: 'SQL: Nested Subqueries & Relational Calculus',
    track: 'core-cs',
    phase: 'Track A & B: Operating Systems & Databases Track',
    subtopics: [
      {
        id: 'dbms-sql-trc',
        name: 'Complex SQL Queries, Group By/Having & TRC Quantifiers',
        description: 'Correlated subqueries, EXISTS, IN, NULL semantics, Tuple Relational Calculus safe expressions',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 30. Databases: Normalization & Functional Dependencies
  {
    subjectId: 'dbms',
    subjectName: 'Databases (DBMS)',
    topic: 'Functional Dependencies & Normal Forms (1NF-BCNF)',
    track: 'core-cs',
    phase: 'Track A & B: Operating Systems & Databases Track',
    subtopics: [
      {
        id: 'dbms-norm',
        name: 'Attribute Closure, Candidate Keys, 3NF, BCNF & Decomposition',
        description: 'Minimal canonical cover, lossless join test, dependency preservation test, 3NF synthesis algorithm',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 80,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 31. Databases: Transactions, 2PL & B-Tree Indexing
  {
    subjectId: 'dbms',
    subjectName: 'Databases (DBMS)',
    topic: 'Transactions: Concurrency Control & B+ Trees',
    track: 'core-cs',
    phase: 'Track A & B: Operating Systems & Databases Track',
    isMilestone: true,
    milestoneTitle: 'Databases (DBMS) Milestone',
    subtopics: [
      {
        id: 'dbms-trans-btree',
        name: 'Conflict Serializability, Two-Phase Locking & B+ Trees',
        description: 'Precedence graph testing, Strict 2PL, Thomas write rule, B+ tree node order, max/min keys and search IO cost',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 80,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 32. COA: Machine Instructions & Addressing Modes
  {
    subjectId: 'coa',
    subjectName: 'Computer Organization & Architecture',
    topic: 'Instruction Formats & Addressing Modes',
    track: 'core-cs',
    phase: 'Track A & B: Architecture & Networks Track',
    subtopics: [
      {
        id: 'coa-instr-addr',
        name: 'Instruction Encodings, Expanding Opcode & Effective Address',
        description: 'Zero/One/Two/Three address instruction length, Immediate, Direct, Indirect, Indexed, Relative addressing modes',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 33. COA: ALU, Datapath & Control Unit
  {
    subjectId: 'coa',
    subjectName: 'Computer Organization & Architecture',
    topic: 'ALU Design, Booth\'s Algorithm & Control Unit',
    track: 'core-cs',
    phase: 'Track A & B: Architecture & Networks Track',
    subtopics: [
      {
        id: 'coa-alu-ctrl',
        name: 'Booth\'s Multiplication, IEEE 754 & Microprogrammed Control',
        description: 'Restoring/Non-restoring division, horizontal vs vertical microinstructions, control word length calculation',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 34. COA: Pipelining & Hazards
  {
    subjectId: 'coa',
    subjectName: 'Computer Organization & Architecture',
    topic: 'Pipelining: Speedup, Throughput & Hazards',
    track: 'core-cs',
    phase: 'Track A & B: Architecture & Networks Track',
    subtopics: [
      {
        id: 'coa-pipe-hazards',
        name: 'Pipeline Speedup Formula & Structural/Data/Control Hazards',
        description: 'RAW, WAR, WAW dependencies, operand forwarding, branch prediction penalties, stall cycle calculations',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 80,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 35. COA: Cache Memory Hierarchy & I/O
  {
    subjectId: 'coa',
    subjectName: 'Computer Organization & Architecture',
    topic: 'Cache Memory Mapping, AMAT & I/O DMA',
    track: 'core-cs',
    phase: 'Track A & B: Architecture & Networks Track',
    isMilestone: true,
    milestoneTitle: 'COA Full Subject Milestone',
    subtopics: [
      {
        id: 'coa-cache-dma',
        name: 'Direct/Set-Associative Mapping, Cache AMAT & DMA Transfer',
        description: 'Tag, index, block offset bits, write-through vs write-back, multi-level cache AMAT, DMA cycle stealing',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 80,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 36. Networks: Data Link Layer & Sliding Window
  {
    subjectId: 'networks',
    subjectName: 'Computer Networks',
    topic: 'Data Link Layer: Framing, CRC & Flow Control',
    track: 'core-cs',
    phase: 'Track A & B: Architecture & Networks Track',
    subtopics: [
      {
        id: 'cn-dll-sliding',
        name: 'Framing, CRC Division & Stop-and-Wait/GBN/SR Protocols',
        description: 'Bit/byte stuffing, Hamming code, protocol efficiencies, sender/receiver window sizes, sequence numbers',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 80,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 37. Networks: Medium Access Control & Ethernet
  {
    subjectId: 'networks',
    subjectName: 'Computer Networks',
    topic: 'Medium Access: CSMA/CD, ALOHA & Ethernet',
    track: 'core-cs',
    phase: 'Track A & B: Architecture & Networks Track',
    subtopics: [
      {
        id: 'cn-mac',
        name: 'CSMA/CD Collision Detection Condition & Exponential Backoff',
        description: 'Minimum frame length condition (L >= 2 * Tp * B), Pure vs Slotted ALOHA maximum efficiencies',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 38. Networks: Network Layer IPv4 & Subnetting
  {
    subjectId: 'networks',
    subjectName: 'Computer Networks',
    topic: 'Network Layer: IPv4, Subnetting & Fragmentation',
    track: 'core-cs',
    phase: 'Track A & B: Architecture & Networks Track',
    subtopics: [
      {
        id: 'cn-ipv4-subnet',
        name: 'IPv4 Header, CIDR Prefix Allocation & Fragmentation Offsets',
        description: 'Subnet masks, broadcast and network address calculations, longest prefix matching, MTU fragment offset',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 80,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 39. Networks: Routing Protocols (DVR & LSR)
  {
    subjectId: 'networks',
    subjectName: 'Computer Networks',
    topic: 'Routing Protocols: Distance Vector & Link State',
    track: 'core-cs',
    phase: 'Track A & B: Architecture & Networks Track',
    subtopics: [
      {
        id: 'cn-routing',
        name: 'Distance Vector (Bellman-Ford) & Link State (Dijkstra) Routing',
        description: 'Count-to-infinity problem, split horizon, poison reverse, OSPF link state advertisements, BGP basics',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 75,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
  // 40. Networks: Transport Layer (TCP, Congestion Control) & App Layer
  {
    subjectId: 'networks',
    subjectName: 'Computer Networks',
    topic: 'Transport Layer: TCP Congestion Control & Application Protocols',
    track: 'core-cs',
    phase: 'Track A & B: Architecture & Networks Track',
    isMilestone: true,
    milestoneTitle: 'Computer Networks & Core CS Full Syllabus Benchmark',
    subtopics: [
      {
        id: 'cn-tcp-app',
        name: 'TCP 3-Way Handshake, Slow Start/Congestion Avoidance & DNS/HTTP',
        description: 'Tahoe vs Reno congestion control, fast retransmit, DNS recursive/iterative queries, HTTP, RSA cryptography basics',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 80,
        reviseMins: 30,
        pyqMins: 65,
      },
    ],
  },
];

// -------------------------------------------------------------
// TRACK C: DEDICATED GENERAL APTITUDE (JANUARY 2027 ONLY)
// -------------------------------------------------------------
const APTITUDE_TOPICS: RawDayItem[] = [
  {
    subjectId: 'aptitude',
    subjectName: 'General Aptitude',
    topic: 'Quantitative Aptitude: Numbers, Ratios & Percentages',
    track: 'aptitude',
    phase: 'Phase 2: January Aptitude & Mock Sprint',
    subtopics: [
      {
        id: 'ga-quant-num',
        name: 'Number Systems, Ratios, Percentages & Profit/Loss',
        description: 'LCM, HCF, percentages, profit and loss calculations, mixtures and allegations, simple/compound interest',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 60,
        reviseMins: 20,
        pyqMins: 60,
      },
    ],
  },
  {
    subjectId: 'aptitude',
    subjectName: 'General Aptitude',
    topic: 'Quantitative Aptitude: Time, Work, Speed & Distance',
    track: 'aptitude',
    phase: 'Phase 2: January Aptitude & Mock Sprint',
    subtopics: [
      {
        id: 'ga-quant-work',
        name: 'Time & Work, Pipes & Cisterns, Relative Speed & Trains',
        description: 'Work equivalence formulas, relative velocity in trains and boats/streams',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 60,
        reviseMins: 20,
        pyqMins: 60,
      },
    ],
  },
  {
    subjectId: 'aptitude',
    subjectName: 'General Aptitude',
    topic: 'Analytical & Spatial Reasoning',
    track: 'aptitude',
    phase: 'Phase 2: January Aptitude & Mock Sprint',
    subtopics: [
      {
        id: 'ga-analytical-spatial',
        name: 'Syllogisms, Blood Relations, 2D/3D Paper Folding & Symmetry',
        description: 'Venn diagrams for deductive reasoning, direction sense, mirror reflection, pattern completion',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 60,
        reviseMins: 20,
        pyqMins: 60,
      },
    ],
  },
  {
    subjectId: 'aptitude',
    subjectName: 'General Aptitude',
    topic: 'Verbal Aptitude: Grammar & Reading Comprehension',
    track: 'aptitude',
    phase: 'Phase 2: January Aptitude & Mock Sprint',
    subtopics: [
      {
        id: 'ga-verbal',
        name: 'English Grammar, Prepositions, Tenses & Critical Reading',
        description: 'Subject-verb agreement, sentence completion, reading comprehension paragraph inferences',
        weightage: 'high',
        isFamiliar: false,
        learnMins: 55,
        reviseMins: 20,
        pyqMins: 60,
      },
    ],
  },
];

// Helper to generate the complete interleaved day-by-day plan
export function generateDefaultRoadmap(startDateStr = '2026-10-24'): StudyDay[] {
  const startDate = new Date(startDateStr);
  const examDate = new Date('2027-02-07');
  const totalDays = Math.ceil((examDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1; // 107 days

  const days: StudyDay[] = [];

  let aptitudePointer = 0;
  let mockNumber = 1;

  for (let i = 0; i < totalDays; i++) {
    const dayNumber = i + 1;
    const dateStr = getDateStr(startDate, i);
    const dateObj = new Date(dateStr);
    const isJanuaryOrLater = dateObj.getFullYear() >= 2027;
    const isExamDay = i === totalDays - 1;

    if (isExamDay) {
      // D-Day: February 7, 2027
      const examSubtask: Subtask = {
        id: `d${dayNumber}-exam-dday`,
        title: 'Official 3-Hour GATE CSE Examination Session (65 Qs / 100 Marks)',
        type: 'mock',
        estimatedMinutes: 180,
        completed: false,
        track: 'mock',
        subjectId: 'full-mock',
        subjectName: 'Mock Tests & Grand Revisions',
      };
      days.push({
        dayNumber,
        date: dateStr,
        track: 'mock',
        tracks: ['mock'],
        subjectId: 'full-mock',
        subjectName: 'Mock Tests & Grand Revisions',
        topic: 'D-DAY: GATE CSE 2027 EXAMINATION (9:30 AM - 12:30 PM)',
        subtopics: [
          {
            id: `d${dayNumber}-exam-session`,
            name: 'Official GATE CSE 2027 Examination Session',
            description: '65 Questions / 100 Marks. Strict adherence to exam strategy and virtual calculator discipline.',
            estimatedMinutes: 180,
            subtasks: [examSubtask],
            weightage: 'high',
            track: 'mock',
            subjectId: 'full-mock',
            subjectName: 'Mock Tests & Grand Revisions',
            topicName: 'D-DAY: GATE CSE 2027 EXAMINATION',
          },
        ],
        estimatedMinutes: 180,
        status: 'upcoming',
        isProtected: true,
        isMilestone: true,
        milestoneTitle: 'D-DAY: GATE CSE 2027 EXAMINATION (9:30 AM - 12:30 PM)',
        phase: 'Phase 3: Final Examination',
      });
    } else if (!isJanuaryOrLater) {
      // -------------------------------------------------------------
      // OCTOBER 24 - DECEMBER 31, 2026: CONCURRENT PARALLEL TRACKS
      // Track A (Math): 90 minutes
      // Track B (Core CS): 90 minutes
      // Combined Daily Budget: 180 minutes (3.0 hours)
      // -------------------------------------------------------------
      const mathItem = MATH_TOPICS[i % MATH_TOPICS.length];
      const coreCsItem = CORE_CS_TOPICS[i % CORE_CS_TOPICS.length];

      const mathRawSt = mathItem.subtopics[0];
      const coreCsRawSt = coreCsItem.subtopics[0];

      // Track A: Math Subtopic (90 mins: 45m learn, 15m revise, 30m pyq)
      const mathSubtasks = createSubtasks(
        dayNumber,
        `math-${mathRawSt.id}`,
        mathRawSt.name,
        45,
        15,
        30,
        true,
        'math',
        mathItem.subjectId,
        mathItem.subjectName
      );
      const mathMinutes = mathSubtasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

      const mathSubtopic: RoadmapSubtopic = {
        id: `d${dayNumber}-math-${mathRawSt.id}`,
        name: `[Track A: Math] ${mathRawSt.name}`,
        description: mathRawSt.description,
        estimatedMinutes: mathMinutes,
        subtasks: mathSubtasks,
        isFamiliar: mathRawSt.isFamiliar ?? false,
        weightage: mathRawSt.weightage,
        track: 'math',
        subjectId: mathItem.subjectId,
        subjectName: mathItem.subjectName,
        topicName: mathItem.topic,
      };

      // Track B: Core CS Subtopic (90 mins: 45m learn, 15m revise, 30m pyq)
      const coreCsSubtasks = createSubtasks(
        dayNumber,
        `core-${coreCsRawSt.id}`,
        coreCsRawSt.name,
        45,
        15,
        30,
        true,
        'core-cs',
        coreCsItem.subjectId,
        coreCsItem.subjectName
      );
      const coreCsMinutes = coreCsSubtasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

      const coreCsSubtopic: RoadmapSubtopic = {
        id: `d${dayNumber}-core-${coreCsRawSt.id}`,
        name: `[Track B: Core CS] ${coreCsRawSt.name}`,
        description: coreCsRawSt.description,
        estimatedMinutes: coreCsMinutes,
        subtasks: coreCsSubtasks,
        isFamiliar: coreCsRawSt.isFamiliar ?? false,
        weightage: coreCsRawSt.weightage,
        track: 'core-cs',
        subjectId: coreCsItem.subjectId,
        subjectName: coreCsItem.subjectName,
        topicName: coreCsItem.topic,
      };

      const dayTotalMinutes = mathMinutes + coreCsMinutes;

      days.push({
        dayNumber,
        date: dateStr,
        track: 'parallel',
        tracks: ['math', 'core-cs'],
        subjectId: coreCsItem.subjectId,
        subjectName: `${mathItem.subjectName} + ${coreCsItem.subjectName}`,
        topic: `Track A: ${mathItem.topic} • Track B: ${coreCsItem.topic}`,
        subtopics: [mathSubtopic, coreCsSubtopic],
        estimatedMinutes: dayTotalMinutes,
        status: i === 0 ? 'in-progress' : 'upcoming',
        isProtected: false,
        isMilestone: mathItem.isMilestone || coreCsItem.isMilestone,
        milestoneTitle: mathItem.milestoneTitle || coreCsItem.milestoneTitle,
        phase: 'Track A & B: Parallel Foundations (90m Math + 90m Core CS)',
      });
    } else {
      // -------------------------------------------------------------
      // JANUARY 1 - FEBRUARY 6, 2027: APTITUDE, REVISION & 2-DAY MOCK CYCLES
      // -------------------------------------------------------------
      const daysIntoJan = i - 68; // Day 69 is Jan 1 (daysIntoJan = 1)
      const mockDaysList = [3, 7, 11, 15, 19, 23, 27, 31]; // Jan 3, 7, 11, 15, 19, 23, 27, 31
      const analysisDaysList = [4, 8, 12, 16, 20, 24, 28, 32]; // Jan 4, 8, 12, 16, 20, 24, 28, Feb 1
      const isMockDay = mockDaysList.includes(daysIntoJan) && mockNumber <= 8;
      const isAnalysisDay = analysisDaysList.includes(daysIntoJan) && mockNumber <= 8;

      if (isMockDay) {
        const currentMock = mockNumber;
        const task: Subtask = {
          id: `d${dayNumber}-mock-${currentMock}-exam`,
          title: `Live 3-Hour Simulated Test Session (Mock ${currentMock})`,
          type: 'mock',
          estimatedMinutes: 180,
          completed: false,
          track: 'mock',
          subjectId: 'full-mock',
          subjectName: 'Mock Tests & Grand Revisions',
        };
        days.push({
          dayNumber,
          date: dateStr,
          track: 'mock',
          tracks: ['mock'],
          subjectId: 'full-mock',
          subjectName: 'Mock Tests & Grand Revisions',
          topic: `Full-Length Simulated Mock Test ${currentMock} (65 Qs / 180 min)`,
          subtopics: [
            {
              id: `d${dayNumber}-mock-${currentMock}-subtopic`,
              name: `Live 3-Hour Simulated Test Session (Mock ${currentMock})`,
              description: 'Strict 180-minute exam conditions with virtual calculator practice (100 marks total)',
              estimatedMinutes: 180,
              subtasks: [task],
              weightage: 'high',
              track: 'mock',
              subjectId: 'full-mock',
              subjectName: 'Mock Tests & Grand Revisions',
              topicName: `Full-Length Simulated Mock Test ${currentMock}`,
            },
          ],
          estimatedMinutes: 180,
          status: 'upcoming',
          isProtected: true,
          isMilestone: true,
          milestoneTitle: `Mock Test ${currentMock}: Complete GATE Simulation`,
          phase: 'Phase 2: January Aptitude & Mock Sprint',
        });
      } else if (isAnalysisDay) {
        const currentMock = mockNumber;
        mockNumber++; // advance to next mock after analysis
        const task1: Subtask = {
          id: `d${dayNumber}-mock-${currentMock}-review`,
          title: `Categorize Calculation & Conceptual Errors (Mock ${currentMock})`,
          type: 'analysis',
          estimatedMinutes: 90,
          completed: false,
          track: 'mock',
          subjectId: 'full-mock',
          subjectName: 'Mock Tests & Grand Revisions',
        };
        const task2: Subtask = {
          id: `d${dayNumber}-mock-${currentMock}-weak-remedy`,
          title: `Remediate Identified Weak Topics & Update Mistake Log (Mock ${currentMock})`,
          type: 'revise',
          estimatedMinutes: 90,
          completed: false,
          track: 'mock',
          subjectId: 'full-mock',
          subjectName: 'Mock Tests & Grand Revisions',
        };
        days.push({
          dayNumber,
          date: dateStr,
          track: 'mock',
          tracks: ['mock'],
          subjectId: 'full-mock',
          subjectName: 'Mock Tests & Grand Revisions',
          topic: `In-Depth Error Analysis & Mistake Log Review (Mock ${currentMock})`,
          subtopics: [
            {
              id: `d${dayNumber}-mock-${currentMock}-analysis-subtopic`,
              name: `Error Analysis & Weak Topic Remediation (Mock ${currentMock})`,
              description: 'Categorizing calculation mistakes, conceptual gaps, and logging recurring error patterns',
              estimatedMinutes: 180,
              subtasks: [task1, task2],
              weightage: 'high',
              track: 'mock',
              subjectId: 'full-mock',
              subjectName: 'Mock Tests & Grand Revisions',
              topicName: `In-Depth Error Analysis (Mock ${currentMock})`,
            },
          ],
          estimatedMinutes: 180,
          status: 'upcoming',
          isProtected: true,
          phase: 'Phase 2: January Aptitude & Mock Sprint',
        });
      } else if (aptitudePointer < APTITUDE_TOPICS.length) {
        // January Non-Mock: Dedicated General Aptitude (90m) + Core CS/Math Revision (90m)
        const gaItem = APTITUDE_TOPICS[aptitudePointer];
        aptitudePointer++;

        const gaRawSt = gaItem.subtopics[0];
        const gaSubtasks = createSubtasks(
          dayNumber,
          `ga-${gaRawSt.id}`,
          gaRawSt.name,
          45,
          15,
          30,
          true,
          'aptitude',
          'aptitude',
          'General Aptitude'
        );

        // Technical Math/Core CS revision subtopic (90 min)
        const isMathReview = daysIntoJan % 2 === 0;
        const revSubjectId = isMathReview ? 'discrete-math' : 'algorithms';
        const revSubjectName = isMathReview ? 'Discrete Mathematics' : 'Algorithms';
        const revTopicTitle = isMathReview
          ? 'Discrete Math & Linear Algebra Formula Speed Drill'
          : 'Algorithms & Operating Systems High-Yield Numerical Drill';

        const revSubtasks: Subtask[] = [
          {
            id: `d${dayNumber}-jan-tech-rev`,
            title: `Formula Speed Review & Theorems: ${revSubjectName}`,
            type: 'revise',
            estimatedMinutes: 30,
            completed: false,
            track: isMathReview ? 'math' : 'core-cs',
            subjectId: revSubjectId,
            subjectName: revSubjectName,
          },
          {
            id: `d${dayNumber}-jan-tech-pyq`,
            title: `Timed PYQs & Weak Topic Correction: ${revSubjectName}`,
            type: 'pyq',
            estimatedMinutes: 60,
            completed: false,
            track: isMathReview ? 'math' : 'core-cs',
            subjectId: revSubjectId,
            subjectName: revSubjectName,
          },
        ];

        const gaSubtopic: RoadmapSubtopic = {
          id: `d${dayNumber}-ga-${gaRawSt.id}`,
          name: `[General Aptitude] ${gaRawSt.name}`,
          description: gaRawSt.description,
          estimatedMinutes: 90,
          subtasks: gaSubtasks,
          weightage: 'high',
          track: 'aptitude',
          subjectId: 'aptitude',
          subjectName: 'General Aptitude',
          topicName: gaItem.topic,
        };

        const techSubtopic: RoadmapSubtopic = {
          id: `d${dayNumber}-tech-rev-${daysIntoJan}`,
          name: `[Technical Revision] ${revTopicTitle}`,
          description: 'Timed multi-subject problem solving based on mock test error log gaps',
          estimatedMinutes: 90,
          subtasks: revSubtasks,
          weightage: 'high',
          track: isMathReview ? 'math' : 'core-cs',
          subjectId: revSubjectId,
          subjectName: revSubjectName,
          topicName: revTopicTitle,
        };

        days.push({
          dayNumber,
          date: dateStr,
          track: 'parallel',
          tracks: ['aptitude', isMathReview ? 'math' : 'core-cs'],
          subjectId: 'aptitude',
          subjectName: `General Aptitude & ${revSubjectName}`,
          topic: `Aptitude: ${gaItem.topic} • Technical: ${revTopicTitle}`,
          subtopics: [gaSubtopic, techSubtopic],
          estimatedMinutes: 180,
          status: 'upcoming',
          phase: 'Phase 2: January Aptitude & Mock Sprint',
        });
      } else {
        // High-yield formula revision and weak-topic drills before exam
        const revSubtasks: Subtask[] = [
          {
            id: `d${dayNumber}-final-rev-1`,
            title: 'Track A (Math) Grand Formula & Theorem Revision',
            type: 'revise',
            estimatedMinutes: 90,
            completed: false,
            track: 'math',
            subjectId: 'eng-math',
            subjectName: 'Engineering Mathematics',
          },
          {
            id: `d${dayNumber}-final-rev-2`,
            title: 'Track B (Core CS) High-Yield Numerical & Formula Revision',
            type: 'revise',
            estimatedMinutes: 90,
            completed: false,
            track: 'core-cs',
            subjectId: 'algorithms',
            subjectName: 'Algorithms',
          },
        ];
        days.push({
          dayNumber,
          date: dateStr,
          track: 'parallel',
          tracks: ['math', 'core-cs'],
          subjectId: 'algorithms',
          subjectName: 'Grand Revisions: Math + Core CS',
          topic: 'Final Sprint: Multi-Subject Grand Revision & Mindset Prep',
          subtopics: [
            {
              id: `d${dayNumber}-final-rev-subtopic`,
              name: 'Multi-Subject Formula Speed Drills & Error Log Review',
              description: 'Fast-paced review of formulas, corner cases, and exam-taking strategy',
              estimatedMinutes: 180,
              subtasks: revSubtasks,
              weightage: 'high',
              track: 'parallel',
              subjectId: 'algorithms',
              subjectName: 'Grand Revisions',
              topicName: 'Final Grand Revisions',
            },
          ],
          estimatedMinutes: 180,
          status: 'upcoming',
          phase: 'Phase 2: January Aptitude & Mock Sprint',
        });
      }
    }
  }

  return days;
}
