import { Asset } from "./Asset";
import { AssetTarget, Target } from "./Target";

export type Portfolio = {
    assets: Asset[]
    targets: Target[]
    assetTargets: AssetTarget[]
}
