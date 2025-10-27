
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import { Sparkle } from 'lucide-react';

const Index = () => {
  const [quote, setQuote] = useState("");
  
  // Add page entrance animation
  useEffect(() => {
    document.body.classList.add('animate-fade-in');
    
    const quotes = [
      "The only bad workout is the one that didn't happen.",
      "Fitness is not about being better than someone else. It's about being better than you used to be.",
      "Take care of your body. It's the only place you have to live.",
      "The hardest lift of all is lifting your butt off the couch.",
      "Your body can stand almost anything. It's your mind that you have to convince.",
      "Success starts with self-discipline.",
      "Your health is an investment, not an expense.",
      "Don't stop when you're tired. Stop when you're done.",
      "The pain you feel today will be the strength you feel tomorrow.",
      "Small daily improvements are the key to long-term success."
    ];
    
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    
    return () => {
      document.body.classList.remove('animate-fade-in');
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {quote && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="bg-primary/10 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
              <Sparkle size={20} className="text-primary mt-1" />
              <p className="italic text-foreground">"{quote}"</p>
            </div>
          </div>
        )}
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
