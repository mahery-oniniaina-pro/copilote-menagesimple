import type { MessageContext } from "../extract";

export type ModelRequest = {
  system: string;
  user: string;
  message: string;
  context: MessageContext;
  schema: Record<string, unknown>;
};

export type ModelResponse = { output: unknown; durationMs: number };

export type Provider = {
  id: string;
  label: string;
  generate: (request: ModelRequest) => Promise<ModelResponse>;
};
