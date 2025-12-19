#!/usr/bin/env node

/**
 * ElevenLabs Agent Configuration Validator
 * 
 * This tool validates ElevenLabs voice agent configuration files
 * to ensure all critical fields are properly configured.
 * 
 * Usage:
 *   node validate-agent-config.js <config-file.json>
 */

const fs = require('fs');
const path = require('path');

// Constants
const DESCRIPTION_MAX_LENGTH = 60;
const DESCRIPTION_SHORT_LENGTH = 50;

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

function log(message, color = '') {
    console.log(`${color}${message}${colors.reset}`);
}

function logError(message) {
    log(`❌ ERROR: ${message}`, colors.red);
}

function logWarning(message) {
    log(`⚠️  WARNING: ${message}`, colors.yellow);
}

function logSuccess(message) {
    log(`✅ ${message}`, colors.green);
}

function logInfo(message) {
    log(`ℹ️  ${message}`, colors.cyan);
}

function logSection(message) {
    log(`\n${colors.bold}${message}${colors.reset}`, colors.blue);
}

class AgentConfigValidator {
    constructor(config) {
        this.config = config;
        this.errors = [];
        this.warnings = [];
        this.passed = [];
    }

    validate() {
        logSection('🔍 Validating ElevenLabs Agent Configuration...\n');

        this.validateTTSConfig();
        this.validateLanguages();
        this.validateAgentTools();
        this.validateKnowledgeBase();
        this.validateDataCollection();
        this.validateEvaluationCriteria();
        this.validateWorkflow();
        this.validateAgentPrompt();

        this.printReport();
        return this.errors.length === 0;
    }

    validateTTSConfig() {
        logSection('📢 TTS Configuration');

        const tts = this.config.tts;
        
        if (!tts) {
            this.errors.push('Missing tts configuration object');
            return;
        }

        // Check voice_id
        if (!tts.voice_id) {
            this.errors.push('tts.voice_id is missing or empty');
        } else {
            this.passed.push(`tts.voice_id: ${tts.voice_id}`);
        }

        // Check model_id
        if (!tts.model_id) {
            this.errors.push('tts.model_id is missing or empty');
        } else {
            this.passed.push(`tts.model_id: ${tts.model_id}`);
        }

        // Check supported_voices
        if (!tts.supported_voices) {
            this.errors.push('tts.supported_voices is missing');
        } else if (!Array.isArray(tts.supported_voices)) {
            this.errors.push('tts.supported_voices must be an array');
        } else if (tts.supported_voices.length === 0) {
            this.errors.push('tts.supported_voices is empty - agent cannot switch languages');
        } else {
            this.passed.push(`tts.supported_voices: ${tts.supported_voices.length} voice(s) configured`);
            
            // Validate each voice
            tts.supported_voices.forEach((voice, index) => {
                const prefix = `tts.supported_voices[${index}]`;
                if (!voice.voice_id) {
                    this.errors.push(`${prefix}.voice_id is missing`);
                }
                if (!voice.language) {
                    this.errors.push(`${prefix}.language is missing`);
                }
                if (!voice.label) {
                    this.warnings.push(`${prefix}.label is missing`);
                }
            });
        }
    }

    validateLanguages() {
        logSection('🌍 Language Configuration');

        const languages = this.config.languages;
        
        if (!languages) {
            this.errors.push('languages array is missing');
            return;
        }

        if (!Array.isArray(languages)) {
            this.errors.push('languages must be an array');
            return;
        }

        if (languages.length === 0) {
            this.errors.push('languages array is empty - agent cannot handle multilingual conversations');
        } else {
            this.passed.push(`languages: ${languages.join(', ')}`);

            // Cross-check with supported_voices
            if (this.config.tts?.supported_voices) {
                const voiceLanguages = this.config.tts.supported_voices.map(v => v.language);
                const missingInVoices = languages.filter(lang => !voiceLanguages.includes(lang));
                const missingInArray = voiceLanguages.filter(lang => !languages.includes(lang));

                if (missingInVoices.length > 0) {
                    this.warnings.push(`Languages ${missingInVoices.join(', ')} in languages array but not in supported_voices`);
                }
                if (missingInArray.length > 0) {
                    this.warnings.push(`Languages ${missingInArray.join(', ')} in supported_voices but not in languages array`);
                }
            }
        }
    }

    validateAgentTools() {
        logSection('🛠️  Agent Tools');

        const tools = this.config.agent?.tools;
        
        if (!tools) {
            this.errors.push('agent.tools is missing');
            return;
        }

        if (!Array.isArray(tools)) {
            this.errors.push('agent.tools must be an array');
            return;
        }

        if (tools.length === 0) {
            this.errors.push('agent.tools is empty - agent cannot perform any actions');
            return;
        }

        this.passed.push(`agent.tools: ${tools.length} tool(s) configured`);

        // Check for critical tools
        const toolNames = tools.map(t => t.name);
        const criticalTools = ['end_call', 'language_detection'];
        
        criticalTools.forEach(toolName => {
            if (!toolNames.includes(toolName)) {
                this.warnings.push(`Recommended tool '${toolName}' is not configured`);
            }
        });

        // List configured tools
        tools.forEach(tool => {
            if (tool.name) {
                logInfo(`  - ${tool.name}: ${tool.description?.substring(0, DESCRIPTION_MAX_LENGTH)}...`);
            }
        });
    }

    validateKnowledgeBase() {
        logSection('📚 Knowledge Base');

        const knowledgeBase = this.config.agent?.knowledge_base;
        
        if (!knowledgeBase) {
            this.warnings.push('agent.knowledge_base is missing');
            return;
        }

        if (!Array.isArray(knowledgeBase)) {
            this.errors.push('agent.knowledge_base must be an array');
            return;
        }

        if (knowledgeBase.length === 0) {
            this.warnings.push('agent.knowledge_base is empty - agent lacks contextual information');
        } else {
            this.passed.push(`agent.knowledge_base: ${knowledgeBase.length} document(s) configured`);
            knowledgeBase.forEach(doc => {
                if (doc.name) {
                    logInfo(`  - ${doc.name} (${doc.usage_mode || 'auto'})`);
                }
            });
        }
    }

    validateDataCollection() {
        logSection('📊 Data Collection');

        const dataCollection = this.config.data_collection;
        
        if (!dataCollection) {
            this.warnings.push('data_collection is missing');
            return;
        }

        if (!Array.isArray(dataCollection)) {
            this.errors.push('data_collection must be an array');
            return;
        }

        if (dataCollection.length === 0) {
            this.warnings.push('data_collection is empty - agent will not collect metrics');
        } else {
            this.passed.push(`data_collection: ${dataCollection.length} field(s) configured`);
            dataCollection.forEach(field => {
                if (field.id) {
                    logInfo(`  - ${field.id} (${field.type}): ${field.description?.substring(0, DESCRIPTION_SHORT_LENGTH)}...`);
                }
            });
        }
    }

    validateEvaluationCriteria() {
        logSection('📈 Evaluation Criteria');

        const criteria = this.config.evaluation?.criteria;
        
        if (!criteria) {
            this.warnings.push('evaluation.criteria is missing');
            return;
        }

        if (!Array.isArray(criteria)) {
            this.errors.push('evaluation.criteria must be an array');
            return;
        }

        if (criteria.length === 0) {
            this.warnings.push('evaluation.criteria is empty - conversation quality cannot be evaluated');
        } else {
            this.passed.push(`evaluation.criteria: ${criteria.length} ${criteria.length === 1 ? 'criterion' : 'criteria'} configured`);
            criteria.forEach(criterion => {
                if (criterion.name) {
                    logInfo(`  - ${criterion.name} (${criterion.type})`);
                }
            });
        }
    }

    validateWorkflow() {
        logSection('🔄 Workflow Configuration');

        const workflow = this.config.workflow;
        
        if (!workflow) {
            this.warnings.push('workflow configuration is missing');
            return;
        }

        if (!workflow.nodes) {
            this.errors.push('workflow.nodes is missing');
            return;
        }

        const nodes = Object.keys(workflow.nodes);
        if (nodes.length === 0) {
            this.errors.push('workflow.nodes is empty - no conversation flow defined');
            return;
        }

        this.passed.push(`workflow.nodes: ${nodes.length} node(s) configured`);

        // Check for edge_order in each node
        let emptyEdgeOrders = 0;
        nodes.forEach(nodeId => {
            const node = workflow.nodes[nodeId];
            if (node.edge_order && Array.isArray(node.edge_order) && node.edge_order.length === 0) {
                emptyEdgeOrders++;
            }
        });

        if (emptyEdgeOrders > 0) {
            this.warnings.push(`${emptyEdgeOrders} node(s) have empty edge_order arrays - may affect conversation flow`);
        }
    }

    validateAgentPrompt() {
        logSection('💬 Agent Prompt Configuration');

        const agent = this.config.agent;
        
        if (!agent) {
            this.errors.push('agent configuration is missing');
            return;
        }

        if (!agent.first_message) {
            this.errors.push('agent.first_message is missing - agent cannot start conversations');
        } else {
            this.passed.push('agent.first_message is configured');
        }

        if (!agent.prompt?.prompt) {
            this.errors.push('agent.prompt.prompt is missing - agent has no instructions');
        } else {
            this.passed.push('agent.prompt.prompt is configured');
        }

        if (!agent.prompt?.llm) {
            this.errors.push('agent.prompt.llm is missing - no language model specified');
        } else {
            this.passed.push(`agent.prompt.llm: ${agent.prompt.llm}`);
        }
    }

    printReport() {
        logSection('\n📋 Validation Report\n');

        // Print passed checks
        if (this.passed.length > 0) {
            log(`${colors.bold}Passed Checks (${this.passed.length}):${colors.reset}`, colors.green);
            this.passed.forEach(check => logSuccess(check));
            console.log('');
        }

        // Print warnings
        if (this.warnings.length > 0) {
            log(`${colors.bold}Warnings (${this.warnings.length}):${colors.reset}`, colors.yellow);
            this.warnings.forEach(warning => logWarning(warning));
            console.log('');
        }

        // Print errors
        if (this.errors.length > 0) {
            log(`${colors.bold}Errors (${this.errors.length}):${colors.reset}`, colors.red);
            this.errors.forEach(error => logError(error));
            console.log('');
        }

        // Print final result
        logSection('Final Result');
        if (this.errors.length === 0) {
            if (this.warnings.length === 0) {
                logSuccess('Configuration is valid! ✨');
            } else {
                log('⚠️  Configuration is valid but has warnings', colors.yellow);
            }
        } else {
            logError(`Configuration is invalid! Found ${this.errors.length} error(s)`);
            logInfo('\nRefer to ELEVENLABS_AGENT_DEBUG.md for restoration steps.');
        }
    }
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('Usage: node validate-agent-config.js <config-file.json>');
        console.error('\nExample:');
        console.error('  node validate-agent-config.js agent-config.json');
        process.exit(1);
    }

    const configFile = args[0];
    
    if (!fs.existsSync(configFile)) {
        logError(`Configuration file not found: ${configFile}`);
        process.exit(1);
    }

    let config;
    try {
        const configContent = fs.readFileSync(configFile, 'utf-8');
        config = JSON.parse(configContent);
    } catch (error) {
        logError(`Failed to parse JSON configuration: ${error.message}`);
        process.exit(1);
    }

    const validator = new AgentConfigValidator(config);
    const isValid = validator.validate();

    process.exit(isValid ? 0 : 1);
}

if (require.main === module) {
    main();
}

module.exports = { AgentConfigValidator };
