# Assistants API Beta

The Assistants API allows you to build AI assistants within your own applications. An Assistant has instructions and can leverage models, tools, and knowledge to respond to user queries. The Assistants API currently supports three types of tools: Code Interpreter, Retrieval, and Function calling. In the future, we plan to release more OpenAI-built tools, and allow you to provide your own tools on our platform.

You can explore the capabilities of the Assistants API using the Assistants playground or by building a step-by-step integration outlined in this guide. At a high level, a typical integration of the Assistants API has the following flow:

1. Create an Assistant in the API by defining its custom instructions and picking a model. If helpful, enable tools like Code Interpreter, Retrieval, and Function calling.
2. Create a Thread when a user starts a conversation.
3. Add Messages to the Thread as the user ask questions.
4. Run the Assistant on the Thread to trigger responses. This automatically calls the relevant tools.

The Assistants API is in beta and we are actively working on adding more functionality. Share your feedback in our Developer Forum!

Calls to the Assistants API require that you pass a beta HTTP header. This is handled automatically if you’re using OpenAI’s official Python or Node.js SDKs.

`OpenAI-Beta: assistants=v1`

This starter guide walks through the key steps to create and run an Assistant that uses Code Interpreter.

## Assistants playground

In addition to the Assistants API, we also provide an Assistants playground (sign in required). The playground is a great way to explore the capabilities of the Assistants API and learn how to build your own Assistant without writing any code.

### Step 1: Create an Assistant

An Assistant represents an entity that can be configured to respond to users’ Messages using several parameters like:

- Instructions: how the Assistant and model should behave or respond
- Model: you can specify any GPT-3.5 or GPT-4 models, including fine-tuned models. The Retrieval tool requires gpt-3.5-turbo-1106 and gpt-4-1106-preview models.
- Tools: the API supports Code Interpreter and Retrieval that are built and hosted by OpenAI.
- Functions: the API allows you to define custom function signatures, with similar behavior as our function calling feature.

In this example, we're creating an Assistant that is a personal math tutor, with the Code Interpreter tool enabled.

```python
assistant = client.beta.assistants.create(
    name="Math Tutor",
    instructions="You are a personal math tutor. Write and run code to answer math questions.",
    tools=[{"type": "code_interpreter"}],
    model="gpt-4-1106-preview"
)
```

## Step 2: Create a Thread

A Thread represents a conversation. We recommend creating one Thread per user as soon as the user initiates the conversation. Pass any user-specific context and files in this thread by creating Messages.

```python
thread = client.beta.threads.create()
```

Threads don’t have a size limit. You can add as many Messages as you want to a Thread. The Assistant will ensure that requests to the model fit within the maximum context window, using relevant optimization techniques such as truncation which we have tested extensively with ChatGPT. When you use the Assistants API, you delegate control over how many input tokens are passed to the model for any given Run, this means you have less control over the cost of running your Assistant in some cases but do not have to deal with the complexity of managing the context window yourself.

## Step 3: Add a Message to a Thread

A Message contains text, and optionally any files that you allow the user to upload. Messages need to be added to a specific Thread. Adding images via message objects like in Chat Completions using GPT-4 with Vision is not supported today, but we plan to add support for them in the coming months. You can still upload images and have them processed via retrieval.

```python

message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="I need to solve the equation `3x + 11 = 14`. Can you help me?"
)
```

Now if you list the Messages in a Thread, you will see that this message has been appended.

```json

{
  "object": "list",
  "data": [
    {
      "created_at": 1696995451,
      "id": "msg_abc123",
      "object": "thread.message",
      "thread_id": "thread_abc123",
      "role": "user",
      "content": [{
        "type": "text",
        "text": {
          "value": "I need to solve the equation `3x + 11 = 14`. Can you help me?",
          "annotations": []
        }
      }],
    ...
}
```

## Step 4: Run the Assistant

For the Assistant to respond to the user message, you need to create a Run. This makes the Assistant read the Thread and decide whether to call tools (if they are enabled) or simply use the model to best answer the query. As the run progresses, the assistant appends Messages to the thread with the role="assistant". The Assistant will also automatically decide what previous Messages to include in the context window for the model. This has both an impact on pricing as well as model performance. The current approach has been optimized based on what we learned building ChatGPT and will likely evolve over time.

You can optionally pass additional instructions to the Assistant while creating the Run but note that these instructions override the default instructions of the Assistant.

```python

run = client.beta.threads.runs.create(
  thread_id=thread.id,
  assistant_id=assistant.id,
  instructions="Please address the user as Jane Doe. The user has a premium account."
)
```

## Step 5: Check the Run status

By default, a Run goes into the queued state. You can periodically retrieve the Run to check on its status to see if it has moved to completed.

```python

run = client.beta.threads.runs.retrieve(
  thread_id=thread.id,
  run_id=run.id
)
```

## Step 6: Display the Assistant's Response

Once the Run completes, you can list the Messages added to the Thread by the Assistant.

```python

messages = client.beta.threads.messages.list(
  thread_id=thread.id
)
```

And finally, display them to the user! During this Run, the Assistant added two new Messages to the Thread. Here is an example of what that might look like:

ROLE CONTENT
user I need to solve the equation 3x + 11 = 14. Can you help me?
assistant Certainly, Jane Doe. To solve the equation (3x + 11 = 14) for (x), you'll want to isolate (x) on one side of the equation. Here's how you can do that:<br/>Subtract 11 from both sides of the equation to get (3x = 3).<br/>Then, divide both sides by 3 to solve for (x).<br/>Let me calculate the value of (x) for you.
assistant The solution to the equation (3x + 11 = 14) is (x = 1).
You can also retrieve the Run Steps of this Run if you'd like to explore or display the inner workings of the Assistant and its tools.

# How Assistants Work Beta

The Assistants API is designed to help developers build powerful AI assistants capable of performing a variety of tasks.

The Assistants API is in beta and we are actively working on adding more functionality. Share your feedback in our Developer Forum!

- Assistants can call OpenAI’s models with specific instructions to tune their personality and capabilities.
- Assistants can access multiple tools in parallel. These can be both OpenAI-hosted tools — like Code interpreter and Knowledge retrieval — or tools you build/host (via Function calling).
- Assistants can access persistent Threads. Threads simplify AI application development by storing message history and truncating it when the conversation gets too long for the model’s context length. You create a Thread once, and simply append Messages to it as your users reply.
- Assistants can access Files in several formats — either as part of their creation or as part of Threads between Assistants and users. When using tools, Assistants can also create files (e.g., images, spreadsheets, etc) and cite files they reference in the Messages they create.

## Objects

### Assistants Object Architecture Diagram

| OBJECT    | WHAT IT REPRESENTS                                                                                                                                                                                                           |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Assistant | Purpose-built AI that uses OpenAI’s models and calls tools                                                                                                                                                                   |
| Thread    | A conversation session between an Assistant and a user. Threads store Messages and automatically handle truncation to fit content into a model’s context.                                                                    |
| Message   | A message created by an Assistant or a user. Messages can include text, images, and other files. Messages stored as a list on the Thread.                                                                                    |
| Run       | An invocation of an Assistant on a Thread. The Assistant uses its configuration and the Thread’s Messages to perform tasks by calling models and tools. As part of a Run, the Assistant appends Messages to the Thread.      |
| Run Step  | A detailed list of steps the Assistant took as part of a Run. An Assistant can call tools or create Messages during its run. Examining Run Steps allows you to introspect how the Assistant is getting to its final results. |

## Creating Assistants

We recommend using OpenAI’s latest models with the Assistants API for best results and maximum compatibility with tools.

To get started, creating an Assistant only requires specifying the model to use. But you can further customize the behavior of the Assistant:

- Use the `instructions` parameter to guide the personality of the Assistant and define its goals. Instructions are similar to system messages in the Chat Completions API.
- Use the `tools` parameter to give the Assistant access to up to 128 tools. You can give it access to OpenAI-hosted tools like code_interpreter and retrieval, or call third-party tools via a function calling.
- Use the `file_ids` parameter to give the tools like code_interpreter and retrieval access to files. Files are uploaded using the File upload endpoint and must have the purpose set to assistants to be used with this API.

For example, to create an Assistant that can create data visualization based on a .csv file, first upload a file.

```python
file = client.files.create(
  file=open("speech.py", "rb"),
  purpose='assistants'
)
```

And then create the Assistant with the uploaded file.

```python

assistant = client.beta.assistants.create(
  name="Data visualizer",
  description="You are great at creating beautiful data visualizations. You analyze data present in .csv files, understand trends, and come up with data visualizations relevant to those trends. You also share a brief text summary of the trends observed.",
  model="gpt-4-1106-preview",
  tools=[{"type": "code_interpreter"}],
  file_ids=[file.id]
)
```

You can attach a maximum of 20 files per Assistant, and they can be at most 512 MB each. In addition, the size of all the files uploaded by your organization should not exceed 100GB. You can request an increase in this storage limit using our help center.

You can also use the AssistantFile object to create, delete, or view associations between Assistant and File objects. Note that deleting an AssistantFile doesn’t delete the original File object, it simply deletes the association between that File and the Assistant. To delete a File, use the File delete endpoint instead.

### Managing Threads and Messages

Threads and Messages represent a conversation session between an Assistant and a user. There is no limit to the number of Messages you can store in a Thread. Once the size of the Messages exceeds the context window of the model, the Thread will attempt to include as many messages as possible that fit in the context window and drop the oldest messages. Note that this truncation strategy may evolve over time.

You can create a Thread with an initial list of Messages like this:

```python

thread = client.beta.threads.create(
  messages=[
    {
      "role": "user",
      "content": "Create 3 data visualizations based on the trends in this file.",
      "file_ids": [file.id]
    }
  ]
)
```

Messages can contain text, images, or files. At the moment, user-created Messages cannot contain image files but we plan to add support for this in the future.

Message Annotations
Messages created by Assistants may contain annotations within the content array of the object. Annotations provide information around how you should annotate the text in the Message.

There are two types of Annotations:

file_citation: File citations are created by the retrieval tool and define references to a specific quote in a specific file that was uploaded and used by the Assistant to generate the response.
file_path: File path annotations are created by the code_interpreter tool and contain references to the files generated by the tool.
When annotations are present in the Message object, you'll see illegible model-generated substrings in the text that you should replace with the annotations. These strings may look something like 【13†source】 or sandbox:/mnt/data/file.csv. Here’s an example python code snippet that replaces these strings with information present in the annotations.

```python

# Retrieve the message object
message = client.beta.threads.messages.retrieve(
  thread_id="...",
  message_id="..."
)

# Extract the message content
message_content = message.content[0].text
annotations = message_content.annotations
citations = []

# Iterate over the annotations and add footnotes
for index, annotation in enumerate(annotations):
    # Replace the text with a footnote
    message_content.value = message_content.value.replace(annotation.text, f' [{index}]')

    # Gather citations based on annotation attributes
    if (file_citation := getattr(annotation, 'file_citation', None)):
        cited_file = client.files.retrieve(file_citation.file_id)
        citations.append(f'[{index}] {file_citation.quote} from {cited_file.filename}')
    elif (file_path := getattr(annotation, 'file_path', None)):
        cited_file = client.files.retrieve(file_path.file_id)
        citations.append(f'[{index}] Click <here> to download {cited_file.filename}')
        # Note: File download functionality not implemented above for brevity

# Add footnotes to the end of the message before displaying to user
message_content.value += '\n' + '\n'.join(citations)

```

## Runs and Run Steps

When you have all the context you need from your user in the Thread, you can run the Thread with an Assistant of your choice.

```python

run = client.beta.threads.runs.create(
  thread_id=thread.id,
  assistant_id=assistant.id
)
```

By default, a Run will use the model and tools configuration specified in Assistant object, but you can override most of these when creating the Run for added flexibility:

```python

run = client.beta.threads.runs.create(
  thread_id=thread.id,
  assistant_id=assistant.id,
  model="gpt-4-1106-preview",
  instructions="additional instructions",
  tools=[{"type": "code_interpreter"}, {"type": "retrieval"}]
)
```

Note: file_ids associated with the Assistant cannot be overridden during Run creation. You must use the modify Assistant endpoint to do this.

### Run Lifecycle

Run objects can have multiple statuses.

#### Run Lifecycle - Diagram Showing Possible Status Transitions

| STATUS          | DEFINITION                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| queued          | When Runs are first created or when you complete the required_action, they are moved to a queued status. They should almost immediately move to in_progress.                                                                                                                                                                                                                                          |
| in_progress     | While in_progress, the Assistant uses the model and tools to perform steps. You can view progress being made by the Run by examining the Run Steps.                                                                                                                                                                                                                                                   |
| completed       | The Run successfully completed! You can now view all Messages the Assistant added to the Thread, and all the steps the Run took. You can also continue the conversation by adding more user Messages to the Thread and creating another Run.                                                                                                                                                          |
| requires_action | When using the Function calling tool, the Run will move to a required_action state once the model determines the names and arguments of the functions to be called. You must then run those functions and submit the outputs before the run proceeds. If the outputs are not provided before the expires_at timestamp passes (roughly 10 mins past creation), the run will move to an expired status. |
| expired         | This happens when the function calling outputs were not submitted before expires_at and the run expires. Additionally, if the runs take too long to execute and go beyond the time stated in expires_at, our systems will expire the run.                                                                                                                                                             |
| cancelling      | You can attempt to cancel an in_progress run using the Cancel Run endpoint. Once the attempt to cancel succeeds, status of the Run moves to cancelled. Cancellation is attempted but not guaranteed.                                                                                                                                                                                                  |
| cancelled       | Run was successfully cancelled.                                                                                                                                                                                                                                                                                                                                                                       |
| failed          | You can view the reason for the failure by looking at the last_error object in the Run. The timestamp for the failure will be recorded under failed_at.                                                                                                                                                                                                                                               |

## Polling for Updates

In order to keep the status of your run up to date, you will have to periodically retrieve the Run object. You can check the status of the run each time you retrieve the object to determine what your application should do next. We plan to add support for streaming to make this simpler in the near future.

### Thread Locks

When a Run is in_progress and not in a terminal state, the Thread is locked. This means that:

- New Messages cannot be added to the Thread.
- New Runs cannot be created on the Thread.

## Run Steps

Run steps lifecycle - diagram showing possible status transitions

Run step statuses have the same meaning as Run statuses.

Most of the interesting detail in the Run Step object lives in the `step_details` field. There can be two types of step details:

- `message_creation`: This Run Step is created when the Assistant creates a Message on the Thread.
- `tool_calls`: This Run Step is created when the Assistant calls a tool. Details around this are covered in the relevant sections of the Tools guide.

## Data Access Guidance

Currently, assistants, threads, messages, and files created via the API are scoped to the entire organization. As such, any person with API key access to the organization is able to read or write assistants, threads, messages, and files in the organization.

We strongly recommend the following data access controls:

- Implement authorization. Before performing reads or writes on assistants, threads, messages, and files, ensure that the end-user is authorized to do so. For example, store in your database the object IDs that the end-user has access to, and check it before fetching the object ID with the API.
- Restrict API key access. Carefully consider who in your organization should have API keys and periodically audit this list. API keys enable a wide range of operations including reading and modifying sensitive information, such as messages and files.
- Create separate accounts. Consider creating separate accounts/organizations for different applications in order to isolate data across multiple applications.

## Limitations

During this beta, there are several known limitations we are looking to address in the coming weeks and months. We will publish a changelog on this page when we add support for additional functionality.

- Support for streaming output (including Messages and Run Steps).
- Support for notifications to share object status updates without the need for polling.
- Support for DALL·E as a tool.
- Support for user message creation with images.

# Tools Beta

Give Assistants access to OpenAI-hosted tools like Code Interpreter and Knowledge Retrieval, or build your own tools using Function calling. Usage of OpenAI-hosted tools comes at an additional fee — visit our help center article to learn more about how these tools are priced.

The Assistants API is in beta and we are actively working on adding more functionality. Share your feedback in our Developer Forum!

## Code Interpreter

Code Interpreter allows the Assistants API to write and run Python code in a sandboxed execution environment. This tool can process files with diverse data and formatting, and generate files with data and images of graphs. Code Interpreter allows your Assistant to run code iteratively to solve challenging code and math problems. When your Assistant writes code that fails to run, it can iterate on this code by attempting to run different code until the code execution succeeds.

### Enabling Code Interpreter

Pass the `code_interpreter` in the tools parameter of the Assistant object to enable Code Interpreter:

```python
assistant = client.beta.assistants.create(
  instructions="You are a personal math tutor. When asked a math question, write and run code to answer the question.",
  model="gpt-4-1106-preview",
  tools=[{"type": "code_interpreter"}]
)
```

The model then decides when to invoke Code Interpreter in a Run based on the nature of the user request. This behavior can be promoted by prompting in the Assistant's instructions (e.g., “write code to solve this problem”).

### Passing Files to Code Interpreter

Code Interpreter can parse data from files. This is useful when you want to provide a large volume of data to the Assistant or allow your users to upload their own files for analysis.

Files that are passed at the Assistant level are accessible by all Runs with this Assistant:

```python

# Upload a file with an "assistants" purpose
file = client.files.create(
  file=open("speech.py", "rb"),
  purpose='assistants'
)

# Create an assistant using the file ID
assistant = client.beta.assistants.create(
  instructions="You are a personal math tutor. When asked a math question, write and run code to answer the question.",
  model="gpt-4-1106-preview",
  tools=[{"type": "code_interpreter"}],
  file_ids=[file.id]
)
```

Files can also be passed at the Thread level. These files are only accessible in the specific Thread. Upload the File using the File upload endpoint and then pass the File ID as part of the Message creation request:

```python

thread = client.beta.threads.create(
  messages=[
    {
      "role": "user",
      "content": "I need to solve the equation `3x + 11 = 14`. Can you help me?",
      "file_ids": [file.id]
    }
  ]
)
```

Files have a maximum size of 512 MB. Code Interpreter supports a variety of file formats including .csv, .pdf, .json, and many more. More details on the file extensions (and their corresponding MIME-types) supported can be found in the Supported files section below.

### Reading Images and Files Generated by Code Interpreter

Code Interpreter in the API also outputs files, such as generating image diagrams, CSVs, and PDFs. There are two types of files that are generated:

- Images
- Data files (e.g., a CSV file with data generated by the Assistant)

When Code Interpreter generates an image, you can look up and download this file in the file_id field of the Assistant Message response:

```json

{
    "id": "msg_abc123",
    "object": "thread.message",
    "created_at": 1698964262,
    "thread_id": "thread_abc123",
    "role": "assistant",
    "content": [
    {
      "type": "image_file",
      "image_file": {
        "file_id": "file-abc123"
      }
    }
  ]
  # ...
}
```

The file content can then be downloaded by passing the file ID to the Files API:

```python

from openai import OpenAI

client = OpenAI()

image_data = client.files.content("file-abc123")
image_data_bytes = image_data.read()

with open("./my-image.png", "wb") as file:
    file.write(image_data_bytes)
```

When Code Interpreter references a file path (e.g., “Download this CSV file”), file paths are listed as annotations. You can convert these annotations into links to download the file:

```json

{
  "id": "msg_abc123",
  "object": "thread.message",
  "created_at": 1699073585,
  "thread_id": "thread_abc123",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": {
        "value": "The rows of the CSV file have been shuffled and saved to a new CSV file. You can download the shuffled CSV file from the following link:\n\n[Download Shuffled CSV File](sandbox:/mnt/data/shuffled_file.csv)",
        "annotations": [
          {
            "type": "file_path",
            "text": "sandbox:/mnt/data/shuffled_file.csv",
            "start_index": 167,
            "end_index": 202,
            "file_path": {
              "file_id": "file-abc123"
            }
          }
        ]
      }
    }
  ],
  "file_ids": [
    "file-abc456"
  ]
  # ...
}
```

### Input and Output Logs of Code Interpreter

By listing the steps of a Run that called Code Interpreter, you can inspect the code input and outputs logs of Code Interpreter:

```python

run_steps = client.beta.threads.runs.steps.list(
  thread_id=thread.id,
  run_id=run.id
)
```

## Knowledge Retrieval

Retrieval augments the Assistant with knowledge from outside its model, such as proprietary product information or documents provided by your users. Once a file is uploaded and passed to the Assistant, OpenAI will automatically chunk your documents, index and store the embeddings, and implement vector search to retrieve relevant content to answer user queries.

### Enabling Retrieval

Pass the retrieval in the tools parameter of the Assistant to enable Retrieval:

```python

assistant = client.beta.assistants.create(
  instructions="You are a customer support chatbot. Use your knowledge base to best respond to customer queries.",
  model="gpt-4-1106-preview",
  tools=[{"type": "retrieval"}]
)
```

### How it works

The model then decides when to retrieve content based on the user Messages. The Assistants API automatically chooses between two retrieval techniques:

- it either passes the file content in the prompt for short documents, or
- performs a vector search for longer documents

Retrieval currently optimizes for quality by adding all relevant content to the context of model calls. We plan to introduce other retrieval strategies to enable developers to choose a different tradeoff between retrieval quality and model usage cost.

### Uploading files for retrieval

Similar to Code Interpreter, files can be passed at the Assistant-level or at the Thread-level

```python

# Upload a file with an "assistants" purpose
file = client.files.create(
  file=open("knowledge.pdf", "rb"),
  purpose='assistants'
)

# Add the file to the assistant
assistant = client.beta.assistants.create(
  instructions="You are a customer support chatbot. Use your knowledge base to best respond to customer queries.",
  model="gpt-4-1106-preview",
  tools=[{"type": "retrieval"}],
  file_ids=[file.id]
)
```

Files can also be added to a Message in a Thread. These files are only accessible within this specific thread. After having uploaded a file, you can pass the ID of this File when creating the Message:

```python

message = client.beta.threads.messages.create(
  thread_id=thread.id,
  role="user",
  content="I can not find in the PDF manual how to turn off this device.",
  file_ids=[file.id]
)
```

Maximum file size is 512MB. Retrieval supports a variety of file formats including .pdf, .md, .docx and many more. More details on the file extensions (and their corresponding MIME-types) supported can be found in the Supported files section below.

### Deleting files

To remove a file from the assistant, you can detach the file from the assistant:

```python

file_deletion_status = client.beta.assistants.files.delete(
  assistant_id=assistant.id,
  file_id=file.id
)
```

Detaching the file from the assistant removes the file from the retrieval index as well.

### File citations

When Code Interpreter outputs file paths in a Message, you can convert them to corresponding file downloads using the annotations field. See the Annotations section for an example of how to do this.

```json
{
    "id": "msg_abc123",
    "object": "thread.message",
    "created_at": 1699073585,
    "thread_id": "thread_abc123",
    "role": "assistant",
    "content": [
      {
        "type": "text",
        "text": {
          "value": "The rows of the CSV file have been shuffled and saved to a new CSV file. You can download the shuffled CSV file from the following link:\n\n[Download Shuffled CSV File](sandbox:/mnt/data/shuffled_file.csv)",
          "annotations": [
            {
              "type": "file_path",
              "text": "sandbox:/mnt/data/shuffled_file.csv",
              "start_index": 167,
              "end_index": 202,
              "file_path": {
                "file_id": "file-abc123"
              }
            }
          ]
        }
      }
    ],
    "file_ids": [
      "file-abc456"
    ],
        ...
  },

```

## Function Calling

Similar to the Chat Completions API, the Assistants API supports function calling. Function calling allows you to describe functions to the Assistants and have it intelligently return the functions that need to be called along with their arguments. The Assistants API will pause execution during a Run when it invokes functions, and you can supply the results of the function call back to continue the Run execution.

### Defining Functions

First, define your functions when creating an Assistant:

```python
assistant = client.beta.assistants.create(
  instructions="You are a weather bot. Use the provided functions to answer questions.",
  model="gpt-4-1106-preview",
  tools=[{
      "type": "function",
      "function": {
        "name": "getCurrentWeather",
        "description": "Get the weather in location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {"type": "string", "description": "The city and state e.g. San Francisco, CA"},
            "unit": {"type": "string", "enum": ["c", "f"]}
          },
          "required": ["location"]
        }
      }
    }, {
      "type": "function",
      "function": {
        "name": "getNickname",
        "description": "Get the nickname of a city",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {"type": "string", "description": "The city and state e.g. San Francisco, CA"}
          },
          "required": ["location"]
        }
      }
    }]
)
```

### Reading the Functions Called by the Assistant

When you initiate a Run with a user Message that triggers the function, the Run will enter a pending status. After it processes, the run will enter a requires_action state which you can verify by retrieving the Run. The model can provide multiple functions to call at once using parallel function calling:

```json

{
  "id": "run_abc123",
  "object": "thread.run",
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "status": "requires_action",
  "required_action": {
    "type": "submit_tool_outputs",
    "submit_tool_outputs": {
      "tool_calls": [
        {
          "id": "call_abc123",
          "type": "function",
          "function": {
            "name": "getCurrentWeather",
            "arguments": "{\"location\":\"San Francisco\"}"
          }
        },
        {
          "id": "call_abc456",
          "type": "function",
          "function": {
            "name": "getNickname",
            "arguments": "{\"location\":\"Los Angeles\"}"
          }
        }
      ]
    }
  }
  # ...
}
```

### Submitting Functions Outputs

You can then complete the Run by submitting the tool output from the function(s) you call. Pass the tool_call_id referenced in the required_action object above to match output to each function call.

```python

run = client.beta.threads.runs.submit_tool_outputs(
  thread_id=thread.id,
  run_id=run.id,
  tool_outputs=[
    {
      "tool_call_id": call_ids[0],
      "output": "22C"
    },
    {
      "tool_call_id": call_ids[1],
      "output": "LA"
    }
  ]
)
```

After submitting outputs, the run will enter the queued state before it continues its execution.

Supported Files

- `.c` - MIME Type: `text/x-c`
- `.cpp` - MIME Type: `text/x-c++`
- `.csv` - MIME Type: `application/csv`
- `.docx` - MIME Type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- `.html` - MIME Type: `text/html`
- `.java` - MIME Type: `text/x-java`
- `.json` - MIME Type: `application/json`
- `.md` - MIME Type: `text/markdown`
- `.pdf` - MIME Type: `application/pdf`
- `.php` - MIME Type: `text/x-php`
- `.pptx` - MIME Type: `application/vnd.openxmlformats-officedocument.presentationml.presentation`
- `.py` - MIME Type: `text/x-python`
- `.py` - MIME Type: `text/x-script.python`
- `.rb` - MIME Type: `text/x-ruby`
