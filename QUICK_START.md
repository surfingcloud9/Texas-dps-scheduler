# Quick Start: Fix ElevenLabs Agent Not Responding

## 🔴 Problem
Your ElevenLabs voice agent "Morgan" is not responding to calls.

## ✅ Solution
Your configuration has empty arrays that need to be restored.

## 🚀 Quick Fix (5 minutes)

### Step 1: Validate Current Config
```bash
node validate-agent-config.js your-config.json
```

### Step 2: See What's Wrong
The validator will show errors like:
- ❌ `tts.supported_voices is empty`
- ❌ `languages array is empty`
- ❌ `agent.tools is empty`

### Step 3: Compare with Working Example
```bash
# Open both files side by side
code your-config.json example-working-config.json
```

### Step 4: Copy Missing Sections

Copy these sections from `example-working-config.json` to your config:

1. **`tts.supported_voices`** array (lines 13-43 in example)
2. **`languages`** array (line 155 in example) 
3. **`agent.tools`** array (lines 135-168 in example)
4. **`agent.knowledge_base`** array (lines 124-130 in example)
5. **`data_collection`** array (lines 79-112 in example)
6. **`evaluation.criteria`** array (lines 70-78 in example)

### Step 5: Validate Fixed Config
```bash
node validate-agent-config.js your-config.json
```

Should show: ✅ Configuration is valid! ✨

### Step 6: Deploy
Deploy your fixed configuration to ElevenLabs platform.

### Step 7: Test
1. Make a test call
2. Verify agent responds
3. Test language switching (if applicable)
4. Verify agent can end calls

## 📚 Need More Help?

- **Detailed Guide**: [ELEVENLABS_AGENT_DEBUG.md](ELEVENLABS_AGENT_DEBUG.md)
- **Issue Summary**: [ISSUE_SUMMARY.md](ISSUE_SUMMARY.md)
- **Tools Guide**: [AGENT_CONFIG_README.md](AGENT_CONFIG_README.md)

## 🛠️ Files Provided

| File | Purpose |
|------|---------|
| `validate-agent-config.js` | Automated validator tool |
| `example-broken-config.json` | Shows the problem |
| `example-working-config.json` | Shows the solution |
| `ELEVENLABS_AGENT_DEBUG.md` | Complete debug guide |
| `ISSUE_SUMMARY.md` | Problem overview |
| `AGENT_CONFIG_README.md` | Tool documentation |

## ⚡ TL;DR

Your agent config has empty arrays. Run the validator, copy missing sections from `example-working-config.json`, validate again, deploy.

```bash
# One-liner to check
node validate-agent-config.js your-config.json && echo "✅ Config OK" || echo "❌ Fix needed - see ELEVENLABS_AGENT_DEBUG.md"
```
