# ElevenLabs Voice Agent Configuration Tools

This directory contains tools and documentation for debugging and validating ElevenLabs voice agent configurations.

## Problem

The ElevenLabs voice agent was not responding due to critical configuration arrays being cleared. This is a common issue when configurations are edited or migrated.

## Files in This Directory

### Documentation

- **`ELEVENLABS_AGENT_DEBUG.md`** - Comprehensive debug guide
  - Detailed root cause analysis
  - Step-by-step restoration instructions
  - Prevention measures and best practices
  - Quick diagnosis checklist

### Tools

- **`validate-agent-config.js`** - Configuration validation tool
  - Validates all critical configuration fields
  - Checks for common configuration errors
  - Provides detailed error and warning reports
  - Cross-validates related fields (e.g., languages vs. voices)

### Example Configurations

- **`example-broken-config.json`** - Example of broken configuration
  - Shows what happens when arrays are cleared
  - Use for testing the validator
  
- **`example-working-config.json`** - Example of working configuration
  - Complete, properly configured agent
  - Reference for restoration
  - Use as a template

## Quick Start

### 1. Validate Your Configuration

```bash
node validate-agent-config.js your-config.json
```

Example output:
```
🔍 Validating ElevenLabs Agent Configuration...

📢 TTS Configuration
📚 Knowledge Base
🛠️  Agent Tools
...

✅ Configuration is valid! ✨
```

### 2. Test with Example Files

Validate the broken configuration to see errors:
```bash
node validate-agent-config.js example-broken-config.json
```

Expected output: Multiple errors indicating empty arrays

Validate the working configuration:
```bash
node validate-agent-config.js example-working-config.json
```

Expected output: All checks pass

### 3. Fix Your Configuration

If validation fails, refer to `ELEVENLABS_AGENT_DEBUG.md` for detailed restoration steps.

## Common Issues and Solutions

### Issue: "tts.supported_voices is empty"

**Impact**: Agent cannot switch languages or use proper voice profiles

**Solution**: Add voice configurations for each supported language
```json
"supported_voices": [
  {
    "label": "Morgan — Hindi",
    "voice_id": "2vq6XMyP121RBGHnQp4z",
    "language": "hi",
    ...
  }
]
```

### Issue: "agent.tools is empty"

**Impact**: Agent cannot perform any actions (can't even end calls)

**Solution**: Add required tools
```json
"tools": [
  {
    "type": "system",
    "name": "end_call",
    ...
  }
]
```

### Issue: "languages array is empty"

**Impact**: Agent cannot recognize or respond in multiple languages

**Solution**: Specify supported languages
```json
"languages": ["es", "hi"]
```

## Validation Checklist

Before deploying any configuration:

- [ ] Run `validate-agent-config.js` with your config file
- [ ] All errors are resolved
- [ ] Review warnings and address critical ones
- [ ] Test in sandbox/staging environment
- [ ] Verify agent can start conversations
- [ ] Verify agent can detect language switches (if multilingual)
- [ ] Verify agent can access knowledge base
- [ ] Verify agent can end calls appropriately

## Prevention Tips

1. **Always validate before deploy**
   ```bash
   node validate-agent-config.js config.json && deploy-command
   ```

2. **Version control your configurations**
   ```bash
   git add agent-config.json
   git commit -m "Update agent configuration"
   ```

3. **Keep backups**
   ```bash
   cp agent-config.json agent-config.backup.$(date +%Y%m%d).json
   ```

4. **Use the validator in CI/CD**
   ```yaml
   # Example GitHub Actions workflow
   - name: Validate Agent Config
     run: node validate-agent-config.js production-config.json
   ```

## Tool Features

### Configuration Validator

The `validate-agent-config.js` tool checks:

✅ **TTS Configuration**
- Voice ID presence
- Model ID presence  
- Supported voices array
- Individual voice configurations

✅ **Language Support**
- Languages array populated
- Cross-validation with supported voices

✅ **Agent Tools**
- Tools array populated
- Critical tools present (end_call, language_detection)

✅ **Knowledge Base**
- Knowledge base populated
- Document configurations valid

✅ **Data Collection**
- Data collection fields defined
- Field type validation

✅ **Evaluation**
- Evaluation criteria defined
- Criterion configurations valid

✅ **Workflow**
- Workflow nodes defined
- Edge orders configured

✅ **Agent Prompt**
- First message configured
- Main prompt configured
- LLM model specified

## Troubleshooting

### Validator won't run

**Error**: `Cannot find module`

**Solution**: Ensure you're using Node.js v18 or higher
```bash
node --version
```

### JSON parsing errors

**Error**: `Failed to parse JSON configuration`

**Solution**: Validate JSON syntax
```bash
cat your-config.json | python -m json.tool
```

### Agent still not responding after fixes

1. Verify all validation errors are resolved
2. Check ElevenLabs API status
3. Verify voice_id is valid and accessible
4. Check account permissions and quotas
5. Review application logs for runtime errors

## Support

For more detailed information:
- Read `ELEVENLABS_AGENT_DEBUG.md`
- Check ElevenLabs documentation
- Review example configurations

## Contributing

If you find additional configuration issues or want to improve the validator:
1. Document the issue
2. Add test cases to example files
3. Update validation logic
4. Update documentation

## License

These tools are provided as-is for debugging ElevenLabs agent configurations.
