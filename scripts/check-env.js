echo '
console.log("Checking environment variables:");
console.log("PINECONE_API_KEY:", process.env.PINECONE_API_KEY ? "✓" : "✗");
console.log("PINECONE_ENVIRONMENT:", process.env.PINECONE_ENVIRONMENT ? "✓" : "✗");
console.log("PINECONE_INDEX_NAME:", process.env.PINECONE_INDEX_NAME ? "✓" : "✗");
console.log("ANTHROPIC_API_KEY:", process.env.ANTHROPIC_API_KEY ? "✓" : "✗");
'
