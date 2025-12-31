<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1gUV9vmmOoXAznXQ7vNdaUnvXF8MvCZGm

## Backend Setup

**Prerequisites:** Python 3.9+

1.  Navigate to the `backend` directory:
    `cd igniteflow_-the-generative-venture-studio/backend`
2.  Install the required Python dependencies:
    `pip install -r requirements.txt`
3.  **Authentication:** This application uses Application Default Credentials for authentication. Ensure you have the Google Cloud CLI installed and are authenticated:
    `gcloud auth application-default login`
4.  Update the `PROJECT_ID` in `server.py` to your Google Cloud project ID.
5.  Start the backend server:
    `python server.py`

## Run Locally

**Prerequisites:** Node.js

1.  Navigate to the `igniteflow_-the-generative-venture-studio` directory.
2.  Install dependencies:
    `npm install`
3.  Configure your Vertex AI project:
    - Create a file named `.env.local` in the `igniteflow_-the-generative-venture-studio` directory.
    - Add the following to your `.env.local` file:
        ```
        REACT_APP_VERTEX_AI_PROJECT_ID=YOUR_PROJECT_ID
        REACT_APP_VERTEX_AI_LOCATION=YOUR_LOCATION
        ```
4.  Run the app:
    `npm run dev`

Your application should now be running, with the frontend communicating with the backend for real-time AI features.
