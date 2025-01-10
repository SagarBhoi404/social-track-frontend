import { Image, Video, BarChart2, Users } from "lucide-react";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { PerformanceGraph } from "@/components/PerformanceGraph";
import { AIInsights } from "@/components/AIInsights";
import { Contributors } from "@/components/Contributors";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import remarkGfm from 'remark-gfm';
import Markdown from "react-markdown";
import CountUp from "react-countup";
import rehypeRaw from "rehype-raw";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Download,
  Lightbulb,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Index = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPromptEntered, setIsPromptEntered] = useState(false); // Track if prompt is entered

  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!text) {
      toast({
        title: "Please enter post types",
        variant: "destructive",
      });
      return;
    }

    fetch("http://127.0.0.1:5000/engagement")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setEngagementData(data); // Store API response
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });

    setIsAnalyzing(true);
    toast({
      title: "Analysis started",
      description: "We're analyzing your social media post type",
    });

    try {
      // Send POST request with the profileUrl
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }), // sending profileUrl as 'text'
      });

      if (!response.ok) {
        throw new Error("Failed to analyze post type");
      }

      const data = await response.json();

      const message = data.outputs[0].outputs[0].artifacts.message;
      const cleanedMessage = message.replace(/\\n/g, "\n").replace(/\\t/g, "\t");

      setInsights(cleanedMessage);
      setIsPromptEntered(true); // Set to true once analysis is complete
      toast({
        title: "Analysis completed",
        description: "Your social media profile has been analyzed",
      });
    } catch (error) {
      console.error("Error analyzing post type:", error);
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
    
  };


  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-200">
      <FullScreenLoader isOpen={isAnalyzing} />
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gradient-to-b from-accent to-accent-secondary dark:from-gray-900 dark:to-gray-800 p-6 animate-fade-up relative">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary dark:from-primary-foreground dark:to-secondary-foreground">
          Welcome to Social Track
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 text-center max-w-2xl">
          Unlock the power of your social media insights with advanced analytics
          and AI-driven recommendations
        </p>
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl">
          <Input
            type="url"
            placeholder="Enter Your Prompt"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
          />
          <Button
            onClick={handleAnalyze}
            className="bg-primary hover:opacity-90 transition-all duration-300 transform hover:scale-105 dark:bg-primary dark:text-primary-foreground"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Now"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {isPromptEntered && ( // Conditionally render after prompt entry and analysis completion
        <main className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {engagementData.map((item, index) => (
              <AnalyticsCard
                key={index}
                title={`${
                  item.$vectorize.charAt(0).toUpperCase() +
                  item.$vectorize.slice(1)
                } Engagement`}
                value={
                  <CountUp
                    start={0}
                    end={item.engagement_percentage}
                    duration={1} // Duration of the animation in seconds
                    decimals={2} // Set the number of decimal places
                    suffix="%"
                  />
                }
                description={`Avg: ${item.average_engagement.toFixed(2)}`}
                icon={
                  item.$vectorize === "carousel"
                    ? Image
                    : item.$vectorize === "reels"
                    ? Video
                    : BarChart2
                }
              />
            ))}

            {/* Total Reach Card (Static) */}
            <AnalyticsCard
              title="Total Reach"
              value={
                <CountUp
                  start={0}
                  end={engagementData.reduce(
                    (sum, item) => sum + item.total_reach,
                    0
                  )}
                  duration={2} // Duration of the animation in seconds
                  separator=","
                  decimal=","
                />
              }
              description="Unique viewers across all posts"
              icon={Users}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-12">
              <PerformanceGraph />
            </div>
            <div className="lg:col-span-12">
              <Card className="animate-fade-up bg-accent">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <CardTitle>AI Insights</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Collapsible>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-white shadow-sm">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded-full text-xs"></span>
                          </div>
                          <p className="text-sm text-gray-600">
                            <Markdown remarkPlugins={[remarkGfm]}>
                              {typeof insights === "string" && insights
                                ? insights
                                : "No insights available"}
                            </Markdown>
                          </p>
                        </div>
                      </div>
                    </div>

                    <CollapsibleContent className="space-y-4"></CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </div>
          </div>

        </main>
      )}
      
      <div className="mt-0">
            <Contributors />
          </div>
    </div>
  );
};

export default Index;