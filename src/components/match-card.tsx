
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CricketMatch } from '@/lib/api';

interface MatchCardProps {
    match: CricketMatch;
    showPrediction?: boolean;
}

export function MatchCard({ match, showPrediction }: MatchCardProps) {
    const isLive = match.status === 'Live' || match.status === 'In Progress';

    return (
        <Link href={`/match/${match.id}`} className="block transition-transform hover:scale-[1.02]">
            <Card className={`h-full border-2 ${isLive ? 'border-red-500/50' : 'border-transparent'} hover:border-primary/20 bg-card/50 backdrop-blur-sm`}>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <Badge variant={isLive ? "destructive" : "secondary"}>
                                {isLive ? 'LIVE' : format(new Date(match.startTime), 'MMM d, HH:mm')}
                            </Badge>
                            <Badge variant="outline" className="border-primary/50 text-primary">
                                {match.format}
                            </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium truncate max-w-[120px]" title={match.league}>{match.league}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center py-4">
                        <div className="text-center w-1/3">
                            <div className="font-bold text-lg mb-1">{match.homeTeam}</div>
                            <div className="text-sm font-mono text-muted-foreground">{match.homeScore}</div>
                        </div>
                        <div className="text-center w-1/3 flex flex-col items-center justify-center">
                            <div className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-1">
                                VS
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {match.matchType}
                            </div>
                        </div>
                        <div className="text-center w-1/3">
                            <div className="font-bold text-lg mb-1">{match.awayTeam}</div>
                            <div className="text-sm font-mono text-muted-foreground">{match.awayScore}</div>
                        </div>
                    </div>
                    {match.status !== 'Scheduled' && (
                        <div className="text-center text-xs text-muted-foreground mt-2 px-2 py-1 bg-secondary/50 rounded">
                            {match.status}
                        </div>
                    )}
                </CardContent>
                {showPrediction && (
                    <CardFooter className="pt-0">
                        <div className="w-full text-center text-sm text-primary font-medium">
                            Click for AI Analysis
                        </div>
                    </CardFooter>
                )}
            </Card>
        </Link>
    );
}
