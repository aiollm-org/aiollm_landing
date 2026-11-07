export const examples = [
  {
    id: 'gen',
    label: 'generate.py',
    code: 'import asyncio\n\nfrom aiollm.providers.openai import OpenAIClient\n\n\nasync def main() -> None:\n    async with OpenAIClient() as client:  # OPENAI_API_KEY\n        response = await client.generation.create(\n            model="gpt-6-astra",\n            input="Explain asyncio in one line",\n            instructions="Be brief",\n            max_output_tokens=64,\n        )\n\n    print(response.text)\n    print(response.usage)  # shared TokenUsage\n    print(response.raw)    # OpenAI\'s own Response\n\n\nasyncio.run(main())',
    caption: {
      lead: 'Swap in ',
      highlight: 'AnthropicClient',
      tail: ' and the call stays the same.',
    },
  },
  {
    id: 'stream',
    label: 'stream.py',
    code: 'from aiollm.providers.anthropic import AnthropicClient\n\n\nasync def tell(client: AnthropicClient) -> str:\n    text = ""\n    async with client.generation.stream(\n        model="claude-opus-5-5",\n        input="Tell me about hexagons",\n    ) as events:\n        async for delta in events.text():\n            text += delta\n        completed = await events.final()\n\n    print(completed.usage, completed.incomplete_reason)\n    return text',
    caption: {
      lead: 'A stream cut before its ',
      highlight: 'CompletedEvent',
      tail: ' raises instead of looking complete.',
    },
  },
  {
    id: 'own',
    label: 'your_api.py',
    code: 'from pydantic import MISSING\n\nfrom aiollm import BaseAPIMethod, BaseAPIType, BodyFormat\n\n\nclass Completion(BaseAPIType):\n    id: str\n    text: str\n\n\nclass CreateCompletion(BaseAPIMethod[Completion]):\n    __request_path__ = "/completions"\n    __request_method__ = "POST"\n    __request_body_format__ = BodyFormat.JSON\n    __retryable__ = True\n\n    model: str\n    prompt: str\n    temperature: float | MISSING = MISSING  # left out until given\n\n\ncompletion = await session.send_request(\n    CreateCompletion(model="example-1", prompt="Hello!")\n)  # completion: Completion',
    caption: {
      lead: 'Any HTTP API: a method is a Pydantic model, its generic argument is the result.',
      highlight: '',
      tail: '',
    },
  },
] as const;

export const providerExample =
  'from typing import Any\n\nfrom aiollm import GenerationResponse, IGenerationClient\n\n\nasync def summarize(\n    client: IGenerationClient,  # OpenAI, Anthropic, yours\n    model: str,  # choose a model for this provider\n    text: str,\n) -> GenerationResponse[Any]:\n    return await client.generation.create(\n        model=model,\n        input=text,\n        instructions="Summarize in two sentences",\n        max_output_tokens=200,\n        timeout=30,\n    )';

export const installCommand =
  'pip install git+https://github.com/GrehBan/aiollm.git';

export const structuredExample = `from typing import Any

from aiollm import Effort, GenerationResponse, IGenerationClient


async def extract_summary(
    client: IGenerationClient,
    model: str,
    text: str,
) -> GenerationResponse[Any]:
    return await client.generation.create(
        model=model,
        input=text,
        instructions="Summarize the supplied text.",
        effort=Effort.MEDIUM,
        output_schema={
            "type": "object",
            "properties": {
                "summary": {"type": "string"},
            },
            "required": ["summary"],
            "additionalProperties": False,
        },
        max_output_tokens=1024,
    )`;

export const checkedStreamExample = `from typing import Any

from aiollm import CompletedEvent, IGenerationClient


async def stream_answer(
    client: IGenerationClient,
    model: str,
) -> CompletedEvent[Any]:
    async with client.generation.stream(
        model=model,
        input="Explain asynchronous iterators.",
    ) as events:
        async for delta in events.text():
            print(delta, end="", flush=True)

        # The final event includes usage and stop details.
        return await events.final()`;

export const toolsExample = `import json
from typing import Any

from aiollm import (
    GenerationResponse,
    IGenerationClient,
    InputItem,
    Tool,
    ToolResult,
    Turn,
)

WEATHER = Tool(
    name="get_weather",
    description="Current weather in a city.",
    parameters={
        "type": "object",
        "properties": {"city": {"type": "string"}},
        "required": ["city"],
        "additionalProperties": False,
    },
    strict=True,
)


def get_weather(city: str) -> str:
    return json.dumps({"city": city, "celsius": 15})


async def ask_with_tools(
    client: IGenerationClient,
    model: str,
    question: str,
) -> GenerationResponse[Any]:
    conversation: list[InputItem] = [Turn.user(question)]
    while True:
        response = await client.generation.create(
            model=model, input=conversation, tools=[WEATHER]
        )
        if not response.tool_calls:
            return response
        conversation.append(response.to_turn())
        for call in response.tool_calls:
            arguments = call.parse_arguments()
            output = get_weather(str(arguments["city"]))
            conversation.append(
                ToolResult(call_id=call.id, output=output)
            )`;
