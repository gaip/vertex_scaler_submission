
import asyncio
import websockets
import google.auth
from google.cloud import aiplatform
import json

# --- Configuration ---
PROJECT_ID = "your-gcp-project-id"  # Replace with your GCP project ID
LOCATION = "us-central1"
MODEL_NAME = "gemini-1.5-pro-preview-0409"

# --- Authentication ---
creds, project = google.auth.default()
aiplatform.init(project=PROJECT_ID, location=LOCATION, credentials=creds)

async def send_audio_to_vertex(chat, websocket):
    """Receives audio from the client and sends it to Vertex AI."""
    while True:
        try:
            message = await websocket.recv()
            chat.send(
                aiplatform.gapic.StreamGenerateContentRequest(
                    parts=[{'inline_data': {'mime_type': 'audio/webm', 'data': message}}]
                )
            )
        except websockets.exceptions.ConnectionClosed:
            break

async def receive_responses_from_vertex(chat, websocket):
    """Receives responses from Vertex AI and sends them to the client."""
    while True:
        try:
            response = await chat.receive()
            if response.candidates:
                for candidate in response.candidates:
                    for part in candidate.content.parts:
                        if part.text:
                            await websocket.send(json.dumps({'text': part.text}))
                        elif part.inline_data:
                            await websocket.send(json.dumps({'audio': part.inline_data.data}))
        except StopAsyncIteration:
            break


async def proxy_to_vertex_ai(websocket, path):
    """
    Handles a WebSocket connection from a client, proxies audio to Vertex AI,
    and sends back transcriptions and AI responses.
    """
    print("Client connected.")
    try:
        # The first message from the client is the system instruction
        initial_message = await websocket.recv()
        initial_data = json.loads(initial_message)

        chat = aiplatform.gapic.GenerativeServiceClient().stream_generate_content()
        chat.send(
            aiplatform.gapic.StreamGenerateContentRequest(
                model=f"projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/{MODEL_NAME}",
                system_instruction={'parts': [{'text': initial_data['system_instruction']}]},
            )
        )

        send_task = asyncio.create_task(send_audio_to_vertex(chat, websocket))
        receive_task = asyncio.create_task(receive_responses_from_vertex(chat, websocket))

        await asyncio.gather(send_task, receive_task)

    except websockets.exceptions.ConnectionClosed as e:
        print(f"Connection closed: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        print("Client disconnected.")

async def main():
    """Starts the WebSocket server."""
    async with websockets.serve(proxy_to_vertex_ai, "localhost", 8765):
        print("WebSocket server started on ws://localhost:8765")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
