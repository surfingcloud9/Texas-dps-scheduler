# ElevenLabs Agent Configuration

This file documents the ElevenLabs conversational AI agent configuration for the SurfingCloud9 Entertainment voice assistant.

## Configuration File

**File:** `elevenlabs-agent-config.json`

## Overview

The configuration sets up a multilingual voice agent named "Morgan" that can handle calls in English, Spanish, and Hindi. The agent is designed to help potential clients with entertainment service inquiries.

## Key Features

### 1. Multilingual Support
- **Primary Language:** English
- **Supported Languages:** Spanish (es), Hindi (hi)
- **Voice:** Morgan (voice_id: 2vq6XMyP121RBGHnQp4z)
- **Model:** ElevenLabs Multilingual v2

### 2. Voice Configurations
The agent has specific voice configurations for each language:
- **Morgan — Hindi**: Optimized for Hindi-speaking callers
- **Morgan — Spanish**: Optimized for Spanish-speaking callers

### 3. Agent Capabilities

#### Language Detection
The agent automatically detects the caller's language and seamlessly switches between English, Spanish, and Hindi as needed.

#### Tools Available
- **end_call**: Politely ends the call after collecting event details
- **language_detection**: Automatically detects and switches languages

### 4. Data Collection
The agent collects the following information during conversations:
- Primary language used
- Secondary/alternate language used
- Language switch detection
- Agent adaptation score (1-5 rating)
- Confidence notes
- Switch point summary

### 5. Conversation Flow

The agent follows a structured workflow:
1. **Start Node**: Initial greeting
2. **Entertainment Coordinator Morgan**: Main conversation handler
3. **Qualify Event Details**: Detailed information gathering
4. **End Node**: Conversation completion

### 6. Evaluation Criteria

The configuration includes criteria to evaluate:
- Language detection accuracy
- Language switching smoothness
- Whether conversation was primarily English, Spanish, or mixed

## Audio Settings

- **ASR Provider:** ElevenLabs
- **Input Format:** ulaw_8000
- **Output Format:** pcm_16000
- **TTS Settings:**
  - Stability: 0.65
  - Similarity Boost: 0.75
  - Speed: 1.0
  - Optimize Streaming Latency: 4

## Guardrails

All content moderation guardrails are configured with a threshold of 0.3 but are currently disabled:
- Sexual content
- Violence
- Harassment
- Hate speech
- Self-harm content

## Usage

This configuration file should be used with the ElevenLabs Conversational AI platform to deploy the Morgan voice agent for SurfingCloud9 Entertainment.

## Important Notes

1. All critical configuration arrays are properly populated (not empty)
2. The agent maintains a warm, friendly, professional tone
3. Language switching happens seamlessly without announcement
4. The agent stays focused on entertainment services only
