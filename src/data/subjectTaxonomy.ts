import type { SubjectId, SubjectMeta } from '../types/roadmap';

export const SUBJECT_METAS: Record<SubjectId, SubjectMeta> = {
  'eng-math': {
    id: 'eng-math',
    name: 'Engineering Mathematics',
    shortCode: 'EM',
    track: 'math',
    color: '#388bfd', // Blue
    textColor: '#58a6ff',
    gateWeightagePercent: 7,
    isCore: true,
  },
  'discrete-math': {
    id: 'discrete-math',
    name: 'Discrete Mathematics',
    shortCode: 'DM',
    track: 'math',
    color: '#8957e5', // Purple
    textColor: '#bc8cff',
    gateWeightagePercent: 8,
    isCore: true,
  },
  'digital-logic': {
    id: 'digital-logic',
    name: 'Digital Logic',
    shortCode: 'DL',
    track: 'core-cs',
    color: '#d29922', // Amber
    textColor: '#e3b341',
    gateWeightagePercent: 5,
    isCore: true,
  },
  'prog-ds': {
    id: 'prog-ds',
    name: 'Programming & Data Structures',
    shortCode: 'PDS',
    track: 'core-cs',
    color: '#238636', // Green
    textColor: '#3fb950',
    gateWeightagePercent: 11,
    isCore: true,
  },
  'algorithms': {
    id: 'algorithms',
    name: 'Algorithms',
    shortCode: 'ALGO',
    track: 'core-cs',
    color: '#1f6feb', // Vivid Blue
    textColor: '#79c0ff',
    gateWeightagePercent: 10,
    isCore: true,
  },
  'toc': {
    id: 'toc',
    name: 'Theory of Computation',
    shortCode: 'TOC',
    track: 'core-cs',
    color: '#da3633', // Coral Red
    textColor: '#ff7b72',
    gateWeightagePercent: 9,
    isCore: true,
  },
  'compiler': {
    id: 'compiler',
    name: 'Compiler Design',
    shortCode: 'CD',
    track: 'core-cs',
    color: '#bf4b8a', // Magenta
    textColor: '#d2a8ff',
    gateWeightagePercent: 5,
    isCore: true,
  },
  'os': {
    id: 'os',
    name: 'Operating Systems',
    shortCode: 'OS',
    track: 'core-cs',
    color: '#0969da', // Deep Blue
    textColor: '#58a6ff',
    gateWeightagePercent: 10,
    isCore: true,
  },
  'dbms': {
    id: 'dbms',
    name: 'Databases (DBMS)',
    shortCode: 'DBMS',
    track: 'core-cs',
    color: '#2ea043', // Jade
    textColor: '#56d364',
    gateWeightagePercent: 8,
    isCore: true,
  },
  'coa': {
    id: 'coa',
    name: 'Computer Organization & Architecture',
    shortCode: 'COA',
    track: 'core-cs',
    color: '#b08800', // Gold
    textColor: '#f2cc60',
    gateWeightagePercent: 9,
    isCore: true,
  },
  'networks': {
    id: 'networks',
    name: 'Computer Networks',
    shortCode: 'CN',
    track: 'core-cs',
    color: '#1a7f37', // Emerald
    textColor: '#3fb950',
    gateWeightagePercent: 8,
    isCore: true,
  },
  'aptitude': {
    id: 'aptitude',
    name: 'General Aptitude',
    shortCode: 'GA',
    track: 'aptitude',
    color: '#f0883e', // Orange
    textColor: '#ffa657',
    gateWeightagePercent: 15,
    isCore: false,
  },
  'full-mock': {
    id: 'full-mock',
    name: 'Mock Tests & Grand Revisions',
    shortCode: 'MOCK',
    track: 'mock',
    color: '#a371f7', // Violet
    textColor: '#d2a8ff',
    gateWeightagePercent: 100,
    isCore: false,
  },
};
