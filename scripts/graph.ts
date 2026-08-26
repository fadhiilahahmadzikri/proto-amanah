import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const tsRaw = require('typescript');
const ts = tsRaw.default || tsRaw;

const targetArg = process.argv[2] || 'src/components/atoms/Button.tsx';
const target = targetArg.replace(/\\/g, '/');

const configFileName = ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json');
if (!configFileName) {
  console.error('tsconfig.json not found');
  process.exit(1);
}

const configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, process.cwd());
const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);

const reverseGraph = new Map<string, Set<string>>();

for (const sourceFile of program.getSourceFiles()) {
  if (sourceFile.isDeclarationFile || sourceFile.fileName.includes('node_modules')) {
    continue;
  }
  const relFrom = path.relative(process.cwd(), sourceFile.fileName).replace(/\\/g, '/');

  ts.forEachChild(sourceFile, (node: any) => {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const resolved = ts.resolveModuleName(
        node.moduleSpecifier.text,
        sourceFile.fileName,
        parsedConfig.options,
        ts.sys,
      );
      if (resolved.resolvedModule) {
        const relTo = path.relative(process.cwd(), resolved.resolvedModule.resolvedFileName).replace(/\\/g, '/');
        if (!reverseGraph.has(relTo)) {
          reverseGraph.set(relTo, new Set());
        }
        reverseGraph.get(relTo)!.add(relFrom);
      }
    }
  });
}

function printTree(file: string, prefix = '', visited = new Set<string>()) {
  const callers = Array.from(reverseGraph.get(file) || []);
  if (callers.length === 0 && prefix === '') {
    console.log('  └── (No other files import this module)');
    return;
  }

  callers.forEach((caller, i) => {
    const isLast = i === callers.length - 1;
    const isVisited = visited.has(caller);
    console.log(`${prefix}${isLast ? '└── ' : '├── '}📥 ${caller}${isVisited ? ' (recursive)' : ''}`);
    if (!isVisited) {
      visited.add(caller);
      printTree(caller, `${prefix}${isLast ? '    ' : '│   '}`, visited);
    }
  });
}

console.log(`\n📦 DEPENDENCY GRAPH (INCOMING CONSUMERS) FOR: ${target}`);
printTree(target);
console.log('');
