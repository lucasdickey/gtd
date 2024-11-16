// lib/rag.ts
import { ChatAnthropic } from 'langchain/chat_models/anthropic'
import { PromptTemplate } from 'langchain/prompts'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { RunnableSequence } from 'langchain/schema/runnable'
import { ProjectEmbeddingsService } from './embeddings'

export class ProjectRAG {
  private model: ChatAnthropic
  private embeddingsService: ProjectEmbeddingsService

  constructor() {
    this.model = new ChatAnthropic({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
      modelName: 'claude-3-sonnet-20240229',
    })
    this.embeddingsService = new ProjectEmbeddingsService()
  }

  private createPrompt() {
    return PromptTemplate.fromTemplate(`
      You are a helpful assistant that answers questions about projects. 
      Use the following context about relevant projects to answer the question.
      If you cannot answer based on the context, say so clearly.

      Context:
      {context}

      Question: {question}

      Instructions:
      - Answer based only on the provided context
      - If context mentions specific projects, reference them by name
      - If appropriate, mention relevant tags from projects
      - Keep responses clear and concise
      - If you need more information, ask specific questions

      Answer:
    `)
  }

  async query(question: string) {
    // 1. Retrieve relevant documents from Pinecone
    const relevantDocs =
      await this.embeddingsService.searchSimilarProjects(question)

    // 2. Prepare context from documents
    const context = relevantDocs.map((doc) => doc.pageContent).join('\n\n')

    // 3. Create and execute chain
    const chain = RunnableSequence.from([
      {
        context: (input: any) => input.context,
        question: (input: any) => input.question,
      },
      this.createPrompt(),
      this.model,
      new StringOutputParser(),
    ])

    // 4. Get response
    const response = await chain.invoke({
      context,
      question,
    })

    return {
      answer: response,
      relevantProjects: relevantDocs.map((doc) => doc.metadata),
    }
  }

  async addProject(project: {
    id: string
    title: string
    description: string
    tags: string[]
  }) {
    return await this.embeddingsService.addProject(project)
  }

  async deleteProject(projectId: string) {
    await this.embeddingsService.deleteProject(projectId)
  }
}
