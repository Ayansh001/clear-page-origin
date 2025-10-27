
interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isValid?: boolean;
}

const FormActions = ({ onCancel, onSubmit, isValid = true }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 mt-4">
      <button
        onClick={onCancel}
        className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onSubmit}
        disabled={!isValid}
        className={`px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors ${
          !isValid ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Add Food
      </button>
    </div>
  );
};

export default FormActions;
