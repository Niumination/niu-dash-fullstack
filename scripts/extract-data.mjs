#!/usr/bin/env node
/**
 * extract-data.mjs — Extract PROJECTS + DEV_META from Production/niu-dash/index.html
 *
 * Usage: node scripts/extract-data.mjs
 * Output: data/projects.json (compiled flat list)
 *
 * The source index.html contains embedded JS objects:
 *   const PROJECTS = { ready:[…], dev:[…], ideas:[…], config:[…], legacy:[…] }
 *   const DEV_META = { 'ProjectName': { status, history, plan, recommendations } }
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SOURCE = join(ROOT, '..', '..', 'Production', 'niu-dash', 'index.html')
const OUT_DIR = join(ROOT, 'data')
const OUT_FILE = join(OUT_DIR, 'projects.json')

// ===== Helpers =====
function extractJSObj(text, varName) {
  const re = new RegExp(`(?:const|let|var)\\s+${varName}\\s*=\\s*(\\{[\\s\\S]*?\\});\\s*//|(?:const|let|var)\\s+${varName}\\s*=\\s*(\\{[\\s\\S]*?\\});\\s*$`, 'm')
  const match = text.match(re)
  if (!match) throw new Error(`Cannot find ${varName} in source`)
  const raw = match[1] || match[2]
  // Convert JS object literal to valid JSON
  return raw
}

function jsObjToJSON(jsStr) {
  // Replace single-quoted keys/values with double quotes
  let s = jsStr
    // Replace trailing commas before } or ]
    .replace(/,(\s*[}\]])/g, '$1')
    // Comments (// ...)
    .replace(/\/\/.*$/gm, '')
    // Hex values
    // Unquoted object keys: `  key: value` → `"key": value`
    .replace(/^\s+([a-zA-Z_$][\w$]*)\s*:/gm, (_, key) => `"${key}":`)
    // Quoted keys with single quotes: `'key':` → `"key":`
    .replace(/'([^']+)'\s*:/g, '"$1":')
    // Single-quoted string values
    .replace(/:\s*'([^']*?)'/g, (match, val) => {
      // If it starts with https:// or /Volumes/ or /Users/, keep as string
      if (val.startsWith('https://') || val.startsWith('/Volumes/') || val.startsWith('/Users/')) {
        return `: "${val}"`
      }
      // Check if it's a number
      if (!isNaN(val) && val.trim() !== '') return `: ${val}`
      return `: "${val}"`
    })
    // Template literals → regular strings
    .replace(/`([^`]*)`/g, '"$1"')
    // Newlines in strings
    .replace(/\n/g, ' ')
    // Collapse multiple spaces
    .replace(/\s{2,}/g, ' ')
  return s
}

function safeEval(jsStr) {
  // For simple data objects we use Function constructor (safe here since input is local)
  try {
    return Function(`"use strict"; return (${jsStr})`)()
  } catch (e) {
    console.error('eval failed, trying JSON parse...')
    const jsonStr = jsObjToJSON(jsStr)
    return JSON.parse(jsonStr)
  }
}

// ===== Main =====
function main() {
  console.log(`📖 Reading: ${SOURCE}`)
  const html = readFileSync(SOURCE, 'utf-8')

  // Extract PROJECTS
  console.log('🔍 Extracting PROJECTS...')
  const projectsJS = extractJSObj(html, 'PROJECTS')
  const projects = safeEval(projectsJS)

  // Fix trailing comma and other JS-isms with DEV_META
  // DEV_META has nested objects with template literals and comments
  console.log('🔍 Extracting DEV_META...')
  const metaJS = extractJSObj(html, 'DEV_META')
  const devMeta = safeEval(metaJS)

  // Build flat list (matching the JS logic in index.html)
  const ORDER = ['ready', 'dev', 'ideas', 'config', 'legacy']
  const LABELS = {
    ready: 'Ready',
    dev: 'Development',
    ideas: 'Ideas/Planning',
    config: 'Config/Dotfiles',
    legacy: 'Legacy/Arsip',
  }

  const flatProjects = []
  for (const cat of ORDER) {
    const items = projects[cat] || []
    for (const p of items) {
      // Extract repo name from GitHub URL
      let repoName = null
      if (p.path && p.path.startsWith('https://github.com/')) {
        const m = p.path.match(/github\.com\/[^/]+\/([^/#?]+)/)
        if (m) repoName = m[1].replace(/\.git$/, '')
      }

      const meta = devMeta[p.name] || null

      flatProjects.push({
        ...p,
        category: cat,
        categoryLabel: LABELS[cat],
        status: meta?.status || null,
        history: meta?.history || null,
        plan: meta?.plan || null,
        recommendations: meta?.recommendations || null,
        repoName,
      })
    }
  }

  // Count stats
  const stats = {}
  for (const cat of ORDER) {
    stats[cat] = (projects[cat] || []).length
  }
  stats.total = flatProjects.length

  // Output
  const output = {
    _meta: {
      extracted: new Date().toISOString(),
      source: 'Production/niu-dash/index.html',
      stats,
    },
    projects: flatProjects,
    devMeta,
  }

  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(OUT_FILE, JSON.stringify(output, null, 2))
  console.log(`✅ Written: ${OUT_FILE}`)
  console.log(`📊 ${flatProjects.length} projects (${JSON.stringify(stats)})`)
}

main()
