
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, AlertTriangle } from 'lucide-react';
import { getMatchPrediction } from '@/lib/ai-agent';
import { Match } from '@/lib/api';

interface PredictionCardProps {
    match: Match;
}

export function PredictionCard({ match }: PredictionCardProps) {
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);

    const handlePredict = async () => {
        setLoading(true);
        try {
            const result = await getMatchPrediction(match);
            setPrediction(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    AI Match Analysis
                </CardTitle>
                <CardDescription>
                    Get real-time insights and predictions powered by Gemini AI.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!prediction ? (
                    <div className="text-center py-6 text-muted-foreground">
                        <Sparkles className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                        <p>Click below to generate detailed analysis.</p>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border">
                            <span className="font-semibold">Prediction:</span>
                            <Badge className="text-lg">{prediction.prediction}</Badge>
                        </div>

                        <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border">
                            <span className="font-semibold">Confidence:</span>
                            <span className={`${prediction.confidence === 'High' ? 'text-green-500' : 'text-yellow-500'} font-bold`}>
                                {prediction.confidence}
                            </span>
                        </div>

                        <div className="bg-background/50 p-4 rounded-lg border">
                            <h4 className="font-semibold mb-2">Analysis</h4>
                            <p className="text-sm leading-relaxed">{prediction.analysis}</p>
                        </div>

                        {prediction.recommended_bet && (
                            <div className="bg-accent/20 p-3 rounded-lg border border-accent">
                                <span className="font-bold text-accent-foreground">Recommended Market: </span>
                                <span>{prediction.recommended_bet}</span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handlePredict}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                >
                    {loading ? (
                        <>
                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Match Data...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Prediction
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
