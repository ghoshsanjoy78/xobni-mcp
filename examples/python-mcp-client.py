"""
Example: Connect to Xobni MCP server using the Python MCP SDK.

Prerequisites:
    pip install mcp anthropic

Usage:
    export XOBNI_API_KEY="xobni_your_key_here"
    python python-mcp-client.py
"""

import asyncio
import os

from anthropic import Anthropic
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client


XOBNI_API_KEY = os.environ["XOBNI_API_KEY"]
MCP_URL = "https://api.xobni.ai/mcp/"


async def main():
    headers = {"Authorization": f"Bearer {XOBNI_API_KEY}"}

    async with streamablehttp_client(MCP_URL, headers=headers) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # List available tools
            tools = await session.list_tools()
            print(f"Available tools: {len(tools.tools)}")
            for tool in tools.tools:
                print(f"  - {tool.name}: {tool.description[:80]}")

            # Get agent info
            result = await session.call_tool("get_agent_info", {})
            print(f"\nAgent info: {result.content[0].text}")

            # Read inbox
            result = await session.call_tool("read_inbox", {"limit": 5})
            print(f"\nInbox: {result.content[0].text}")

            # Send an email
            result = await session.call_tool("send_email", {
                "to": ["recipient@example.com"],
                "subject": "Hello from my AI agent",
                "body_text": "This email was sent by an AI agent using Xobni.",
            })
            print(f"\nSend result: {result.content[0].text}")

            # Semantic search
            result = await session.call_tool("search_emails", {
                "query": "meeting notes from last week",
            })
            print(f"\nSearch results: {result.content[0].text}")

            # Calendar: create an event
            result = await session.call_tool("create_calendar_event", {
                "title": "Team Standup",
                "start_time": "2026-03-20T10:00:00",
                "end_time": "2026-03-20T10:30:00",
                "timezone": "America/New_York",
                "recurrence_rule": "FREQ=WEEKLY;BYDAY=MO,WE,FR",
            })
            print(f"\nCreated event: {result.content[0].text}")

            # Calendar: list events
            result = await session.call_tool("list_calendar_events", {"limit": 5})
            print(f"\nCalendar events: {result.content[0].text}")

            # Storage: store a document
            result = await session.call_tool("store_document", {
                "collection": "notes",
                "data": {"title": "Meeting Notes", "content": "Discussed Q2 roadmap..."},
                "metadata": {"type": "meeting"},
            })
            print(f"\nStored document: {result.content[0].text}")

            # Storage: RAG query
            result = await session.call_tool("ask_storage", {
                "question": "What was discussed about the roadmap?",
            })
            print(f"\nRAG answer: {result.content[0].text}")

            # Schedule an email
            result = await session.call_tool("schedule_email", {
                "send_at": "2026-03-20T09:00:00Z",
                "to": ["recipient@example.com"],
                "subject": "Reminder",
                "body_text": "Don't forget the meeting today!",
            })
            print(f"\nScheduled email: {result.content[0].text}")


if __name__ == "__main__":
    asyncio.run(main())
