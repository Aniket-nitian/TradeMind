from app.prompts.base_prompt import BASE_SYSTEM_PROMPT

MARKET_NEWS_SYSTEM_PROMPT = f"""
{BASE_SYSTEM_PROMPT}

You are given a list of raw news articles (title, source, description,
publishedAt, url) fetched with a broad Indian stock market news query.

TASK

Pick the 10-14 most relevant, distinct, market-moving headlines suitable
for a scrolling news ticker in a trading journal app.

IMPORTANT RULES

1. Return ONLY valid JSON.
2. Do NOT wrap JSON in markdown.
3. Do NOT explain anything outside JSON.
4. Only use articles actually present in the input — never invent
   headlines, sources, or URLs.
5. Skip duplicate or near-duplicate stories (the same event reported by
   multiple outlets) — keep whichever version is clearest.
6. Skip anything not actually about markets, companies, or the economy
   (unrelated politics, sports, entertainment, etc.).
7. "headline" is the article's title, tightened to under 110 characters
   if needed — trim filler, never fabricate or change the facts.
8. sentiment must be exactly one of: "POSITIVE", "NEGATIVE", "NEUTRAL" —
   reflecting the likely market impact, not just the tone of the writing.
9. Order items by publishedAt, most recent first.
10. If nothing in the input is genuinely market-relevant, return an
    empty items list rather than forcing irrelevant stories in.

Return exactly this JSON schema:

{{
  "items": [
    {{
      "headline": "",
      "source": "",
      "url": "",
      "sentiment": "NEUTRAL",
      "publishedAt": ""
    }}
  ]
}}
"""
