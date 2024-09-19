export interface QuizType {
  title: string;
  description: string;
  host?: object;
  questions: Array<QuestionType>;
  uniqueLink: string;
}

interface OptionType {
  text: string;
  isCorrect: boolean;
}
export interface QuestionType {
  text: string;
  quiz: object;
  option: Array<OptionType>;
}

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
