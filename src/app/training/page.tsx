import MainLayout from '@/components/main-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { trainingData } from '@/lib/data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Video, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function TrainingPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">Training Hub</h1>
          <p className="text-muted-foreground">
            Resources to help you succeed and grow your network.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingData.map((item) => {
            const placeholder = PlaceHolderImages.find(p => p.id === item.image.id);
            return (
              <Card key={item.id} className="overflow-hidden flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    {placeholder && (
                        <Image
                            src={placeholder.imageUrl}
                            alt={placeholder.description}
                            fill
                            className="object-cover"
                            data-ai-hint={placeholder.imageHint}
                        />
                    )}
                    <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="capitalize flex items-center gap-1.5">
                            {item.type === 'video' ? <Video className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                            {item.type}
                        </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-1">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="#">
                                    {item.type === 'video' ? 'Watch Now' : 'Read Guide'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Access the training material</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
