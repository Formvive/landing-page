export type QuestionField = {
    id: string;
    label: string;
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
    data: FormResponse[];
}

// --- Get Responses ---
export interface GetResponsesRequestQuery {
    formId?: string;
    userId?: string;
}

export interface ResponseItem {
    id: string;
    userId: string;
    formId: string;
    manuallyFilled: boolean;
    aiFilled: boolean;
    location: string;
    age: string; // Or AgeRange if you have an enum
    createdAt: string;
    updatedAt: string;
}

export interface GetResponsesResponseBody {
    status: "ok";
    total: number;
    data: ResponseItem[];
}