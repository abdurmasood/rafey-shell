---
name: compress
description: >-
  Compress a long answer into one sentence and at most five bullets,
  keeping only what changes what the user should do or believe. Use when
  the user says compress, asks to compress an output, or invokes /compress.
disable-model-invocation: true
argument-hint: "[text or question; omit to compress the previous reply]"
---

# Compress

The reply is short. Same shape every time.

## Source

1. Text or a question passed with the command. Answer that, in the shape below.
2. A bare `compress` or `/compress`: compress the previous assistant message.

Do not add facts that are not in the source.

## Output

Nothing before this. Nothing after it.

```
<one sentence>

- <point>
- <point>
```

- The sentence is one line. It states the outcome.
- Then 1 to 5 bullets. Never more than 5. Do not pad up to 5.
- Each bullet is one sentence.
- Most important first.
- No headings, labels, code fences, or nested bullets.

## What to keep

Keep a point only when leaving it out would change what the user does or believes: a result, a decision, a blocker, or the next action.

Drop background, process, restated questions, and caveats that do not change the action. If more than five points qualify, keep the five that most change the next action.

## Example

A long deploy writeup: dashboard notes, three log lines, a config flag, a revert, a retry that passed.

```
The deploy failed on a bad config flag, then succeeded after revert.

- `timeout_ms` was 0, so the health check never passed.
- Reverting that flag and retrying went green.
- The dashboard still shows the failed attempt.
```
