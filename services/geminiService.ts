import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DashboardData } from "../types";

// Initialize the Gemini API client
// Note: process.env.API_KEY is assumed to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const dashboardSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    dailyStats: {
      type: Type.ARRAY,
      description: "Flight statistics for the last 30 days",
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
          totalFlights: { type: Type.INTEGER, description: "Total number of flights scheduled" },
          delayed: { type: Type.INTEGER, description: "Number of flights delayed" },
          cancelled: { type: Type.INTEGER, description: "Number of flights cancelled" },
          weatherCondition: { type: Type.STRING, description: "Brief weather summary (e.g., Sunny, Stormy)" },
        },
        required: ["date", "totalFlights", "delayed", "cancelled", "weatherCondition"],
      },
    },
    airlineShares: {
      type: Type.ARRAY,
      description: "Market share of top 5 airlines",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          flights: { type: Type.INTEGER },
          color: { type: Type.STRING, description: "Hex color code for the airline brand" },
        },
        required: ["name", "flights", "color"],
      },
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        totalFlightsLast30Days: { type: Type.INTEGER },
        avgOnTimePerformance: { type: Type.NUMBER, description: "Percentage 0-100" },
        totalCancellations: { type: Type.INTEGER },
        busiestDay: { type: Type.STRING, description: "Date of busiest day" },
      },
      required: ["totalFlightsLast30Days", "avgOnTimePerformance", "totalCancellations", "busiestDay"],
    },
    insights: {
      type: Type.ARRAY,
      description: "3 bullet point insights about the traffic trends",
      items: { type: Type.STRING },
    },
  },
  required: ["dailyStats", "airlineShares", "summary", "insights"],
};

export const fetchDashboardData = async (scenario: string = "standard"): Promise<DashboardData> => {
  const prompt = `
    Generate a realistic flight traffic dataset for a major international airport dashboard.
    The data should cover the last 30 days.
    Scenario Context: ${scenario}.
    Ensure the data shows realistic fluctuations (weekends vs weekdays).
    If the scenario is 'storm', show high cancellations on a few specific days.
    If 'holiday', show increased volume.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dashboardSchema,
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data received from Gemini");
    }

    return JSON.parse(text) as DashboardData;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};