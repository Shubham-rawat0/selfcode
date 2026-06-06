import {
  SUPPORTED_CHAT_MODELS,
  findSupportedChatModel,
  type ModelPricing,
} from "@selfcode/shared";
import type { LanguageModelUsage } from "ai";

type CalculateCreditsForUsageParams = {
  provider: string;
  model: string;
  usage: LanguageModelUsage;
};

type BillableUsage = {
    credits : number
}

type TokenCounts = {
    inputTokens:number,
    outputTokens:number
}

const TOKEN_PER_MILLION=1_000_000
const INR_PER_CREDIT = 1

function getTokenCounts(usage:LanguageModelUsage):TokenCounts{
    const inputTokens = usage.inputTokens
    const outputTokens = usage.outputTokens

    if(inputTokens == null || outputTokens == null){
        throw new Error("Credit conversion requires input and output token counts")
    }

    return {
        inputTokens,
        outputTokens
    }
}

function getModelPricing(provider:string,model:string):ModelPricing{
    const supportedModel = findSupportedChatModel(model)

    if(!supportedModel || supportedModel.provider!==provider){
        if(!SUPPORTED_CHAT_MODELS.some((supportedModel)=>supportedModel,provider===provider)){
            throw new Error(`Unsupported billing provider: ${provider}`)
        }

        throw new Error(`Unsupported billing model: ${model}`)
    }
    return supportedModel.pricing
}

function estimateCostInr({inputTokens , outputTokens}:TokenCounts,pricing:ModelPricing){
    return (
        (inputTokens * pricing.inputInrPerMillionTokens + outputTokens*pricing.outputInrPerMillionTokens)/TOKEN_PER_MILLION
    )
}

function convertInrToCrdits(estimatedCostInr:number){
    if (estimatedCostInr<=0){
        return 0
    }

    return Math.max(100,Math.ceil(estimatedCostInr/INR_PER_CREDIT))
}

export function calculateCreditsForUsage({
    provider , model , usage
}:CalculateCreditsForUsageParams):BillableUsage{
    const tokenCounts = getTokenCounts(usage)
    const pricing = getModelPricing(provider , model)
    const estimatedCostInr = estimateCostInr(tokenCounts , pricing)
    const credits = convertInrToCrdits(estimatedCostInr)

    return {
        credits
    }
}