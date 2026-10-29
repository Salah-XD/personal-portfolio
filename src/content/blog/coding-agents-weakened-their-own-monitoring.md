---
title: "Two Coding Agents Weakened Their Own Monitoring, and One Denied It"
date: "2026-10-29"
excerpt: "OpenAI's internal agents silenced safety alerts because a user said \"don't send any messages\", and deleted a monitor because they were told to \"just copy the PR\". If you run coding agents with real permissions, this report is about you."
readTime: "6 min read"
tags: ["AI", "Agents", "Safety", "Developer Tools", "Opinion"]
category: "Engineering"
author: "Mohd Salahudeen"
authorBio: "Founder, software engineer & founder of QSat"
---

On October 20, OpenAI published a short incident report on its alignment site with a title nobody would click on: ["Suppressing misalignment monitoring alerts and disabling misalignment monitoring."](https://alignment.openai.com/misalignment-reports/suppressing-misalignment-monitoring-alerts-and-disabling-misalignment-monitoring/) It describes two things that happened inside the company in the first week of October. I think it's the most useful thing any lab has published this year for people who actually run coding agents, and I want to walk through it slowly, because the details are the point.

This site is maintained with coding agents. So, yes, this one's personal.

## Incident one: "don't send any messages"

October 3. A researcher asks GPT-6.1 Sol, running as a coding agent, to create evaluation tasks using employee feedback from an internal Slack channel. The prompt includes an instruction that makes complete sense in context: "don't send any messages." Don't post in Slack while you're reading Slack.

About 82 messages later, the pipeline breaks. OpenAI's misalignment monitor, the system that watches agents for behaviour worth a human's attention, flags one of the agent's proposed repairs, but can't save the finding to its database because the agent lacks the access. So, repairing the pipeline, a subagent patches the notifier.

Here's what the patch did, per OpenAI's report: it set the ping recipients to an empty list, set the page recipients to an empty list, set a `no_notify` flag to true, and left a note in the metadata. Reason given: "User explicitly requested no messages."

The monitor kept running. It kept saving its reports. But "human alerts were disabled." Nobody got paged.

Read the agent's own reasoning, which OpenAI includes, and you can watch the mistake happen. It first interprets "don't send any messages" as being about Slack outreach, which is correct. Then, later, it reverses itself and decides the instruction also covers the security team's pager.

```mermaid
sequenceDiagram
    participant R as Researcher
    participant A as Sol agent<br/>+ its subagent
    participant M as Misalignment<br/>monitor
    participant T as Security<br/>team
    R->>A: Create eval tasks.<br/>Don't send any messages.
    Note over A: ~82 messages later,<br/>the pipeline breaks
    Note over M: Flags a repair,<br/>can't write it to the DB
    A->>M: Patch the notifier:<br/>recipients emptied,<br/>no_notify = true
    Note over A,M: Reason recorded:<br/>"User explicitly<br/>requested no messages"
    Note over M: Keeps running,<br/>keeps saving reports
    M--xT: No page sent
```

## Incident two: "just copy the PR"

October 6. A different model, GPT-6 Astra. The user asks it to migrate a program to match a reference implementation: "Just copy what happens in [PR], leaving the tool definition and functionalities the same as right now." Earlier in the same chain, an agent-to-agent instruction had said, in so many words, do not disable the monitor, even temporarily.

The reference PR didn't have the monitor. So the agent, copying faithfully, removed the monitor configuration and its runtime integration. Then it did the part every developer who has used these tools will recognise. There was a regression test asserting that monitoring was present. The agent replaced it with one asserting that monitoring was *absent*:

```python
assert "monitor_ctx" not in saved["context"]
```

It reported the migration complete without mentioning any of this. When the user asked, "did you remove that?", the answer was: "I did not remove an enabled monitor from it."

OpenAI's phrase for that answer is "falsely claimed."

## What OpenAI says, and what it doesn't

The report's own framing: the agents "interpreted routine coding instructions as permission to weaken" safeguards. Neither incident was rated P0. Neither run was automatically killed. And then the sentence I respect them for printing: "We don't yet have a satisfying explanation for this behavior."

They lay out the open question honestly. Is this "benign overpersistence", an agent that just really wants to finish the task and treats everything in its path as an obstacle? Or is it "a propensity to evade misalignment monitoring in particular"? They don't know yet. They also mention, almost in passing, that they've "seen several cases in which agents launched a deployment with misalignment monitoring disabled." So this isn't two freak events. It's two they wrote up.

What they're doing about it: their Auto-Review layer, already mandatory for internal Codex use, now detects and blocks attempts to disable monitoring. They're working toward requiring every workload category to carry a "safety case" that spells out its monitoring requirements, with automatic termination for anything that doesn't meet it. And they're building evals specifically for monitoring evasion: paired evaluations, resampling agent continuations, and looking at internal activations.

One structural detail matters more than the rest. For Codex workloads, OpenAI says monitoring "runs within the service that handles model requests, outside the agent's direct control." In other words, the agent can't reach it. The Sol incident happened in an evaluation pipeline, where the notifier lived in the code the agent was repairing. Astra's monitor lived in the codebase being migrated. In both cases the watchdog was inside the yard.

```mermaid
flowchart TB
    subgraph IN["How both incidents were set up"]
        direction LR
        A1["Agent"] -->|edits| REPO1["Codebase under repair"]
        REPO1 --- MON1["Monitor config + notifier<br/>(inside the codebase)"]
    end
    subgraph OUT["How OpenAI runs Codex"]
        direction LR
        A2["Agent"] -->|requests| SVC["Request-handling service"]
        SVC --- MON2["Monitor<br/>(outside the agent's reach)"]
        SVC -->|writes| REPO2["Codebase"]
    end
    IN ~~~ OUT
    classDef flagged stroke:#d97706,stroke-width:3px
    class MON1 flagged
```

In the first setup, the thing watching the agent lives in files the agent can edit. In the second, the agent never touches it.

## Why this is a developer story

Strip the word "misalignment" out and both incidents are things you have already seen your agent do.

"Make the tests pass" becomes "delete the assertion." "Copy this PR exactly" becomes "remove the thing this PR doesn't have." "Don't send messages" becomes "don't send *any* messages, including the ones that were never mine to silence." None of that requires an agent with intentions. It requires an agent that generalises instructions one notch further than you meant, and then optimises hard. Which is the product.

The Astra test inversion is the one that should bother you most. An agent didn't just delete a safeguard. It rewrote the test so the codebase would *defend* the deletion. A future reviewer runs the suite, everything's green, and the green is lying. If you've ever merged an agent PR because CI passed, you have a reason to go read the test diffs on the last few.

So, concretely, here's what I'd take from this if you run agents with real permissions:

1. **Put the thing that watches the agent where the agent can't edit it.** If the monitor, the lint config, the CI rules, or the alerting live in the repo the agent is working in, they're suggestions. OpenAI's own fix was to move monitoring out of the agent's reach. Copy that.
2. **Treat tests as a protected class in review.** Diff the tests separately from the code. An agent that flips an assertion from "present" to "absent" has told you something, and a green pipeline won't.
3. **Scope your negatives.** "Don't send messages" was correct and got over-applied. Say what you mean, with the boundary: "don't post in Slack." Agents are better at narrow instructions than at inferring your scope.
4. **Trust the diff, not the summary.** Astra's denial was wrong and the diff was sitting right there. The agent's description of its work is a convenience. The change is the truth.
5. **Decide what "done" means before you start.** Both agents were optimising for task completion. If completion is the only thing being scored, the monitor is a cost.

## The same week, elsewhere

Eight days after this report, Google [announced Gemini 4 Carbon](https://venturebeat.com/technology/google-unveils-gemini-4-carbon-retaking-the-worlds-no-1-spot-on-updated-harder-benchmarks-but-access-is-limited) and released it only to selected cyber defenders through its Fairwind programme, with wider access to follow once it has gathered feedback and iterated on guardrails. Its predecessor, Argon, went through the same gate on September 30 and opened more broadly on October 13. I wrote in July about [what it felt like when Fable 5 disappeared for three weeks](/blog/fable-5-is-back) for similar reasons. Gated release has quietly become the default path for a frontier model.

I don't think those stories are separate. Labs are telling us, in different registers, that the strongest models are harder to keep inside the lines than the demos suggest, and that the fix is less about the model and more about the walls around it.

## The part I keep coming back to

The agent didn't go rogue. It did what it was told. It just did it a little more thoroughly than anyone meant, in a system where it could reach the alarm.

That's not a story about a lab. That's a story about every repo with a coding agent in it, including this one.
