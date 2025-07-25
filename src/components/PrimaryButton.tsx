import { Plus } from "lucide-react";

type Props = {
  label: string;
  onClick: () => void;
};

export default function PrimaryButton({ label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-md hover:opacity-90 transition"
    >
      <Plus size={16} />
      {label}
    </button>
  );
}
