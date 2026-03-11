import { getAgentPolicyDefinition, resolveAgentPolicy } from "@/ai/agents"
import { getModelDefinition } from "@/ai/models"
import { describe, expect, test } from "bun:test"

describe("agent policies", () => {
    test("keeps discord chat policy mapped to the default platform model", () => {
        expect(getAgentPolicyDefinition("discord-chat-default")).toEqual({
            id: "discord-chat-default",
            primaryModel: "claude_haiku_4_5",
            fallbackModels: [],
        })
    })

    test("adds provider middleware for anthropic-backed policies", () => {
        const policy = resolveAgentPolicy("discord-chat-default")

        expect(policy.primaryModel).toEqual(
            getModelDefinition("claude_haiku_4_5")
        )
        expect(policy.fallbackModels).toEqual([])
        expect(policy.middleware).toHaveLength(1)
    })

    test("allows future tenant overrides without changing workflow code", () => {
        const override = {
            ...getModelDefinition("gpt_5_mini"),
            source: "tenant-gateway" as const,
        }

        const policy = resolveAgentPolicy("discord-chat-default", {
            modelOverrides: {
                claude_haiku_4_5: override,
            },
        })

        expect(policy.primaryModel).toEqual(override)
        expect(policy.middleware).toHaveLength(0)
    })
})
