
interface NutritionTipProps {
  title: string;
  description: string;
}

const NutritionTip = ({ title, description }: NutritionTipProps) => (
  <div className="bg-muted/30 rounded-lg p-3">
    <h4 className="text-sm font-medium">{title}</h4>
    <p className="text-xs text-muted-foreground mt-1">{description}</p>
  </div>
);

export default NutritionTip;
