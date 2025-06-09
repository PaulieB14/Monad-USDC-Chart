#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Function to recursively get all .tsx and .ts files
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    })
  );
  return files
    .flat()
    .filter(
      (file) => 
        (file.endsWith('.tsx') || file.endsWith('.ts')) && 
        !file.includes('node_modules') &&
        !file.includes('update-styled-components.js')
    );
}

// List of props that need to be prefixed with $
const propsToPrefix = [
  'size', 'color', 'variant', 'direction', 'justify', 'align', 'gap', 
  'wrap', 'columns', 'active', 'wrap', 'height', 'width'
];

// Function to update a file
async function updateFile(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    let modified = false;

    // 1. Update styled component type definitions
    const typeDefRegex = /styled\.[a-z]+<\{\s*([a-zA-Z]+)(\??:)/g;
    content = content.replace(typeDefRegex, (match, prop) => {
      if (propsToPrefix.includes(prop) && !match.includes(`$${prop}:`)) {
        modified = true;
        return match.replace(`${prop}:`, `$${prop}:`);
      }
      return match;
    });

    // 2. Update styled component type definitions with styled()
    const styledCompRegex = /styled\([^)]+\)<\{\s*([a-zA-Z]+)(\??:)/g;
    content = content.replace(styledCompRegex, (match, prop) => {
      if (propsToPrefix.includes(prop) && !match.includes(`$${prop}:`)) {
        modified = true;
        return match.replace(`${prop}:`, `$${prop}:`);
      }
      return match;
    });

    // 3. Update styled component usage in template literals
    const templateLiteralRegex = /\$\{[^}]*\(\{\s*([a-zA-Z]+)\s*\}[^}]*\}/g;
    content = content.replace(templateLiteralRegex, (match, prop) => {
      if (propsToPrefix.includes(prop) && !match.includes(`$${prop}`)) {
        modified = true;
        return match.replace(`{${prop}}`, `{$${prop}}`);
      }
      return match;
    });

    // 4. Update component props in JSX
    for (const prop of propsToPrefix) {
      const jsxPropRegex = new RegExp(`<([A-Za-z0-9]+)([^>]*)\\s${prop}=([^>]*)>`, 'g');
      content = content.replace(jsxPropRegex, (match, component, beforeProp, afterProp) => {
        // Skip if it already has $ prefix
        if (match.includes(`$${prop}=`)) {
          return match;
        }
        modified = true;
        return `<${component}${beforeProp} $${prop}=${afterProp}>`;
      });
    }

    // 5. Update destructured props in styled component template literals
    for (const prop of propsToPrefix) {
      const destructuredPropRegex = new RegExp(`\\$\\{\\(\\{\\s*${prop}\\s*\\}\\)\\s*=>`, 'g');
      content = content.replace(destructuredPropRegex, (match) => {
        if (!match.includes(`$${prop}`)) {
          modified = true;
          return match.replace(`{${prop}}`, `{$${prop}}`);
        }
        return match;
      });
    }

    // 6. Update more complex template literal patterns
    for (const prop of propsToPrefix) {
      // Match patterns like: ${({ active }) => active ? ... }
      const complexTemplateRegex = new RegExp(`\\$\\{\\(\\{\\s*${prop}\\s*\\}\\)\\s*=>\\s*${prop}\\s*\\?`, 'g');
      content = content.replace(complexTemplateRegex, (match) => {
        if (!match.includes(`$${prop}`)) {
          modified = true;
          return match.replace(new RegExp(`\\{\\s*${prop}\\s*\\}`, 'g'), `{$${prop}}`)
                      .replace(new RegExp(`=>\\s*${prop}\\s*\\?`, 'g'), `=> $${prop} ?`);
        }
        return match;
      });
    }

    if (modified) {
      await writeFile(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  try {
    const srcDir = path.resolve(__dirname, 'src');
    const files = await getFiles(srcDir);
    
    console.log(`Found ${files.length} files to process`);
    
    let updatedCount = 0;
    
    for (const file of files) {
      const updated = await updateFile(file);
      if (updated) {
        updatedCount++;
      }
    }
    
    console.log(`Updated ${updatedCount} files`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
