const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'src/components/landing/templates');

// Get all template directories
const templateDirs = fs.readdirSync(templatesDir).filter(dir => {
  const fullPath = path.join(templatesDir, dir);
  return fs.statSync(fullPath).isDirectory() && dir !== 'types';
});

console.log('Found template directories:', templateDirs);

templateDirs.forEach(templateDir => {
  const eventsFile = path.join(templatesDir, templateDir, 'components', 'Events.tsx');
  
  if (fs.existsSync(eventsFile)) {
    console.log(`Processing ${templateDir}/components/Events.tsx`);
    
    let content = fs.readFileSync(eventsFile, 'utf8');
    const lines = content.split('\n');
    let modified = false;
    
    // Find and remove standalone invitationToken lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this is a standalone invitationToken line
      if (line.trim() === 'invitationToken={invitationToken}') {
        // Remove this line
        lines.splice(i, 1);
        modified = true;
        console.log(`  ✓ Removed misplaced invitationToken line from ${templateDir}`);
        break;
      }
    }
    
    if (modified) {
      content = lines.join('\n');
      fs.writeFileSync(eventsFile, content);
    } else {
      console.log(`  ✓ No fixes needed for ${templateDir}`);
    }
  } else {
    console.log(`  ⚠ Events.tsx not found in ${templateDir}`);
  }
});

console.log('\nDone!'); 