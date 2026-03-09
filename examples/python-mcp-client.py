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
                "to": "recipient@example.com",
                "subject": "Hello from my AI agent",
                "body": "This email was sent by an AI agent using Xobni.",
            })
            print(f"\nSend result: {result.content[0].text}")

            # Semantic search
            result = await session.call_tool("search_emails", {
                "query": "meeting notes from last week",
            })
            print(f"\nSearch results: {result.content[0].text}")


if __name__ == "__main__":
    asyncio.run(main())
