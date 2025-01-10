import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, CheckCircle2, BookOpen, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrainingModule {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: "completed" | "in-progress" | "not-started";
  duration: string;
  platform?: string;
}

const trainingModules: Record<string, TrainingModule[]> = {
  month1: [
    {
      id: 1,
      title: "Bootcamp Pre-Work",
      description: "Understanding of MongoDB, our Products, and Sales Process & Motions - and pass MSAT entrance exam as prerequisite to attending Bootcamp in Month 2",
      progress: 0,
      status: "not-started",
      duration: "4 weeks",
      platform: "MindTickle"
    },
    {
      id: 2,
      title: "Condensed Pitch Training",
      description: "Record your version of the condensed pitch, be able to discuss with your RD the challenges we help our customers with and how. Be audible ready on pitch.",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "MindTickle"
    },
    {
      id: 3,
      title: "High Propensity Migrate Playbook - Competitor 101",
      description: "Ability to identify Migrate and Replace (CosmosDB / DocumentDB) plays",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "MindTickle"
    },
    {
      id: 4,
      title: "Route 2 Money Workshop",
      description: "Clear path to earnings objectives mapped out along with supporting leading indicators",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "R2M"
    },
    {
      id: 5,
      title: "Identify Proof Points",
      description: "Be audible ready to deliver 3 proof points in Month 1",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "Highspot"
    },
    {
      id: 6,
      title: "Pipeline Success Plan",
      description: "Account Tiering / Value Pyramid on 2 accounts and PRP session on those 2 accounts by end of week 2 to Build 6 spokes to start PG from Week 3",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "PSP"
    },
    {
      id: 7,
      title: "Execute on 6 Spokes",
      description: "Book a minimum of 3 meetings per week to achieve your 5 DMs booked by the end of Month 1",
      progress: 0,
      status: "not-started",
      duration: "2 weeks",
      platform: "4-4-2"
    },
    {
      id: 8,
      title: "Shadow Meetings",
      description: "Discovery capture sheet for each call shadowed to be discussed with Managed in 121 (Preference on NBM). Use Chorus if unable to shadow live meetings.",
      progress: 0,
      status: "not-started",
      duration: "4 weeks",
      platform: "AE shadow"
    }
  ],
  month2: [
    {
      id: 1,
      title: "GTM Bootcamp in Dublin",
      description: "The ability to position MongoDB, understand our products, and sales process & motions.",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "Bootcamp"
    },
    {
      id: 2,
      title: "Partner Introduction and Assessment",
      description: "Workshop with your partner contact to review your book of business through the partner lens. Identify 3 key accounts to utilise the partner team for warm intros.",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "Azure/GCP/AWS/SI Partner AE"
    },
    {
      id: 3,
      title: "Create and Launch Spokes",
      description: "Be able to book 4-5 discovery meetings per week",
      progress: 0,
      status: "not-started",
      duration: "Ongoing",
      platform: "4-4-2"
    },
    {
      id: 4,
      title: "First Meeting Excellence Workshop",
      description: "Be able to build a deck for a High Value Target Discovery meeting & Be ready to effectively run a NBM",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "RD led"
    },
    {
      id: 5,
      title: "Drive PS in Early Discovery",
      description: "Meet with your Engagement Manager, understand how to pitch PS early in discovery and be ready to deliver a PS pitch for your Month 3 assessment",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "Meet EM + recorded session"
    },
    {
      id: 6,
      title: "Shadow Deal Reviews",
      description: "Start attending deal reviews - goal is to present one by Month 3 to your team.",
      progress: 0,
      status: "not-started",
      duration: "Weekly",
      platform: "Reach out to AEs/RDs"
    },
    {
      id: 7,
      title: "SA Buddy Session",
      description: "Weekly sessions with your assigned SA buddy",
      progress: 0,
      status: "not-started",
      duration: "Weekly",
      platform: "SA Program"
    },
    {
      id: 8,
      title: "Personas Understanding Workshop",
      description: "Understand the different personas in an account, their interests, and how to engage",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "Personas Understanding"
    },
    {
      id: 9,
      title: "Industry Solution Enablement",
      description: "Watch the recordings based on your verticals on the IST calls recording bank, and organize a debrief meeting with your RD to echo-back your learnings",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "IST recording bank"
    }
  ],
  month3: [
    {
      id: 1,
      title: "Champion Building & Analysis",
      description: "Champion Analysis on first Scope+ created (with RD) to develop a documented Champion Plan which will evolve through deal.",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "Champion Plan"
    },
    {
      id: 2,
      title: "MEDDPICC Workshop",
      description: "Be comfortable using MEDDPICC to qualify an opportunity and drive activity to progress effectively. Build a Deal Deck off the back of first NBM.",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "RD & Enablement"
    },
    {
      id: 3,
      title: "Pipeline Generation Planning",
      description: "Create, review with your RD, and launch 2 new Spokes each week from your Schedule. Consistency of new PG ideas at the front end of PG planning.",
      progress: 0,
      status: "not-started",
      duration: "2 weeks",
      platform: "4-4-2"
    },
    {
      id: 4,
      title: "Technical Feasibility Workshop",
      description: "Prepare for a TFW with your Solution Architect, review with your RD, and execute your first TFW in Month 3.",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "TFW with buddy"
    },
    {
      id: 5,
      title: "Value Opportunity Planning",
      description: "Analyse opportunities and ongoing pursuits to drive incremental activity. Achieve cadence of 4 meetings realized per week.",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "VO Plan & 4-4-2"
    },
    {
      id: 6,
      title: "Forecasting Workshop",
      description: "Learn how to forecast, understand expectations, and use our forecasting tools effectively.",
      progress: 0,
      status: "not-started",
      duration: "1 week",
      platform: "RD led"
    }
  ],
  month4: [
    {
      id: 1,
      title: "Enterprise Sales Mastery",
      description: "Advanced techniques for enterprise-level sales",
      progress: 0,
      status: "not-started",
      duration: "4 hours",
      platform: "Sales Training"
    }
  ]
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-6 w-6 text-assessment-green" />;
    case "in-progress":
      return <PlayCircle className="h-6 w-6 text-blue-500" />;
    default:
      return <BookOpen className="h-6 w-6 text-gray-400" />;
  }
};

const renderModules = (modules: typeof trainingModules.month1) => (
  <div className="grid gap-6">
    {modules.map((module) => (
      <Card key={module.id} className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            <div className="flex items-center gap-3">
              {getStatusIcon(module.status)}
              {module.title}
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{module.duration}</span>
            {module.platform && (
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                {module.platform}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{module.description}</p>
          <div className="space-y-4">
            <Progress value={module.progress} className="h-2" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {module.progress}% Complete
              </span>
              <Button
                variant={module.status === "completed" ? "secondary" : "default"}
                disabled={module.status === "completed"}
              >
                {module.status === "completed" ? "Completed" : "Start Module"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function TrainingJourney() {
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Training Journey</h1>
          <p className="text-gray-600">Track your progress through the sales training program</p>
        </div>

        <Tabs defaultValue="month1" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="month1">Month 1</TabsTrigger>
            <TabsTrigger value="month2">Month 2</TabsTrigger>
            <TabsTrigger value="month3">Month 3</TabsTrigger>
            <TabsTrigger value="month4">Month 4</TabsTrigger>
          </TabsList>
          <TabsContent value="month1">
            {renderModules(trainingModules.month1)}
          </TabsContent>
          <TabsContent value="month2">
            {renderModules(trainingModules.month2)}
          </TabsContent>
          <TabsContent value="month3">
            {renderModules(trainingModules.month3)}
          </TabsContent>
          <TabsContent value="month4">
            {renderModules(trainingModules.month4)}
          </TabsContent>
        </Tabs>
      </div>
    </CustomAppLayout>
  );
}
