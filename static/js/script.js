const textInput =
    document.getElementById("textInput");

const charCount =
    document.getElementById("charCount");

const generateButton =
    document.getElementById("generateButton");

const status =
    document.getElementById("ttsStatus");

const result =
    document.getElementById("ttsResult");

const audioPlayer =
    document.getElementById("audioPlayer");

const downloadButton =
    document.getElementById("downloadButton");


// ==========================================
// Character Counter
// ==========================================

textInput.addEventListener(
    "input",
    () => {

        const length =
            textInput.value.length;

        charCount.textContent =
            `${length} / 5000`;

    }
);


// ==========================================
// Generate Audio
// ==========================================

generateButton.addEventListener(
    "click",
    async () => {

        const text =
            textInput.value.trim();


        if (!text) {

            status.textContent =
                "ابتدا یک متن وارد کنید.";

            return;

        }


        generateButton.disabled = true;

        status.textContent =
            "در حال ساخت فایل صوتی...";


        result.classList.add(
            "hidden"
        );


        try {

            const response =
                await fetch(
                    "/generate",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            text: text
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "خطایی رخ داد."
                );

            }


            audioPlayer.src =
                data.audio_url;


            downloadButton.href =
                data.download_url;


            result.classList.remove(
                "hidden"
            );


            status.textContent =
                "فایل صوتی با موفقیت ساخته شد.";

        }

        catch (error) {

            status.textContent =
                "خطا در ساخت فایل صوتی.";

            console.error(error);

        }

        finally {

            generateButton.disabled =
                false;

        }

    }
);