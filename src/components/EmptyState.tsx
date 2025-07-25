type Props = {
    message: string;
  };
  
  export default function EmptyState({ message }: Props) {
    return (
      <div className="border border-dashed border-gray-300 rounded-xl bg-gray-100 p-12 text-center text-gray-600 text-sm">
        {message}
      </div>
    );
  }