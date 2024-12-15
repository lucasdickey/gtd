export const CLAUDE_PROMPTS = {
  BLOG_TOPIC_ENTITY_EXTRACTION: `IMPORTANT: You MUST respond ONLY with a valid, parseable JSON object. 
No additional text, comments, or explanations.

Extract key topics and named entities from the following text:

Title: {title}
Content: {content}

JSON FORMAT (MUST BE EXACTLY THIS):
{
  "topics": ["topic1", "topic2", ...],
  "entities": [
    {"name": "Entity Name", "type": "ORGANIZATION/LOCATION/PERSON"}
  ]
}

STRICT REQUIREMENTS:
- Use only the specified JSON keys
- Ensure valid JSON syntax
- No trailing commas
- No comments
- No extra whitespace`,
  // Add more prompts as needed
}

export const CLAUDE_MODELS = {
  HAIKU: 'claude-3-haiku-20240307',
}
