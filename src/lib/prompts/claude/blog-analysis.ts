import { TagCategory } from '../../../types/tags'

export const BLOG_TAG_ANALYSIS_PROMPT = `You are a precise tag generator for blog content. Your task is to analyze the provided blog post and generate tags that match our predefined schema.

For each tag you identify:
- name: Should be lowercase, hyphen-separated if multiple words
- description: A clear, concise explanation of the tag
- category: Must be one of: 'technical', 'topic', 'language', or 'general'
- confidence: A score between 0 and 1 indicating your confidence in this tag's relevance

Guidelines:
1. Technical tags: Programming languages, frameworks, tools, or technical concepts
2. Topic tags: Main themes or subject areas
3. Language tags: Content style (e.g., tutorial, analysis, opinion)
4. General tags: Broader categories or miscellaneous classifications

IMPORTANT: Return ONLY a valid JSON object with no additional text or explanation. The JSON must exactly match this structure:
{
  "tags": [
    {
      "name": "string",
      "description": "string",
      "category": "technical" | "topic" | "language" | "general",
      "metadata": {
        "source": "claude",
        "createdAt": number
      }
    }
  ],
  "associations": [
    {
      "tagName": "string",
      "confidence": number,
      "metadata": {
        "source": "claude",
        "createdAt": number,
        "context": "string"
      }
    }
  ]
}

Analyze the following blog post and respond with ONLY the JSON object:

[Blog Title]: {{title}}
[Blog Content]: {{content}}
`

export interface BlogTagAnalysisResponse {
  tags: Array<{
    name: string
    description: string
    category: TagCategory
    metadata: {
      source: 'claude'
      createdAt: number
    }
  }>
  associations: Array<{
    tagName: string
    confidence: number
    metadata: {
      source: 'claude'
      createdAt: number
      context: string
    }
  }>
}

// Helper to validate Claude's response matches our schema
export function validateTagAnalysisResponse(
  response: unknown
): response is BlogTagAnalysisResponse {
  try {
    // Basic structure check
    if (
      !response ||
      typeof response !== 'object' ||
      !('tags' in response) ||
      !('associations' in response) ||
      !Array.isArray(response.tags) ||
      !Array.isArray(response.associations)
    ) {
      return false
    }

    // Validate each tag
    const validCategories = ['technical', 'topic', 'language', 'general']
    for (const tag of response.tags) {
      if (
        !tag ||
        typeof tag !== 'object' ||
        !('name' in tag) ||
        typeof tag.name !== 'string' ||
        !('description' in tag) ||
        typeof tag.description !== 'string' ||
        !('category' in tag) ||
        !validCategories.includes(tag.category) ||
        !('metadata' in tag) ||
        !tag.metadata ||
        typeof tag.metadata !== 'object' ||
        !('source' in tag.metadata) ||
        tag.metadata.source !== 'claude' ||
        !('createdAt' in tag.metadata) ||
        typeof tag.metadata.createdAt !== 'number'
      ) {
        return false
      }
    }

    // Validate each association
    for (const assoc of response.associations) {
      if (
        !assoc ||
        typeof assoc !== 'object' ||
        !('tagName' in assoc) ||
        typeof assoc.tagName !== 'string' ||
        !('confidence' in assoc) ||
        typeof assoc.confidence !== 'number' ||
        assoc.confidence < 0 ||
        assoc.confidence > 1 ||
        !('metadata' in assoc) ||
        !assoc.metadata ||
        typeof assoc.metadata !== 'object' ||
        !('source' in assoc.metadata) ||
        assoc.metadata.source !== 'claude' ||
        !('createdAt' in assoc.metadata) ||
        typeof assoc.metadata.createdAt !== 'number' ||
        !('context' in assoc.metadata) ||
        typeof assoc.metadata.context !== 'string'
      ) {
        return false
      }
    }

    return true
  } catch {
    return false
  }
}
