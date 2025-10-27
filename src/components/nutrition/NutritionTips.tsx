
import NutritionTip from './NutritionTip';

const NutritionTips = () => {
  return (
    <div className="glass-card p-6">
      <h3 className="section-heading">Nutrition Tips</h3>
      <div className="space-y-3">
        <NutritionTip
          title="Balance your meals"
          description="Include proteins, complex carbs, and healthy fats in each meal."
        />
        <NutritionTip
          title="Eat colorful vegetables"
          description="More colors mean more nutrients and antioxidants."
        />
        <NutritionTip
          title="Stay hydrated"
          description="Water is essential for optimal metabolism and nutrient absorption."
        />
      </div>
    </div>
  );
};

export default NutritionTips;
