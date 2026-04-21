import { describe, expect, mock, test } from "bun:test"

const initChatModelMock = mock(async () => ({ kind: "stubbed-model" }))
const anthropicPromptCachingMiddlewareMock = mock(() => ({
    kind: "anthropic-prompt-caching",
}))
const modelFallbackMiddlewareMock = mock((...modelRefs: string[]) => ({
    kind: "fallback",
    modelRefs,
}))

mock.module("langchain", () => ({
    anthropicPromptCachingMiddleware: anthropicPromptCachingMiddlewareMock,
    createAgent: mock(),
    initChatModel: initChatModelMock,
    modelFallbackMiddleware: modelFallbackMiddlewareMock,
}))

const { getModelDefinition } = await import("@/ai/models")
const { getAgentPolicyDefinition, getAgentPolicyIds, resolveAgentPolicy } =
    await import("@/ai/policies")

describe("policies", () => {
    test("exposes the registered policy ids", () => {
        expect(getAgentPolicyIds()).toEqual(["discord-chat-default"])
    })

    test("keeps discord chat policy mapped to the default platform model", async () => {
        expect(getAgentPolicyDefinition("discord-chat-default")).toEqual({
            id: "discord-chat-default",
            primaryModel: "claude_haiku_4_5",
            fallbackModels: [],
        })

        const policy = await resolveAgentPolicy("discord-chat-default")
        expect(policy.primaryModel).toEqual(
            getModelDefinition("claude_haiku_4_5")
        )
    })

    test("adds provider middleware for anthropic-backed policies", async () => {
        const policy = await resolveAgentPolicy("discord-chat-default")

        expect(policy.fallbackModels).toEqual([])
        expect(policy.middleware).toHaveLength(1)
    })

    test("allows future tenant overrides without changing workflow code", async () => {
        const override = {
            ...getModelDefinition("gpt_5_mini"),
            source: "tenant-gateway" as const,
        }

        const policy = await resolveAgentPolicy("discord-chat-default", {
            modelOverrides: {
                claude_haiku_4_5: override,
            },
        })

        expect(policy.primaryModel).toEqual(override)
        expect(policy.middleware).toHaveLength(0)
    })

    test("allows future model init overrides for tenant gateways", async () => {
        const policy = await resolveAgentPolicy("discord-chat-default", {
            modelInitOverrides: {
                claude_haiku_4_5: {
                    apiKey: "tenant-key",
                    baseURL: "https://tenant-gateway.example.com/v1",
                },
            },
        })

        expect(policy.primaryModel).toEqual(
            getModelDefinition("claude_haiku_4_5")
        )
        expect(policy.middleware).toHaveLength(1)
    })
})
