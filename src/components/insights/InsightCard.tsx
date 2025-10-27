
interface InsightCardProps {
  title: string;
  description: string;
  metric: string;
  value: string;
}

const InsightCard = ({ title, description, metric, value }: InsightCardProps) => (
  <div className="glass-card p-6 h-full flex flex-col">
    <h3 className="font-medium text-lg mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground flex-grow">{description}</p>
    <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-border">
      <span className="text-sm text-muted-foreground">{metric}</span>
      <span className="text-lg font-medium">{value}</span>
    </div>
  </div>
);

export default InsightCard;
