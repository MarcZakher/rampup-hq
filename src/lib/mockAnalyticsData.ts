const STORAGE_KEY = 'manager_dashboard_sales_reps';

interface SalesRep {
  id: number;
  name: string;
  month1: number[];
  month2: number[];
  month3: number[];
}

export const getAreasOfFocus = () => {
  const savedReps = localStorage.getItem(STORAGE_KEY);
  const salesReps: SalesRep[] = savedReps ? JSON.parse(savedReps) : [];

  const assessments = {
    month1: [
      'Discovery meeting roleplay pitch',
      'SA program',
      'Shadow capture',
      'Deliver 3 Proof points',
      'Account Tiering'
    ],
    month2: [
      'PG plan',
      'SA program',
      'NBM Role play',
      '1st meeting excellence deck',
      'Pitch/Trap setting questions',
      'Account plan 1'
    ],
    month3: [
      'COM Review',
      'SA program',
      'Champion plan',
      'Deal review',
      'TFW prep and execution',
      'Pitch PS'
    ]
  };

  const concerningReps = salesReps.map(rep => {
    const allScores = [...rep.month1, ...rep.month2, ...rep.month3];
    const lowScores = allScores.filter(score => score > 0 && score < 3);
    
    if (lowScores.length === 0) return null;

    const lowScoreAreas = [];
    rep.month1.forEach((score, index) => {
      if (score > 0 && score < 3) {
        lowScoreAreas.push({
          assessment: assessments.month1[index],
          score,
          month: 'Month 1'
        });
      }
    });

    rep.month2.forEach((score, index) => {
      if (score > 0 && score < 3) {
        lowScoreAreas.push({
          assessment: assessments.month2[index],
          score,
          month: 'Month 2'
        });
      }
    });

    rep.month3.forEach((score, index) => {
      if (score > 0 && score < 3) {
        lowScoreAreas.push({
          assessment: assessments.month3[index],
          score,
          month: 'Month 3'
        });
      }
    });

    return {
      name: rep.name,
      lowScoreCount: lowScores.length,
      averageLowScore: Number((lowScores.reduce((a, b) => a + b, 0) / lowScores.length).toFixed(1)),
      areas: lowScoreAreas
    };
  }).filter(Boolean);

  // Group similar assessments to identify patterns
  const assessmentPatterns = concerningReps.flatMap(rep => rep?.areas || [])
    .reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.assessment] = (acc[curr.assessment] || 0) + 1;
      return acc;
    }, {});

  return {
    repsNeedingAttention: concerningReps,
    commonChallenges: Object.entries(assessmentPatterns)
      .sort(([, a], [, b]) => b - a)
      .map(([assessment, count]) => ({
        assessment,
        count
      }))
  };
};

const calculateAverage = (scores: number[]) => {
  const validScores = scores.filter(score => score > 0);
  return validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
};

export const getMonthlyScores = () => {
  const savedReps = localStorage.getItem(STORAGE_KEY);
  const salesReps: SalesRep[] = savedReps ? JSON.parse(savedReps) : [];

  return [
    {
      month: 'Month 1',
      avgScore: Number(salesReps.reduce((acc, rep) => acc + calculateAverage(rep.month1), 0) / salesReps.length).toFixed(1),
      totalReps: salesReps.length,
      improving: salesReps.filter(rep => calculateAverage(rep.month1) > 3).length,
      declining: salesReps.filter(rep => calculateAverage(rep.month1) <= 3).length
    },
    {
      month: 'Month 2',
      avgScore: Number(salesReps.reduce((acc, rep) => acc + calculateAverage(rep.month2), 0) / salesReps.length).toFixed(1),
      totalReps: salesReps.length,
      improving: salesReps.filter(rep => calculateAverage(rep.month2) > 3).length,
      declining: salesReps.filter(rep => calculateAverage(rep.month2) <= 3).length
    },
    {
      month: 'Month 3',
      avgScore: Number(salesReps.reduce((acc, rep) => acc + calculateAverage(rep.month3), 0) / salesReps.length).toFixed(1),
      totalReps: salesReps.length,
      improving: salesReps.filter(rep => calculateAverage(rep.month3) > 3).length,
      declining: salesReps.filter(rep => calculateAverage(rep.month3) <= 3).length
    }
  ];
};

export const getAssessmentData = () => {
  const savedReps = localStorage.getItem(STORAGE_KEY);
  const salesReps: SalesRep[] = savedReps ? JSON.parse(savedReps) : [];
  const assessments = {
    month1: [
      'Discovery meeting roleplay pitch',
      'SA program',
      'Shadow capture',
      'Deliver 3 Proof points',
      'Account Tiering'
    ],
    month2: [
      'PG plan',
      'SA program',
      'NBM Role play',
      '1st meeting excellence deck',
      'Pitch/Trap setting questions',
      'Account plan 1'
    ],
    month3: [
      'COM Review',
      'SA program',
      'Champion plan',
      'Deal review',
      'TFW prep and execution',
      'Pitch PS'
    ]
  };

  const getAssessmentStats = (monthKey: 'month1' | 'month2' | 'month3', index: number) => {
    const scores = salesReps.map(rep => rep[monthKey][index]).filter(score => score > 0);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const successRate = (scores.filter(score => score >= 3).length / scores.length) * 100;
    return { avgScore, successRate };
  };

  return [
    ...assessments.month1.map((name, index) => {
      const stats = getAssessmentStats('month1', index);
      return {
        name,
        successRate: Math.round(stats.successRate),
        avgScore: Number(stats.avgScore.toFixed(1)),
        difficulty: stats.avgScore < 3 ? 'High' : stats.avgScore < 4 ? 'Medium' : 'Low'
      };
    }),
    ...assessments.month2.map((name, index) => {
      const stats = getAssessmentStats('month2', index);
      return {
        name,
        successRate: Math.round(stats.successRate),
        avgScore: Number(stats.avgScore.toFixed(1)),
        difficulty: stats.avgScore < 3 ? 'High' : stats.avgScore < 4 ? 'Medium' : 'Low'
      };
    }),
    ...assessments.month3.map((name, index) => {
      const stats = getAssessmentStats('month3', index);
      return {
        name,
        successRate: Math.round(stats.successRate),
        avgScore: Number(stats.avgScore.toFixed(1)),
        difficulty: stats.avgScore < 3 ? 'High' : stats.avgScore < 4 ? 'Medium' : 'Low'
      };
    })
  ];
};

export const getRepPerformance = () => {
  const savedReps = localStorage.getItem(STORAGE_KEY);
  const salesReps: SalesRep[] = savedReps ? JSON.parse(savedReps) : [];

  return salesReps.map(rep => {
    const month1Avg = calculateAverage(rep.month1);
    const month2Avg = calculateAverage(rep.month2);
    const month3Avg = calculateAverage(rep.month3);
    const scores = [month1Avg, month2Avg, month3Avg].filter(score => score > 0);
    const overallScore = calculateAverage(scores);
    
    const improvement = scores.length >= 2 ? 
      scores[scores.length - 1] - scores[scores.length - 2] : 0;

    const consistency = scores.length > 0 ? 
      1 - (Math.max(...scores) - Math.min(...scores)) / 5 : 0;

    return {
      name: rep.name,
      overallScore: Number(overallScore.toFixed(1)),
      improvement: Number(improvement.toFixed(1)),
      consistency: Number(consistency.toFixed(2))
    };
  });
};

export const getScoreDistribution = () => {
  const savedReps = localStorage.getItem(STORAGE_KEY);
  const salesReps: SalesRep[] = savedReps ? JSON.parse(savedReps) : [];

  const ranges = [
    { range: '4.5-5.0', min: 4.5, max: 5.0 },
    { range: '4.0-4.4', min: 4.0, max: 4.4 },
    { range: '3.5-3.9', min: 3.5, max: 3.9 },
    { range: '3.0-3.4', min: 3.0, max: 3.4 },
    { range: '0.0-2.9', min: 0, max: 2.9 }
  ];

  return ranges.map(({ range, min, max }) => {
    const count = salesReps.filter(rep => {
      const avgScore = calculateAverage([
        ...rep.month1,
        ...rep.month2,
        ...rep.month3
      ]);
      return avgScore >= min && avgScore <= max;
    }).length;

    return { range, count };
  });
};

export const getTeamProgress = () => {
  const savedReps = localStorage.getItem(STORAGE_KEY);
  const salesReps: SalesRep[] = savedReps ? JSON.parse(savedReps) : [];

  const totalScores = salesReps.flatMap(rep => [
    ...rep.month1,
    ...rep.month2,
    ...rep.month3
  ]).filter(score => score > 0);

  const meetingTarget = totalScores.length > 0 ?
    Math.round((totalScores.filter(score => score >= 3).length / totalScores.length) * 100) : 0;

  const completionRate = salesReps.length > 0 ?
    Math.round((totalScores.length / (salesReps.length * (5 + 6 + 6))) * 100) : 0;

  const monthlyAverages = salesReps.map(rep => [
    calculateAverage(rep.month1),
    calculateAverage(rep.month2),
    calculateAverage(rep.month3)
  ].filter(avg => avg > 0));

  const averageImprovement = monthlyAverages.reduce((sum, reps) => {
    if (reps.length >= 2) {
      return sum + (reps[reps.length - 1] - reps[reps.length - 2]);
    }
    return sum;
  }, 0) / salesReps.length;

  return {
    meetingTarget,
    completionRate,
    averageImprovement: Number(averageImprovement.toFixed(1))
  };
};
