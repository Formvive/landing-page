export type QuestionField = {
    id: string;
    label: string;
    type: "input" | "textarea" | "radio";
    name: string;
    options?: string[];
    value?: string;
  };