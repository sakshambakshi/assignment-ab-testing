import crypto from "crypto";
import { Variant, experimentData } from "@/data/experimentData";

export class ExperimentService {
  public assignVariant(userId: number, experimentName: string): Variant {
    const variants = experimentData[experimentName];
    //add hashing logic here
    return variants[0];
  }
}
