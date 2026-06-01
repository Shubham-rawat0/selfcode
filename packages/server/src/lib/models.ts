import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { findSupportedChatModel, type SupportedChatModel, type SupportedChatModelId, type SupportedProvider } from "@selfcode/shared";
import type {LanguageModel} from "ai"

type AnthropicModelId = Extract<SupportedChatModel,{provider:"anthropic"}>["id"]

type OpenaiModelId = Extract<SupportedChatModel,{provider:"openai"}>["id"]

type GeminiModelId = Extract<SupportedChatModel,{provider:"google"}>["id"]

export type ResolveModel={
    model:LanguageModel;
    provider:SupportedProvider;
    modelId:SupportedChatModelId
}


function assertUnsupportedProvider(provider:never):never{
    throw new Error(`Unsupported provider: ${provider}`)
}

function resolveAnthropicModel(modelId:AnthropicModelId):ResolveModel{
    return {
        model:anthropic(modelId),
        provider:"anthropic",
        modelId
    }
}

function resolveOpenaiModel(modelId:OpenaiModelId):ResolveModel{
    return {
        model:openai(modelId),
        provider:"openai",
        modelId
    }
}

function resolveGeminiModel(modelId:GeminiModelId):ResolveModel{
    return {
        model:google(modelId),
        provider:"google",
        modelId
    }
}

function resolveSupportedChatModel(model:SupportedChatModel):ResolveModel{
    const provider = model.provider

    switch(provider){
        case "anthropic":
            return resolveAnthropicModel(model.id)
        case "google":
            return resolveGeminiModel(model.id)
        case "openai":
            return resolveOpenaiModel(model.id)
        default:
            return assertUnsupportedProvider(provider)
    }
}


export function isSupportedChatModel(modelId:string):modelId is SupportedChatModelId{
    return findSupportedChatModel(modelId)!=null
}

export function resolveChatModel(modelId:string):ResolveModel{
    const model = findSupportedChatModel(modelId)
    if(!model){
        throw new Error(`Unsupported model: ${modelId}`)
    } 

    return resolveSupportedChatModel(model)
}