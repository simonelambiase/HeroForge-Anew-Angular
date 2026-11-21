export type OpenRouterRecommendation = 'advice' | 'lore' | 'general';

export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  recommendedFor: OpenRouterRecommendation;
}

export interface OpenRouterConfig {
  apiKey: string;
  selectedModel: OpenRouterModel;
}

export const OPENROUTER_MODELS: readonly OpenRouterModel[] = [
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3',
    description: 'Economico e veloce, ideale per risposte generali.',
    contextLength: 65536,
    recommendedFor: 'general',
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Ottimo per consigli di build e regole complesse.',
    contextLength: 200000,
    recommendedFor: 'advice',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Veloce ed economico per risposte generali.',
    contextLength: 128000,
    recommendedFor: 'general',
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B',
    description: 'Modello aperto e creativo, adatto alla generazione di lore.',
    contextLength: 128000,
    recommendedFor: 'lore',
  },
];

export const DEFAULT_OPENROUTER_MODEL: OpenRouterModel = OPENROUTER_MODELS[0];

export function findOpenRouterModel(id: string): OpenRouterModel {
  return OPENROUTER_MODELS.find((model) => model.id === id) ?? DEFAULT_OPENROUTER_MODEL;
}
