export interface DiagnosticQuestion {
  id: string;
  subtopicKey: string; // matches topic keyword like 'mat-prop', 'det-inv', 'sys-eq', 'eigen', 'sets', 'relations', 'prop-logic'
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export const DIAGNOSTIC_QUESTION_BANK: DiagnosticQuestion[] = [
  // Matrices & Determinants
  {
    id: 'q-mat-1',
    subtopicKey: 'mat-prop',
    question: 'If A is a 3x3 real orthogonal matrix, then which of the following is ALWAYS true for det(A)?',
    options: ['det(A) = 0', 'det(A) = 1 or -1', 'det(A) > 1', 'det(A) is purely imaginary'],
    correctOptionIndex: 1,
    explanation: 'For an orthogonal matrix, A * A^T = I. Taking determinants: det(A) * det(A^T) = (det(A))^2 = 1, hence det(A) = +1 or -1.',
  },
  {
    id: 'q-mat-2',
    subtopicKey: 'mat-prop',
    question: 'The rank of a 4x5 matrix A is at most:',
    options: ['4', '5', '9', '20'],
    correctOptionIndex: 0,
    explanation: 'Rank of any m x n matrix is bounded by min(m, n). For 4x5, min(4, 5) = 4.',
  },
  {
    id: 'q-det-1',
    subtopicKey: 'det-inv',
    question: 'If A is a non-singular 3x3 matrix and det(A) = 5, what is det(adj(A))?',
    options: ['5', '25', '125', '1/5'],
    correctOptionIndex: 1,
    explanation: 'For an n x n matrix, det(adj(A)) = (det(A))^(n - 1). Here n = 3, so 5^(3 - 1) = 5^2 = 25.',
  },
  {
    id: 'q-sys-1',
    subtopicKey: 'sys-eq',
    question: 'A system of linear equations AX = B has a unique solution if and only if:',
    options: [
      'Rank(A) = Rank([A|B]) < number of variables',
      'Rank(A) = Rank([A|B]) = number of variables',
      'Rank(A) != Rank([A|B])',
      'Rank(A) = 0',
    ],
    correctOptionIndex: 1,
    explanation: 'By Rouché-Capelli Theorem, Rank(A) = Rank([A|B]) = n yields a unique solution.',
  },
  {
    id: 'q-eigen-1',
    subtopicKey: 'eigen',
    question: 'The sum and product of eigenvalues of a square matrix A are respectively equal to:',
    options: [
      'Determinant and Trace of A',
      'Trace and Determinant of A',
      'Rank and Nullity of A',
      'Diagonal sum and Inverse of A',
    ],
    correctOptionIndex: 1,
    explanation: 'Sum of eigenvalues = trace(A), and product of eigenvalues = det(A).',
  },
  {
    id: 'q-sets-1',
    subtopicKey: 'sets',
    question: 'If a set S has n elements, how many non-empty subsets does the power set P(S) contain?',
    options: ['2^n', '2^n - 1', 'n^2', '2^(n - 1)'],
    correctOptionIndex: 1,
    explanation: 'The power set has 2^n total subsets. Excluding the empty set gives 2^n - 1 non-empty subsets.',
  },
  {
    id: 'q-rel-1',
    subtopicKey: 'relations',
    question: 'A relation R on a set A is an equivalence relation if and only if it is:',
    options: [
      'Reflexive, Symmetric, and Transitive',
      'Reflexive, Antisymmetric, and Transitive',
      'Irreflexive, Symmetric, and Transitive',
      'Reflexive and Symmetric only',
    ],
    correctOptionIndex: 0,
    explanation: 'By definition, an equivalence relation satisfies reflexivity, symmetry, and transitivity.',
  },
  {
    id: 'q-logic-1',
    subtopicKey: 'prop-logic',
    question: 'Which of the following propositional formulas is a tautology?',
    options: ['P -> (P -> Q)', '(P and (P -> Q)) -> Q', 'P and not P', '(P or Q) -> P'],
    correctOptionIndex: 1,
    explanation: 'Modus Ponens in conditional form: (P and (P -> Q)) -> Q is identically TRUE under all truth assignments.',
  },
];

export function getDiagnosticQuestionsForSubtopic(subtopicIdOrName: string): DiagnosticQuestion[] {
  const lower = subtopicIdOrName.toLowerCase();
  const matched = DIAGNOSTIC_QUESTION_BANK.filter((q) => {
    return (
      lower.includes(q.subtopicKey) ||
      (q.subtopicKey === 'mat-prop' && (lower.includes('matrix') || lower.includes('matrices'))) ||
      (q.subtopicKey === 'det-inv' && lower.includes('determinant')) ||
      (q.subtopicKey === 'sys-eq' && lower.includes('linear')) ||
      (q.subtopicKey === 'eigen' && lower.includes('eigen')) ||
      (q.subtopicKey === 'sets' && lower.includes('set')) ||
      (q.subtopicKey === 'relations' && lower.includes('relation')) ||
      (q.subtopicKey === 'prop-logic' && lower.includes('logic'))
    );
  });

  return matched.length > 0 ? matched : DIAGNOSTIC_QUESTION_BANK.slice(0, 3);
}
