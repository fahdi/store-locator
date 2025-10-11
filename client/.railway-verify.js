// Railway deployment verification
console.log('✅ Railway deployment verification:')
console.log('- Node.js version:', process.version)
console.log('- Platform:', process.platform)
console.log('- Architecture:', process.arch)
console.log('- Working directory:', process.cwd())
console.log('- Environment:', process.env.NODE_ENV || 'development')

// Check if required files exist
const fs = require('fs')
const path = require('path')

const requiredFiles = [
  'server/index.js',
  'client/dist/index.html',
  'server/data/malls.json'
]

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file))
  console.log(`${exists ? '✅' : '❌'} ${file}: ${exists ? 'exists' : 'missing'}`)
})

console.log('🚀 Verification complete!')