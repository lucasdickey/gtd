import { ClaudeService } from '../lib/services/claude.js'

async function testClaudeExtraction() {
  const claudeService = ClaudeService.getInstance()

  const testCases = [
    {
      title: 'The Future of AI',
      content: `Artificial Intelligence is rapidly transforming various industries. 
      Companies like OpenAI and Google are leading the way in developing advanced machine learning models. 
      San Francisco remains a hub for technological innovation in the AI space.`,
    },
    {
      title: 'Climate Change and Technology',
      content: `Climate change is one of the most pressing challenges of our time. 
      Innovative technologies developed by companies like Tesla and organizations such as the UN are working to mitigate environmental impacts. 
      Renewable energy solutions are becoming increasingly important in combating global warming.`,
    },
  ]

  for (const testCase of testCases) {
    console.log('\n--- Test Case ---')
    console.log('Title:', testCase.title)
    console.log('Content Length:', testCase.content.length)

    try {
      const result = await claudeService.extractTopicsAndEntities({
        title: testCase.title,
        content: testCase.content,
      })

      console.log('Extraction Results:')
      console.log('Topics:', result.topics)
      console.log('Entities:', result.entities)
    } catch (error) {
      console.error('Extraction Failed:', error)
    }
  }
}

// Run the test if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  testClaudeExtraction().catch(console.error)
}

export default testClaudeExtraction
