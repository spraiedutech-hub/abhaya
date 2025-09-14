'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getCommissionForecast } from './actions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Rocket, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const initialState = {
  success: undefined,
  message: '',
  data: undefined,
  errors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button type="submit" disabled={pending} className="w-full sm:w-auto">
                {pending ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                    </>
                ) : (
                    <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Generate Forecast
                    </>
                )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Generate AI Commission Forecast</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
}

export default function CommissionCalculatorClient() {
  const [state, formAction] = useActionState(getCommissionForecast, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success === false && state.message && !state.errors) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>
              Describe your team structure and sales to generate a forecast.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="networkStructure">Your Business Model</Label>
              <Textarea
                id="networkStructure"
                name="networkStructure"
                placeholder="e.g., As a Supervisor, I get 30% on my direct sales and 10% from my 5 Direct Workers' sales. If a worker becomes a Supervisor, they get 20% on their sales and 10% on their team's sales."
                rows={5}
                required
              />
              {state.errors?.networkStructure && (
                <p className="text-sm text-destructive">{state.errors.networkStructure[0]}</p>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="salesVolume">Your Team's Total Sales Volume</Label>
                <Input
                  id="salesVolume"
                  name="salesVolume"
                  type="number"
                  placeholder="e.g., 50000"
                  required
                />
                 {state.errors?.salesVolume && (
                  <p className="text-sm text-destructive">{state.errors.salesVolume[0]}</p>
                 )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  name="currency"
                  placeholder="e.g., INR"
                  maxLength={3}
                  required
                />
                {state.errors?.currency && (
                  <p className="text-sm text-destructive">{state.errors.currency[0]}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <Card className="bg-muted/30">
        <CardHeader>
            <CardTitle>AI-Generated Forecast</CardTitle>
            <CardDescription>
              Your potential earnings based on the provided data.
            </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px]">
          {state.data ? (
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                        <Rocket className="h-4 w-4" /> Potential Earnings
                    </h3>
                    <p className="text-foreground/90 whitespace-pre-wrap">{state.data.potentialEarnings}</p>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Assumptions
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{state.data.assumptions}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> Disclaimer
                    </h3>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{state.data.disclaimer}</p>
                </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Your forecast will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
