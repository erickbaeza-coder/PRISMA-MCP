#!/usr/bin/env node
// ============================================================
// Prisma MCP Server v1.0
// Whitelabel UX Team · Cencosud · 2026
// ============================================================
// Conecta Claude con el catálogo de Prisma-Components y la
// Figma REST API para crear pantallas desde DS3 JSON o prompts.
// ============================================================

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { FigmaAPI } from './figma-api.js';
import { PrismaCatalog } from './prisma-catalog.js';
import { ComponentResolver } from './component-resolver.js';
import { DS3Builder } from './ds3-builder.js';

// ── Init ──────────────────────────────────────────────────────
const figmaToken = process.env.FIGMA_TOKEN;
if (!figmaToken) {
  process.stderr.write('⚠️  FIGMA_TOKEN no configurado. Las herramientas de Figma no funcionarán.\n');
}

const figmaApi  = new FigmaAPI(figmaToken);
const catalog   = new PrismaCatalog();
const resolver  = new ComponentResolver(catalog);
const builder   = new DS3Builder(resolver, catalog);

// ── Server ────────────────────────────────────────────────────
const server = new Server(
  { name: 'prisma-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// ── Tool definitions ──────────────────────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'sync_prisma_library',
      description:
        'Escanea el archivo Prisma-Components en Figma y enriquece el catálogo local con los component keys reales. ' +
        'Ejecutar una vez antes de crear pantallas para maximizar el match de componentes.',
      inputSchema: {
        type: 'object',
        properties: {
          file_url: {
            type: 'string',
            description: 'URL del archivo Prisma-Components en Figma (ej: https://www.figma.com/file/XXXX/Prisma-Components)'
          }
        },
        required: ['file_url']
      }
    },
    {
      name: 'create_screens_from_ds3',
      description:
        'Toma el JSON completo de packets.ds3 generado por el paso DS3 del proceso agéntico y produce:\n' +
        '1. JSON enriquecido listo para Prisma Builder (plugin Figma)\n' +
        '2. Specs para componentes locales nuevos (los que no existen en Prisma)\n' +
        '3. Prompts de Figma Make para componentes nuevos\n' +
        '4. Resumen de cobertura y warnings\n\n' +
        'Usar cuando tenés el DS3 JSON completo y querés generar todo en Figma.',
      inputSchema: {
        type: 'object',
        properties: {
          ds3_json: {
            type: 'string',
            description: 'JSON completo de packets.ds3 (el que genera DS3 en design_state.json)'
          },
          figma_file_url: {
            type: 'string',
            description: 'URL del archivo de trabajo en Figma donde crear las pantallas'
          }
        },
        required: ['ds3_json']
      }
    },
    {
      name: 'create_screens_from_prompts',
      description:
        'Toma prompts de texto (como los que genera DS3 para Figma Make) y los convierte en pantallas. ' +
        'Para cada prompt: infiere los componentes Prisma correctos, construye el JSON, y genera la spec. ' +
        'Usar cuando tenés los prompts del output_ds3.md pero no el JSON.',
      inputSchema: {
        type: 'object',
        properties: {
          prompts: {
            type: 'array',
            description: 'Array de pantallas con su prompt',
            items: {
              type: 'object',
              properties: {
                id:     { type: 'string', description: 'ID de pantalla (ej: P01)' },
                nombre: { type: 'string', description: 'Nombre de la pantalla' },
                prompt: { type: 'string', description: 'Prompt de Figma Make de esa pantalla' }
              },
              required: ['nombre', 'prompt']
            }
          },
          marca: {
            type: 'string',
            description: 'Nombre de la marca (Jumbo, Disco, Metro, The Fresh Market, Prezunic)',
            enum: ['Jumbo', 'Disco', 'Metro', 'The Fresh Market', 'Prezunic', 'Vea', 'Gbarbosa']
          },
          plataforma: {
            type: 'string',
            description: 'Plataforma objetivo',
            enum: ['iOS', 'Android', 'web mobile', 'web desktop']
          },
          figma_file_url: {
            type: 'string',
            description: 'URL del archivo de trabajo en Figma'
          }
        },
        required: ['prompts']
      }
    },
    {
      name: 'list_prisma_components',
      description:
        'Lista todos los componentes disponibles en el catálogo de Prisma-Components. ' +
        'Útil para saber qué existe antes de diseñar. Soporta filtro por texto o grupo.',
      inputSchema: {
        type: 'object',
        properties: {
          filter: {
            type: 'string',
            description: 'Filtro por nombre (ej: "Button", "banner", "card")'
          },
          group: {
            type: 'string',
            description: 'Filtrar por grupo de Figma (ej: "Nav Bar", "Buttons", "Banners Cards")'
          }
        }
      }
    },
    {
      name: 'resolve_component',
      description:
        'Encuentra el componente Prisma que mejor coincide con una descripción en lenguaje natural. ' +
        'Retorna: nombre exacto del componente, todas sus props válidas, y alternativas. ' +
        'Si no existe, propone una composición con componentes existentes.',
      inputSchema: {
        type: 'object',
        properties: {
          description: {
            type: 'string',
            description: 'Descripción del componente en español o inglés (ej: "botón primario grande", "header con título y flecha atrás", "tarjeta de producto con precio")'
          }
        },
        required: ['description']
      }
    },
    {
      name: 'create_local_component_spec',
      description:
        'Genera la especificación completa para un componente nuevo que NO existe en Prisma. Produce:\n' +
        '1. Composición DS3 con sub-componentes existentes de Prisma\n' +
        '2. Prompt listo para Figma Make\n' +
        '3. Instrucciones para crearlo como componente local en el archivo de trabajo',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Nombre intencional del componente (ej: "EventCard", "RewardBanner", "MembershipGate")'
          },
          description: {
            type: 'string',
            description: 'Descripción detallada: qué hace, estructura visual, elementos que contiene'
          },
          platform: {
            type: 'string',
            enum: ['iOS', 'Android', 'web mobile', 'web desktop'],
            description: 'Plataforma objetivo'
          },
          brand: {
            type: 'string',
            description: 'Marca para la que se crea el componente'
          }
        },
        required: ['name', 'description']
      }
    },
    {
      name: 'get_figma_file_info',
      description: 'Obtiene información de un archivo Figma: nombre, páginas disponibles, cantidad de componentes locales.',
      inputSchema: {
        type: 'object',
        properties: {
          file_url: {
            type: 'string',
            description: 'URL del archivo Figma'
          }
        },
        required: ['file_url']
      }
    },
    {
      name: 'validate_ds3_json',
      description:
        'Valida un DS3 JSON contra el catálogo de Prisma y reporta:\n' +
        '• Componentes válidos vs inválidos\n' +
        '• Props incorrectas o inexistentes\n' +
        '• Componentes que generarán placeholders\n' +
        '• Sugerencias de corrección para cada error',
      inputSchema: {
        type: 'object',
        properties: {
          ds3_json: {
            type: 'string',
            description: 'JSON de packets.ds3 a validar'
          }
        },
        required: ['ds3_json']
      }
    }
  ]
}));

// ── Tool handlers ─────────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'sync_prisma_library':         return await handleSyncLibrary(args);
      case 'create_screens_from_ds3':     return await handleCreateScreensFromDS3(args);
      case 'create_screens_from_prompts': return await handleCreateScreensFromPrompts(args);
      case 'list_prisma_components':      return await handleListComponents(args);
      case 'resolve_component':           return await handleResolveComponent(args);
      case 'create_local_component_spec': return await handleCreateLocalComponentSpec(args);
      case 'get_figma_file_info':         return await handleGetFigmaFileInfo(args);
      case 'validate_ds3_json':           return await handleValidateDS3Json(args);
      default:
        throw new Error(`Tool desconocida: ${name}`);
    }
  } catch (err) {
    return {
      content: [{ type: 'text', text: `❌ Error: ${err.message}` }],
      isError: true
    };
  }
});

// ── Handlers ──────────────────────────────────────────────────

async function handleSyncLibrary({ file_url }) {
  const fileKey = extractFileKey(file_url);
  if (!fileKey) throw new Error('URL de Figma inválida. Formato esperado: https://www.figma.com/file/XXXX/...');

  const components = await figmaApi.getFileComponents(fileKey);
  const count = catalog.updateFromFigma(components);

  const groups = catalog.getGroups();

  return {
    content: [{
      type: 'text',
      text: [
        `✅ Sync completado`,
        ``,
        `• Componentes encontrados en Figma: ${components.length}`,
        `• Nuevos componentes en catálogo: ${count}`,
        `• Grupos disponibles: ${groups.join(', ')}`,
        ``,
        `El catálogo ahora tiene datos reales de component keys de Figma.`,
        `Podés usar create_screens_from_ds3 o create_screens_from_prompts.`
      ].join('\n')
    }]
  };
}

async function handleCreateScreensFromDS3({ ds3_json, figma_file_url }) {
  let ds3Data;
  try {
    ds3Data = JSON.parse(ds3_json);
  } catch {
    throw new Error('JSON inválido. Verificá que pegaste el packets.ds3 completo.');
  }

  const result = builder.buildFromDS3(ds3Data);
  const lines = [];

  lines.push(`# 🎨 DS3 → Figma — Procesamiento completado`);
  lines.push(``);
  lines.push(`**Proyecto:** ${ds3Data.proyecto || '—'}`);
  lines.push(`**Marca:** ${ds3Data.marca || '—'} · **Dirección:** ${ds3Data.direccion || '—'}`);
  lines.push(`**Pantallas:** ${result.screens.length} · **Componentes:** ${result.totalComponents} (${result.resolved} resueltos, ${result.placeholders} placeholders)`);
  lines.push(``);

  // Coverage table
  lines.push(`## Cobertura por pantalla`);
  lines.push(``);
  lines.push(`| Pantalla | Componentes | Resueltos | Locales | Fidelidad |`);
  lines.push(`|---|---|---|---|---|`);
  for (const s of result.screens) {
    const fid = s.local > 0 ? '🟡 Aproximada' : '✅ Fiel';
    lines.push(`| ${s.id} · ${s.nombre} | ${s.total} | ${s.resolved} | ${s.local} | ${fid} |`);
  }
  lines.push(``);

  // New components
  if (result.newComponents.length > 0) {
    lines.push(`## ⚠️ Componentes nuevos (crear en Figma)`);
    lines.push(``);
    for (const nc of result.newComponents) {
      lines.push(`### ${nc.name}`);
      lines.push(`${nc.description}`);
      lines.push(``);
      lines.push(`**Composición DS3:**`);
      lines.push(`\`\`\`json`);
      lines.push(JSON.stringify(nc.composicion, null, 2));
      lines.push(`\`\`\``);
      lines.push(``);
      lines.push(`**Prompt Figma Make:**`);
      lines.push(`\`\`\``);
      lines.push(nc.figmaMakePrompt);
      lines.push(`\`\`\``);
      lines.push(``);
    }
  }

  // Warnings
  if (result.warnings.length > 0) {
    lines.push(`## Warnings`);
    lines.push(``);
    result.warnings.forEach(w => lines.push(`• ${w}`));
    lines.push(``);
  }

  // Enhanced JSON
  lines.push(`## JSON listo para Prisma Builder`);
  lines.push(``);
  lines.push(`Pegá este JSON en el plugin Prisma Builder en Figma${figma_file_url ? ` → ${figma_file_url}` : ''}:`);
  lines.push(``);
  lines.push(`\`\`\`json`);
  lines.push(JSON.stringify(result.enhancedJson, null, 2));
  lines.push(`\`\`\``);

  return { content: [{ type: 'text', text: lines.join('\n') }] };
}

async function handleCreateScreensFromPrompts({ prompts, marca, plataforma, figma_file_url }) {
  const lines = [];
  lines.push(`# 🔄 Prompts → DS3 JSON`);
  lines.push(``);
  lines.push(`Procesando ${prompts.length} pantalla(s)...`);
  lines.push(``);

  // Inferir componentes de cada prompt
  const pantallas = prompts.map((p, i) => {
    const componentes = resolver.inferFromPrompt(p.prompt || p.descripcion || p.nombre);
    return {
      id: p.id || `P${String(i + 1).padStart(2, '0')}`,
      nombre: p.nombre,
      descripcion: (p.prompt || '').substring(0, 120),
      layout: {
        direction: 'vertical', gap: 0,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        clipContent: true, primaryAxisSizing: 'auto', counterAxisSizing: 'fixed',
        width: 390, backgroundColor: '#FFFFFF'
      },
      componentes
    };
  });

  const ds3Data = {
    version: '2.0',
    proyecto: 'Generado desde prompts',
    marca: marca || 'Jumbo',
    plataforma: plataforma || 'iOS',
    flujo: 'Desde prompts DS3',
    direccion: 'B',
    pantallas
  };

  // Mostrar el JSON generado
  lines.push(`## DS3 JSON inferido`);
  lines.push(``);
  lines.push(`\`\`\`json`);
  lines.push(JSON.stringify(ds3Data, null, 2));
  lines.push(`\`\`\``);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // Procesar igual que create_screens_from_ds3
  const result = builder.buildFromDS3(ds3Data);

  lines.push(`## Resultado: ${result.screens.length} pantalla(s) procesada(s)`);
  lines.push(`• Componentes resueltos: ${result.resolved}/${result.totalComponents}`);
  lines.push(`• Componentes locales nuevos: ${result.newComponents.length}`);
  lines.push(``);

  if (result.newComponents.length > 0) {
    lines.push(`## Componentes nuevos a crear`);
    for (const nc of result.newComponents) {
      lines.push(`\n**${nc.name}** — ${nc.description}`);
      lines.push(`\`\`\`\n${nc.figmaMakePrompt}\n\`\`\``);
    }
    lines.push(``);
  }

  lines.push(`## JSON para Prisma Builder`);
  lines.push(`\`\`\`json`);
  lines.push(JSON.stringify(result.enhancedJson, null, 2));
  lines.push(`\`\`\``);

  return { content: [{ type: 'text', text: lines.join('\n') }] };
}

async function handleListComponents({ filter, group }) {
  const components = catalog.list(filter, group);
  const groups = catalog.getGroups();

  if (components.length === 0) {
    return {
      content: [{
        type: 'text',
        text: `No hay componentes${filter ? ` para "${filter}"` : ''}.\n\nGrupos disponibles: ${groups.join(', ')}`
      }]
    };
  }

  const grouped = groupBy(components, c => c.group);
  const lines = [`## Componentes Prisma (${components.length})\n`];

  for (const [g, comps] of Object.entries(grouped)) {
    lines.push(`**${g}**`);
    comps.forEach(c => lines.push(`  • \`${c.name}\``));
    lines.push('');
  }

  return { content: [{ type: 'text', text: lines.join('\n') }] };
}

async function handleResolveComponent({ description }) {
  const matches = resolver.findByDescription(description);

  if (matches.length === 0) {
    const spec = resolver.createLocalComponentSpec(description, description, 'iOS', 'Jumbo');
    return {
      content: [{
        type: 'text',
        text: [
          `No encontré un componente Prisma exacto para: "${description}"`,
          ``,
          `**Recomendación:** Crear como componente local con esta composición:`,
          `\`\`\`json`,
          JSON.stringify(spec.composicion, null, 2),
          `\`\`\``,
          ``,
          `O usá \`create_local_component_spec\` para una spec completa con prompt de Figma Make.`
        ].join('\n')
      }]
    };
  }

  const best = matches[0];
  const alts = matches.slice(1, 3);

  return {
    content: [{
      type: 'text',
      text: [
        `**✅ Mejor match:** \`${best.name}\``,
        `Grupo: ${best.group} · Confianza: ${best.score}%`,
        ``,
        alts.length > 0
          ? `**Alternativas:**\n${alts.map(a => `• \`${a.name}\` (${a.score}%)`).join('\n')}`
          : '',
        ``,
        `**Uso en DS3 JSON:**`,
        `\`\`\`json`,
        JSON.stringify({
          orden: 1,
          componente: best.name,
          rol: description,
          sizing: { horizontal: 'fill', vertical: 'hug' }
        }, null, 2),
        `\`\`\``
      ].filter(Boolean).join('\n')
    }]
  };
}

async function handleCreateLocalComponentSpec({ name, description, platform, brand }) {
  const spec = resolver.createLocalComponentSpec(name, description, platform || 'iOS', brand || 'Jumbo');

  return {
    content: [{
      type: 'text',
      text: [
        `## ⚠️ Spec: ${name}`,
        ``,
        `*No existe en Prisma-Components — crear como componente local*`,
        ``,
        `### Composición DS3`,
        `\`\`\`json`,
        JSON.stringify(spec.composicion, null, 2),
        `\`\`\``,
        ``,
        `### Prompt para Figma Make`,
        `\`\`\``,
        spec.figmaMakePrompt,
        `\`\`\``,
        ``,
        `### Instrucciones`,
        `1. En Figma Make, pegá el prompt de arriba`,
        `2. Nombrá el componente exactamente \`${name}\``,
        `3. Guardalo como componente local (no publicar en Prisma-Components aún)`,
        `4. Una vez aprobado, publicarlo en la librería`
      ].join('\n')
    }]
  };
}

async function handleGetFigmaFileInfo({ file_url }) {
  const fileKey = extractFileKey(file_url);
  if (!fileKey) throw new Error('URL de Figma inválida.');

  const info = await figmaApi.getFileInfo(fileKey);

  return {
    content: [{
      type: 'text',
      text: [
        `**Archivo:** ${info.name}`,
        `**Páginas:** ${info.pages.join(', ')}`,
        `**Última modificación:** ${info.lastModified}`,
        `**Versión:** ${info.version}`,
        `**Componentes locales:** ${info.componentCount}`
      ].join('\n')
    }]
  };
}

async function handleValidateDS3Json({ ds3_json }) {
  let ds3Data;
  try {
    ds3Data = JSON.parse(ds3_json);
  } catch {
    throw new Error('JSON inválido. No es un JSON parseable.');
  }

  const validation = builder.validate(ds3Data);
  const lines = [];

  lines.push(`# Validación DS3 JSON`);
  lines.push(``);
  lines.push(`**Pantallas:** ${validation.screens} · **Componentes total:** ${validation.totalComponents}`);
  lines.push(`**Válidos:** ✅ ${validation.valid} · **Warnings:** 🟡 ${validation.warnings.length} · **Errores:** ❌ ${validation.errors.length}`);
  lines.push(``);

  if (validation.errors.length > 0) {
    lines.push(`## ❌ Errores`);
    validation.errors.forEach(e => {
      lines.push(`- **${e.screen} · ${e.component}**: ${e.message}`);
      if (e.suggestion) lines.push(`  → Sugerencia: \`${e.suggestion}\``);
    });
    lines.push(``);
  }

  if (validation.warnings.length > 0) {
    lines.push(`## 🟡 Warnings`);
    validation.warnings.forEach(w => lines.push(`- ${w}`));
    lines.push(``);
  }

  if (validation.errors.length === 0 && validation.warnings.length === 0) {
    lines.push(`✅ JSON válido — listo para usar con Prisma Builder`);
  }

  return { content: [{ type: 'text', text: lines.join('\n') }] };
}

// ── Utils ─────────────────────────────────────────────────────

function extractFileKey(url) {
  const match = url?.match(/figma\.com\/(file|design)\/([a-zA-Z0-9]+)/);
  return match ? match[2] : null;
}

function groupBy(arr, fn) {
  return arr.reduce((acc, item) => {
    const key = fn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

// ── Start ─────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write('✅ Prisma MCP Server iniciado\n');
