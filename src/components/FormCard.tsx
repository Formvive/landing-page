type Form = {
    id: string;
    title: string;
    responses: number;
    createdAt: string;
  };
  
  type Props = {
    form: Form;
  };
  
  export default function FormCard({ form }: Props) {
    return (
      <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
        <h3 className="font-semibold text-lg mb-1">{form.title}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {form.responses} responses • Created on{" "}
          {new Date(form.createdAt).toLocaleDateString()}
        </p>
        <button className="text-sm text-blue-600 hover:underline">View Form</button>
      </div>
    );
  }
  