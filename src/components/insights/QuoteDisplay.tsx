
interface QuoteDisplayProps {
  quote: string;
}

const QuoteDisplay = ({ quote }: QuoteDisplayProps) => {
  if (!quote) return null;
  
  return (
    <div className="mt-4 p-4 bg-primary/10 rounded-lg italic">
      "{quote}"
    </div>
  );
};

export default QuoteDisplay;
