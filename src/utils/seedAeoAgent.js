/**
 * seedAeoAgent.js
 *
 * One-time Firestore seed for the "AEO-Optimized FAQ Generation Agent".
 * Called on app boot. Uses getAgentBySlug to check for existence first —
 * the agent is only written if it is not already in Firestore, so user
 * edits made after initial creation are never overwritten.
 */

import { saveAgent, getAgentBySlug } from '../services/agentService';

export const AEO_AGENT_ID   = 'faq-generation-aeo-agent';
export const AEO_MODULE_SLUG = 'faq-generation';
export const AEO_AGENT_SLUG  = 'aeo-optimized-faq-generation-agent';

const START_NODE_ID = '__start__';

/* ─────────────────────────────────────────────────────────────
   Node list — mirrors the shape produced by makeNodeConfig()
   in AgentBuilder.jsx. Titles are pre-populated so the canvas
   displays them before any user interaction.
───────────────────────────────────────────────────────────── */
const SEED_NODES = [
  {
    id: 'seed-node-1',
    flowType: 'trigger',
    data: {
      title: 'Check for Search AI score',
      headerLabel: 'Schedule-based trigger',
      subtype: 'Schedule-based',
      stepNumber: 1,
      subtitle: 'Monthly check for Search AI performance metrics',
      titlePlaceholder: 'Enter trigger name',
      descriptionPlaceholder: 'Enter description',
      hasAiIcon: false,
      hasToggle: true,
      toggleEnabled: true,
    },
  },
  {
    id: 'seed-node-2',
    flowType: 'task',
    data: {
      title: 'Collect web pages content for analysis',
      subtype: 'Website scraper',
      stepNumber: 2,
      subtitle: 'Scrape and collect web page content for AI analysis',
      titlePlaceholder: 'Enter task name',
      descriptionPlaceholder: 'Enter description',
      hasAiIcon: false,
      hasToggle: true,
      toggleEnabled: true,
    },
  },
  {
    id: 'seed-node-3',
    flowType: 'task',
    data: {
      title: 'Determine core search queries',
      subtype: 'Custom',
      stepNumber: 3,
      subtitle: 'Analyze scraped content to determine 3-5 primary search queries',
      titlePlaceholder: 'Enter task name',
      descriptionPlaceholder: 'Enter description',
      hasAiIcon: true,
      hasToggle: true,
      toggleEnabled: true,
    },
  },
  {
    id: 'seed-node-4',
    flowType: 'task',
    data: {
      title: 'AI site FAQ research',
      subtype: 'Custom',
      stepNumber: 4,
      subtitle: 'Query AI site for comprehensive FAQ research on core business queries',
      titlePlaceholder: 'Enter task name',
      descriptionPlaceholder: 'Enter description',
      hasAiIcon: true,
      hasToggle: true,
      toggleEnabled: true,
    },
  },
  {
    id: 'seed-node-5',
    flowType: 'task',
    data: {
      title: 'Extract FAQs from AI site',
      subtype: 'Custom',
      stepNumber: 5,
      subtitle: 'Query AI site using core search queries to retrieve AI-generated answers and FAQ structures',
      titlePlaceholder: 'Enter task name',
      descriptionPlaceholder: 'Enter description',
      hasAiIcon: true,
      hasToggle: true,
      toggleEnabled: true,
    },
  },
  {
    id: 'seed-node-6',
    flowType: 'task',
    data: {
      title: 'Extract PAA (People Also Ask) Questions',
      subtype: 'Google PAA',
      stepNumber: 6,
      subtitle: "Scrape Google's People Also Ask for core queries and related searches",
      titlePlaceholder: 'Enter task name',
      descriptionPlaceholder: 'Enter description',
      hasAiIcon: false,
      hasToggle: true,
      toggleEnabled: true,
    },
  },
  {
    id: 'seed-node-7',
    flowType: 'task',
    data: {
      title: 'Analyze query fanouts',
      subtype: 'Query fanout estimator',
      stepNumber: 7,
      subtitle: 'Understand query variations and long-tail coverage for maximum search visibility',
      titlePlaceholder: 'Enter task name',
      descriptionPlaceholder: 'Enter description',
      hasAiIcon: false,
      hasToggle: true,
      toggleEnabled: true,
    },
  },
];

/* ─────────────────────────────────────────────────────────────
   Node details — mirrors the shape produced by makeNodeDetails()
   in AgentBuilder.jsx. The __start__ entry sets the agent name
   and goals displayed in the AgentDetails RHS panel.
───────────────────────────────────────────────────────────── */
const SEED_NODE_DETAILS = {
  [START_NODE_ID]: {
    agentName: 'AEO-Optimized FAQ Generation Agent',
    goals: 'Generate AEO-optimized FAQs to improve Search AI score and increase search visibility across AI answer engines and featured snippets.',
    outcomes: 'Higher AEO scores, more featured snippets, and improved organic search performance through well-structured, research-backed FAQ content.',
    locations: [],
  },
  'seed-node-1': {
    triggerName: 'Check for Search AI score',
    description: 'Monthly check for Search AI performance metrics',
    frequency: 'Monthly',
    day: '30 days',
    time: '9:00 AM',
  },
  'seed-node-2': {
    taskName: 'Collect web pages content for analysis',
    description: 'Scrape and collect web page content for AI analysis',
  },
  'seed-node-3': {
    taskName: 'Determine core search queries',
    description: 'Analyze scraped content to determine 3-5 primary search queries',
    llmModel: 'Fast',
    systemPrompt: 'You are an expert in SEO and search intent analysis. Identify the most important search queries for the business based on its content.',
    userPrompt: 'Analyze the scraped content and identify the 3-5 most important primary search queries that customers use to find this business.',
  },
  'seed-node-4': {
    taskName: 'AI site FAQ research',
    description: 'Query AI site for comprehensive FAQ research on core business queries',
    llmModel: 'Fast',
    systemPrompt: 'You are an expert in FAQ generation and AEO (Answer Engine Optimization). Generate comprehensive FAQ content that answers search queries in AI-optimized formats.',
    userPrompt: 'Query AI search engines for comprehensive FAQ research on the provided core business queries. Return structured FAQ data with questions and detailed answers.',
  },
  'seed-node-5': {
    taskName: 'Extract FAQs from AI site',
    description: 'Query AI site using core search queries to retrieve AI-generated answers and FAQ structures',
    llmModel: 'Fast',
    systemPrompt: 'You are an expert in extracting and structuring FAQ content from AI search results. Format responses in clean Q&A pairs optimized for featured snippets.',
    userPrompt: 'Extract FAQ structures from AI site results for the given search queries. Return a list of question-answer pairs suitable for embedding on the business website.',
  },
  'seed-node-6': {
    taskName: 'Extract PAA (People Also Ask) Questions',
    description: "Scrape Google's People Also Ask for core queries and related searches",
  },
  'seed-node-7': {
    taskName: 'Analyze query fanouts',
    description: 'Understand query variations and long-tail coverage for maximum search visibility',
  },
};

/* ─────────────────────────────────────────────────────────────
   Module-level guard — prevents redundant Firestore reads if
   the component that calls this remounts within the same page
   session (e.g. React StrictMode double-invoke).
───────────────────────────────────────────────────────────── */
let seedAttempted = false;

/**
 * Ensures the AEO-Optimized FAQ Generation Agent exists in Firestore.
 * Safe to call on every app boot — does nothing if the agent is already there.
 */
export async function seedAeoAgent() {
  if (seedAttempted) return;
  seedAttempted = true;

  try {
    const existing = await getAgentBySlug(AEO_MODULE_SLUG, AEO_AGENT_SLUG);
    if (existing) return; // already seeded — never overwrite user edits

    await saveAgent(AEO_AGENT_ID, {
      id: AEO_AGENT_ID,
      name: 'AEO-Optimized FAQ Generation Agent',
      moduleSlug: AEO_MODULE_SLUG,
      agentSlug: AEO_AGENT_SLUG,
      moduleContext: AEO_MODULE_SLUG,
      sectionContext: 'faq-generation-agents',
      status: 'Draft',
      nodes: SEED_NODES,
      nodeDetails: SEED_NODE_DETAILS,
    });
  } catch (err) {
    // Non-fatal — the user can still create the agent manually
    console.warn('[seedAeoAgent] Seed skipped:', err.message);
  }
}
