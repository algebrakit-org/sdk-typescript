// AK_Exercise types for the Algebrakit Webservice API
// These define the human-friendly exercise specification format accepted by
// the session/create and exercise/validate endpoints.

// ============================================================================
// Enums & String Literal Types
// ============================================================================

export type AK_QuestionMode = 'ONE_BY_ONE' | 'ALL_AT_ONCE';

export type AK_SymbolType = 'VARIABLE' | 'CONSTANT' | 'FUNCTION' | 'FREEVARIABLE';

export type AK_InteractionType = 'MULTISTEP' | 'CHOICE' | 'FILL_IN_THE_BLANKS' | 'MATH_TABLE';

export type AK_ElementBlockType = 'CONTENT' | 'INTERACTION';

export type AK_FieldSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export type AK_BlankType = 'EXPRESSION' | 'SELECTION';

export type AK_CellType = 'text' | 'math' | 'input';

export type AK_AccuracyType = 'ROUND' | 'ROUND_UP' | 'ROUND_DOWN' | 'ACCURATE' | 'PRECISION';

export type AK_NumberForm =
  | 'DECIMAL_REQUIRED'
  | 'DECIMAL_PREFERRED'
  | 'FRACTION_REQUIRED'
  | 'FRACTION_PREFERRED'
  | 'SCIENTIFIC_NOTATION_REQUIRED'
  | 'SCIENTIFIC_NOTATION_PREFERRED';

export type AK_RadicalForm = 'STANDARD_FORM_REQUIRED';

export type AK_FractionForm = 'MIXED_FRACTION_REQUIRED' | 'IMPROPER_FRACTION_REQUIRED';

export type AK_InitialExpressionType = 'NONE' | 'CUSTOM' | 'AUTOMATIC';

export type AK_TaskType =
  | 'SIMPLIFY'
  | 'SOLVE'
  | 'SOLVE_SYSTEM'
  | 'EXPAND'
  | 'FACTOR'
  | 'TOGETHER'
  | 'COMPLETE_SQUARE'
  | 'POLYNOMIAL_STANDARD_FORM'
  | 'POWER_STANDARD_FORM'
  | 'EXPONENTIAL_STANDARD_FORM'
  | 'CARTESIAN_TO_POLAR_FORM'
  | 'POLAR_TO_CARTESIAN_FORM';

// ============================================================================
// Top-level Exercise
// ============================================================================

/**
 * The AK_Exercise specification format. A human-friendly way to define
 * mathematical exercises for the Algebrakit API.
 */
export interface IAK_Exercise {
  type: 'AK_Exercise';
  version: number;
  studentProfile: string;
  script?: string;
  symbols?: IAK_Symbol[];
  elements: IAK_Element[];
  questionMode: AK_QuestionMode;
}

export interface IAK_Symbol {
  name: string;
  type: AK_SymbolType;
  synonym?: string;
  addToFormulaEditor?: boolean;
  notations?: string[];
}

// ============================================================================
// Elements & Blocks
// ============================================================================

export interface IAK_Element {
  blocks: (IAK_ContentBlock | IAK_InteractionBlock)[];
}

export interface IAK_ElementBlock {
  id?: string;
  type: AK_ElementBlockType;
}

export interface IAK_ContentBlock extends IAK_ElementBlock {
  type: 'CONTENT';
  content: string;
}

export interface IAK_InteractionBlock extends IAK_ElementBlock {
  type: 'INTERACTION';
  interaction: IAK_InteractionChoice | IAK_InteractionFITB | IAK_InteractionMultistep | IAK_InteractionTable;
}

// ============================================================================
// Interactions
// ============================================================================

export interface IAK_Interaction {
  type: AK_InteractionType;
  refId?: string;
  instruction?: string;
  scored?: boolean;
  hints?: string[];
  enableCalculator?: boolean;
}

export interface IAK_InteractionChoice extends IAK_Interaction {
  type: 'CHOICE';
  spec: IAK_SelectionPart;
}

export interface IAK_InteractionFITB extends IAK_Interaction {
  type: 'FILL_IN_THE_BLANKS';
  content: string;
  blanks: IAK_Blank[];
  interchangables?: string[][];
}

export interface IAK_InteractionMultistep extends IAK_Interaction {
  type: 'MULTISTEP';
  givenParts?: { [key: string]: IAK_MultistepPart };
  intermediateParts?: { [key: string]: IAK_MultistepPart };
  solutionPart: IAK_MultistepPart;
  initialExpressionType?: AK_InitialExpressionType;
  initialExpression?: string;
}

export interface IAK_InteractionTable extends IAK_Interaction {
  type: 'MATH_TABLE';
  cells: IAK_Cell[];
}

// ============================================================================
// Parts
// ============================================================================

export interface IAK_UnitSpec {
  unit: string;
  allowEquivalentUnits?: boolean;
  override?: boolean;
}

export interface IAK_FormSpec {
  numbers?: AK_NumberForm;
  radicals?: AK_RadicalForm;
  fractions?: AK_FractionForm;
}

export interface IAK_ExpressionPart {
  task: IAK_Task;
  accuracy?: AK_AccuracyPreSpec;
  unit?: IAK_UnitSpec;
  form?: IAK_FormSpec;
}

export interface IAK_MultistepPart extends IAK_ExpressionPart {
  symbol?: string;
  description?: string;
  alternativeTasks?: IAK_Task[];
}

export interface IAK_SelectionPart {
  options: Array<{
    content: string;
    correct: boolean;
  }>;
  shuffle: boolean;
  multipleSelect: boolean;
}

export interface IAK_Blank {
  id: string;
  size: AK_FieldSize;
  type: AK_BlankType;
  input: IAK_ExpressionPart | IAK_SelectionPart;
}

export interface IAK_Cell {
  type: AK_CellType;
  row: number;
  col: number;
  isHeader: boolean;
  content?: string;
  value?: string;
  spec?: IAK_ExpressionPart;
}

export interface AK_AccuracyPreSpec {
  type: AK_AccuracyType;
  nr: number;
  keepDecimalZeros?: boolean;
}

// ============================================================================
// Tasks (discriminated union on `type`)
// ============================================================================

export interface IAK_TaskSimplify {
  type: 'SIMPLIFY';
  expression: string;
}

export interface IAK_TaskSolve {
  type: 'SOLVE';
  expression: string;
  variable: string;
  domain?: string;
}

export interface IAK_TaskSolveSystem {
  type: 'SOLVE_SYSTEM';
  expression: string;
  variables: string[];
  domain?: string;
  restrictVariable?: string;
  method?: 'Eliminate' | 'Substitute' | 'Equate';
}

export interface IAK_TaskExpand {
  type: 'EXPAND';
  expression: string;
}

export interface IAK_TaskFactor {
  type: 'FACTOR';
  expression: string;
}

export interface IAK_TaskTogether {
  type: 'TOGETHER';
  expression: string;
}

export interface IAK_TaskCompleteSquare {
  type: 'COMPLETE_SQUARE';
  variable: string;
  expression: string;
}

export interface IAK_TaskPolynomialStandardForm {
  type: 'POLYNOMIAL_STANDARD_FORM';
  expression: string;
  variable: string;
}

export interface IAK_TaskPowerStandardForm {
  type: 'POWER_STANDARD_FORM';
  expression: string;
  variable: string;
}

export interface IAK_TaskExponentialStandardForm {
  type: 'EXPONENTIAL_STANDARD_FORM';
  expression: string;
  variable: string;
}

export interface IAK_TaskCartesianToPolarForm {
  type: 'CARTESIAN_TO_POLAR_FORM';
  expression: string;
}

export interface IAK_TaskPolarToCartesianForm {
  type: 'POLAR_TO_CARTESIAN_FORM';
  expression: string;
}

export type IAK_Task =
  | IAK_TaskSimplify
  | IAK_TaskSolve
  | IAK_TaskSolveSystem
  | IAK_TaskExpand
  | IAK_TaskFactor
  | IAK_TaskTogether
  | IAK_TaskCompleteSquare
  | IAK_TaskPolynomialStandardForm
  | IAK_TaskPowerStandardForm
  | IAK_TaskExponentialStandardForm
  | IAK_TaskCartesianToPolarForm
  | IAK_TaskPolarToCartesianForm;
