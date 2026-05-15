import { config } from "@/config";

export interface Variant {
  name: string;
  weight: number;
  config: any;
}

export const experimentData: Record<string, Variant[]> = {
  COLOR_EXPERIMENT: [
    {
      name: "Group_A",
      weight: config.experiment.COLOR_EXPERIMENT.weights.Group_A,
      config: { buttonColor: "blue", showBanner: false },
    },
    {
      name: "Group_B",
      weight: config.experiment.COLOR_EXPERIMENT.weights.Group_B,
      config: { buttonColor: "green", showBanner: true },
    },
    {
      name: "Group_C",
      weight: config.experiment.COLOR_EXPERIMENT.weights.Group_C,
      config: { buttonColor: "red", showBanner: true },
    },
  ],
  // Multiple experiments can be added here in the future
};
