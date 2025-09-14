import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { downlineData } from '@/lib/data';
import { User, Users } from 'lucide-react';

type DownlineMember = {
  id: string;
  name: string;
  children?: DownlineMember[];
};

function DownlineMemberNode({ member, isLast }: { member: DownlineMember; isLast: boolean }) {
  return (
    <div className="relative pl-8">
       <div className="absolute -left-1 top-4 h-full w-px bg-border"></div>
       <div className="absolute -left-1 top-4 h-px w-4 bg-border"></div>
       {!isLast && <div className="absolute -left-1 top-4 h-full w-px bg-border"></div>}

      <div className="relative mb-4 flex items-center gap-2">
        <div className="absolute -left-[30px] top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background">
          <User className="h-4 w-4" />
        </div>
        <div className="ml-4 font-medium p-2 bg-card rounded-md border">{member.name}</div>
      </div>
      {member.children && (
        <div className="pl-4 border-l border-border ml-[2px]">
          {member.children.map((child, index) => (
            <DownlineMemberNode key={child.id} member={child} isLast={index === member.children!.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DownlineTree() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Downline Structure
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-6">
        <div className="font-sans">
            <div className="flex items-center gap-2 mb-4">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-5 w-5" />
              </div>
              <div className="font-semibold text-lg">{downlineData.name}</div>
            </div>
            {downlineData.children && (
              <div className="pl-4">
                {downlineData.children.map((child, index) => (
                   <DownlineMemberNode key={child.id} member={child} isLast={index === downlineData.children!.length - 1} />
                ))}
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
