import MainLayout from '@/components/main-layout';
import CommissionCalculatorClient from './commission-calculator-client';

export default function CommissionCalculatorPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
           <h1 className="text-3xl font-bold tracking-tight">Commission Calculator</h1>
           <p className="text-muted-foreground">
             Simulate potential earnings with our AI-powered forecasting tool.
           </p>
        </div>
        <CommissionCalculatorClient />
      </div>
    </MainLayout>
  );
}
