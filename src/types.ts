export type QuestionField = {
    id: string;
    text: string;
    type: "input" | "textarea" | "radio";
    name: string;
    options?: string[];
    value?: string;
  };
export interface GetFormsRequestQuery {
    userId?: string;
}

export interface FormResponse {
    id: string;
    userId: string;
    formName: string;
    createdAt: string;
    updatedAt: string;
    responses: QuestionField[];
    responseCount: number;
}

export interface GetFormsResponseBody {
    status: "ok";
    data: {
      id: string;
      formName: string;
      responseCount?: number;
      responses?: {
        id: string;
        formId: string;
        manuallyFilled: boolean;
        aiFilled: boolean;
        location?: string;
        age?: string;
        createdAt?: string;
      }[];
    }[];
}

// --- Get Responses ---
export interface GetResponsesRequestQuery {
    formId?: string;
    userId?: string;
}

export interface Answer {
  id: string;
  responseId: string;
  questionId: string;
  value: string;
}

export interface ResponseItem {
  id: string;
  userId: string;
  formId: string;
  manuallyFilled: boolean;
  aiFilled: boolean;
  location: string;
  age: string;
  respondent?: string;
  date?: string;
  mode?: string;
  progress?: "Completed" | "Pending" | string;
  createdAt: string;
  updatedAt: string;
  answers?: Answer[]; // ✅ Add this so SummaryTab compiles
}

export interface GetResponsesResponseBody {
    status: "ok";
    total: number;
    data: ResponseItem[];
}

export interface Draft {
    title: string;
    mode: string;
    questions: number;
    lastEdited: string;
};

export interface LiveForm {
    title: string;
    publishedAgo: string;
    mode: string;
    responses: number;
    status: string;
    previewUrl: string;
  };

export interface Form {
    id: string;
    formName: string;
    updatedAt: string;
    createdAt: string;
    responseCount: number;
    responses: ResponseItem[];
  }

  export interface Question {
    id: string;
    text: string;
    type: "MULTIPLE_CHOICE" | "OPEN_ENDED"; // map backend enums
    options: { id: string; questionId: string; option: string; value: string }[];
  };

  export interface ResponseData {
    id: string;
    userId: string;
    formName: string;
    createdAt: string;
    updatedAt: string;
    responses: ResponseItem[];
  };
  export interface FormDetails {
    formName: string;
    id: string;
    questions: Question[];
    responses: ResponseItem[]; // <-- switch here
  }

  export interface GetSingularFormResponse {
    data: FormDetails;
  }
  
  export interface GetQuestionsResponse {
    data: Question[];
  }
  
  export interface GetAnswersResponse {
    data: Answer[];
  }