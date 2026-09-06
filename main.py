from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from gtts import gTTS

import os
import uuid


app = FastAPI(
    title="Synax AI",
    version="0.1.0"
)


GENERATED_FOLDER = "generated"
STATIC_FOLDER = "static"


os.makedirs(GENERATED_FOLDER, exist_ok=True)


app.mount(
    "/static",
    StaticFiles(directory=STATIC_FOLDER),
    name="static"
)


class TTSRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return FileResponse(
        f"{STATIC_FOLDER}/index.html"
    )


@app.post("/generate")
def generate_audio(request: TTSRequest):

    text = request.text.strip()

    if not text:
        return {
            "error": "Text is empty."
        }

    filename = f"{uuid.uuid4()}.mp3"

    filepath = os.path.join(
        GENERATED_FOLDER,
        filename
    )

    tts = gTTS(
        text=text,
        lang="en"
    )

    tts.save(filepath)

    return {
        "audio_url": f"/audio/{filename}",
        "download_url": f"/download/{filename}"
    }


@app.get("/audio/{filename}")
def get_audio(filename: str):

    filepath = os.path.join(
        GENERATED_FOLDER,
        filename
    )

    return FileResponse(
        filepath,
        media_type="audio/mpeg"
    )


@app.get("/download/{filename}")
def download_audio(filename: str):

    filepath = os.path.join(
        GENERATED_FOLDER,
        filename
    )

    return FileResponse(
        filepath,
        media_type="audio/mpeg",
        filename=filename
    )