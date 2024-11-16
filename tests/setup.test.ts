import { initializeServices } from '../lib/initialize'

async function testSetup() {
  try {
    // Initialize services
    const services = await initializeServices()

    // Test project
    const testProject = {
      id: 'test-1',
      title: 'Test Project',
      description: 'This is a test project to verify setup',
      tags: ['test', 'setup'],
    }

    // Try adding a test project
    await services.embeddings.addProject(testProject)
    console.log('✅ Successfully added test project')

    // Try searching for the project
    const results =
      await services.embeddings.searchSimilarProjects('test project')
    console.log('✅ Successfully searched for projects:', results)

    // Clean up test data
    await services.embeddings.deleteProject(testProject.id)
    console.log('✅ Successfully cleaned up test project')

    console.log('🎉 All setup tests passed!')
  } catch (error) {
    console.error('❌ Setup test failed:', error)
    throw error
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testSetup().catch(console.error)
}
