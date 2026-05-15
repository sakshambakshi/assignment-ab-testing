import crypto from "crypto";
import { Variant, experimentData } from "@/data/experimentData";
import { logger } from "@/utils/logger";
import { config } from "@/config";

export class ExperimentService {
  constructor() {
    const experimentsGroups = Object.keys(experimentData);
    for(const experimentsGroup of experimentsGroups){
        const targetTotalWeight = (config.experiment as any)[experimentsGroup]?.targetTotalWeight;
        
        if (targetTotalWeight === undefined) {
            logger.error(`CRITICAL MISCONFIGURATION: Missing target total weight config for experiment ${experimentsGroup}`);
            process.exit(1);
        }

        const variants = experimentData[experimentsGroup];
        const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
        if (totalWeight !== targetTotalWeight) {
            logger.error(`CRITICAL MISCONFIGURATION: Total weight of variants for experiment ${experimentsGroup} must be exactly ${targetTotalWeight}, but got ${totalWeight}`);
            process.exit(1);
        }
    }
  }
  
  public assignVariant(
    userId: number,
    experimentName: string,
  ): Variant {
    const variants = experimentData[experimentName];
    const targetTotalWeight = (config.experiment as any)[experimentName]?.targetTotalWeight || 100;

    const hashStr = `${experimentName}-${userId}`;
    const hash = crypto.createHash("md5").update(hashStr).digest("hex");
    const hashInt = parseInt(hash.substring(0, 8), 16);
    const randomVal = hashInt % targetTotalWeight;

    return this.getVariantBucket(randomVal, variants);
  }

  private getVariantBucket(randomVal: number, variants: Variant[]): Variant {
    let cumulativeWeight = 0;

    for (const variant of variants) {
      cumulativeWeight += variant.weight;
      if (randomVal < cumulativeWeight) {
        return variant;
      }
    }

    return variants[0]; // fallback
  }
}
