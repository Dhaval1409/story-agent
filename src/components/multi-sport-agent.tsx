import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Trophy, Zap } from "lucide-react";

const predictions = [
  { sport: "Cricket", match: "IND vs AUS", score: "315-330 Runs", prob: "65%", status: "High Confidence" },
  { sport: "Football", match: "REAL vs BARCA", score: "2 - 1 Goals", prob: "52%", status: "Medium Confidence" },
  { sport: "Basketball", match: "LAKERS vs WARRIORS", score: "112 - 108 Pts", prob: "58%", status: "High Confidence" },
];

export default function MultiSportAgent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="h-6 w-6 text-primary animate-pulse" />
        <h2 className="text-xl font-bold">AI Agent: Multi-Sport Predictions</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {predictions.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-all border-t-4 border-t-primary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Badge variant="secondary">{item.sport}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {item.prob}
                </span>
              </div>
              <CardTitle className="text-lg mt-2">{item.match}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-3 text-center mb-3">
                <p className="text-[10px] uppercase text-muted-foreground font-semibold">Predicted Score</p>
                <p className="text-xl font-bold text-primary">{item.score}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground italic">{item.status}</span>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}