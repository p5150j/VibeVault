
import openai
import asyncio

async def main():
    openai.api_key = ''  # Replace with your actual API key

    print("Creating assistant...")
    assistant = await asyncio.to_thread(
        openai.beta.assistants.create,
        model="gpt-4-1106-preview",
        name="Math Tutor",
        instructions="You are a personal math tutor. Write and run code to answer math questions.",
        tools=[{"type": "code_interpreter"}]
    )

    print("Assistant created. Creating thread...")
    thread = await asyncio.to_thread(openai.beta.threads.create)

    print("Thread created. Adding message...")
    message = await asyncio.to_thread(
        openai.beta.threads.messages.create,
        thread_id=thread.id,
        role="user",
        content="I need to solve the equation `3x + 11 = 14`. Can you help me?"
    )

    print("Message added. Running assistant...")
    run = await asyncio.to_thread(
        openai.beta.threads.runs.create,
        thread_id=thread.id,
        assistant_id=assistant.id,
        instructions="Please address the user as Jane Doe. The user has a premium account."
    )

    print("Assistant run. Checking run status...")
    while True:
        run_status = await asyncio.to_thread(
            openai.beta.threads.runs.retrieve,
            thread_id=thread.id,
            run_id=run.id
        )
        print("Run status:", run_status.status)
        if run_status.status == "completed":
            break
        await asyncio.sleep(1)  # Non-blocking sleep

    print("Retrieving response...")
    response = await asyncio.to_thread(openai.beta.threads.messages.list, thread_id=thread.id)
    for msg in response.data:
        if msg.role == "assistant":
            print("Assistant's response:", msg.content)

if __name__ == "__main__":
    asyncio.run(main())
