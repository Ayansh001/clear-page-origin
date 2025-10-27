
import { Input } from '@/components/ui/input';

interface NutrientInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  min?: number;
  step?: string;
}

const NutrientInput = ({
  label,
  value,
  onChange,
  error,
  min = 0,
  step = "0.1"
}: NutrientInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    }
  };

  return (
    <div>
      <label className="text-xs font-medium block mb-1">{label}</label>
      <Input
        type="number"
        min={min}
        step={step}
        value={value || ''}
        onChange={handleChange}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default NutrientInput;
