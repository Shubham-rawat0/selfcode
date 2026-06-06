export type ModelPricing = {
  inputInrPerMillionTokens: number;
  outputInrPerMillionTokens: number;
};

export type SupportedProvider = "anthropic" | "openai" | "google";

type SupportedChatModelDefinition = {
  id: string;
  provider: SupportedProvider;
  pricing: ModelPricing;
};

export const SUPPORTED_CHAT_MODELS = [
  {
    id: "claude-sonnet-4-6",
    provider: "anthropic",
    pricing: {
      inputInrPerMillionTokens: 3,
      outputInrPerMillionTokens: 15,
    },
  },
  {
    id: "claude-haiku-4-5",
    provider: "anthropic",
    pricing: {
      inputInrPerMillionTokens: 100,
      outputInrPerMillionTokens: 500,
    },
  },
  {
    id: "claude-opus-4-6",
    provider: "anthropic",
    pricing: {
      inputInrPerMillionTokens: 500,
      outputInrPerMillionTokens: 2500,
    },
  },
  {
    id: "gpt-5.4",
    provider: "openai",
    pricing: {
      inputInrPerMillionTokens: 250,
      outputInrPerMillionTokens: 1500,
    },
  },
  {
    id: "gpt-5.4-mini",
    provider: "openai",
    pricing: {
      inputInrPerMillionTokens: 75,
      outputInrPerMillionTokens: 450,
    },
  },
  {
    id: "gpt-5.4-nano",
    provider: "openai",
    pricing: {
      inputInrPerMillionTokens: 20,
      outputInrPerMillionTokens: 125,
    },
  },
  {
    id: "gemini-2.5-flash",
    provider: "google",
    pricing: {
      inputInrPerMillionTokens: 20,
      outputInrPerMillionTokens: 125,
    },
  },
] as const satisfies readonly SupportedChatModelDefinition[];

export type SupportedChatModel = (typeof SUPPORTED_CHAT_MODELS)[number]

export type SupportedChatModelId = SupportedChatModel["id"]

export function findSupportedChatModel(modelId:string){
    return SUPPORTED_CHAT_MODELS.find((model)=>model.id === modelId)
}

export const DEFAULT_CHAT_MODEL_ID:SupportedChatModelId="gemini-2.5-flash"