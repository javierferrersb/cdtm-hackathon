# Chatbot Feature Documentation

## Overview

A new chatbot feature has been added to the EventDetails page that allows consultants to ask additional questions about the company or person they're meeting with.

## Features

### 🤖 Intelligent Assistant

- Uses the same GPT-4o mini model as the main report generation
- Has access to web search via Tavily API for real-time information
- Context-aware conversations based on meeting details

### 💬 Chat Interface

- Fixed position floating chat widget
- Collapsible interface that can be toggled open/closed
- Clean Material UI design matching the application theme
- Shows typing indicators and timestamps
- Displays sources for web-searched information

### 🎯 Context-Aware Responses

The chatbot automatically receives context about:

- Meeting attendee name
- Company name
- Meeting title/summary

### 🔍 Web Search Integration

- Automatically searches for relevant information when questions are asked
- Displays clickable source links for transparency
- Combines web search results with AI analysis

## Technical Implementation

### Backend (`/api/chat/event/:eventId`)

- **Route**: `POST /api/chat/event/:eventId`
- **Authentication**: Requires user authentication
- **Parameters**:
  - `message`: User's question
  - `context`: Meeting context (person name, company, event summary)
- **Response**: AI-generated answer with optional search results

### Frontend (`Chatbot.jsx`)

- **Component**: Self-contained chatbot widget
- **Props**:
  - `eventId`: ID of the current meeting
  - `context`: Meeting context object
  - `open`: Controls chat visibility
  - `onToggle`: Function to toggle chat open/closed

### Integration

The chatbot is integrated into the `EventDetails.jsx` page and appears as a floating action button in the bottom-right corner.

## Usage

1. **Open Chat**: Click the blue chat icon in the bottom-right corner of any event details page
2. **Ask Questions**: Type questions about the meeting, company, or person
3. **View Sources**: Click on source chips to visit referenced websites
4. **Close Chat**: Click the X button in the chat header

## Example Questions

- "What is the company's latest funding round?"
- "Tell me more about [Person Name]'s background"
- "What are the company's main competitors?"
- "Any recent news about this company?"
- "What should I know before this meeting?"

## System Prompt

The chatbot uses a specialized system prompt that:

- Identifies itself as a meeting preparation assistant
- Provides context about the current meeting
- Includes recent web search results when available
- Encourages professional, helpful responses
- Advises honesty when information is unavailable

## API Keys Required

- `OPENAI_API_KEY`: For GPT-4o mini model
- `TAVILY_API_KEY`: For web search functionality

Both APIs are the same ones used by the existing report generation system.
