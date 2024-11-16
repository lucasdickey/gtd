// lib/fileUtils.ts
import { promises as fs } from 'fs'
import path from 'path'

export async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export async function getFileStats(filePath: string) {
  try {
    return await fs.stat(filePath)
  } catch (error) {
    console.error(`Error getting file stats for ${filePath}:`, error)
    throw error
  }
}

export async function readFileContents(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8')
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    throw error
  }
}

export async function writeFileContents(
  filePath: string,
  content: string
): Promise<void> {
  try {
    // Ensure the directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, content, 'utf-8')
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error)
    throw error
  }
}

// If you need to work with temporary files
export async function createTempFile(
  prefix: string,
  content: string
): Promise<string> {
  const tempDir = path.join(process.cwd(), 'temp')
  const timestamp = Date.now()
  const tempFile = path.join(tempDir, `${prefix}-${timestamp}.tmp`)

  await writeFileContents(tempFile, content)
  return tempFile
}

// Clean up temporary files
export async function cleanupTempFiles(olderThanHours = 24): Promise<void> {
  const tempDir = path.join(process.cwd(), 'temp')
  try {
    const files = await fs.readdir(tempDir)
    const now = Date.now()

    for (const file of files) {
      const filePath = path.join(tempDir, file)
      const stats = await fs.stat(filePath)

      const ageInHours = (now - stats.mtime.getTime()) / (1000 * 60 * 60)
      if (ageInHours > olderThanHours) {
        await fs.unlink(filePath)
      }
    }
  } catch (error) {
    console.error('Error cleaning up temp files:', error)
    // Don't throw, just log the error
  }
}
