const GITHUB_TOKEN = "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";
const REPO_OWNER = "depannPRIVATE";
const REPO_NAME = "host.soraa";

const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const resultBox = document.getElementById('result');
const resLink = document.getElementById('resLink');
const loader = document.getElementById('loader');
const btnUpload = document.getElementById('btnUpload');

dropZone.onclick = () => fileInput.click();

fileInput.onchange = () => {
    if (fileInput.files[0]) {
        fileNameDisplay.innerText = fileInput.files[0].name;
    }
};

async function uploadFile() {
    const file = fileInput.files[0];
    if (!file) return alert("Pilih file dulu!");

    loader.classList.remove('hidden');
    resultBox.classList.add('hidden');
    btnUpload.disabled = true;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
        try {
            const base64Content = reader.result.split(',')[1];
            const randomID = Math.random().toString(36).substring(2, 8);
            const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const finalFileName = `${randomID}_${cleanName}`;

            // Path harus mengarah ke folder 'uploads/'
            const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/uploads/${finalFileName}`;

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Authorization": `token ${GITHUB_TOKEN.trim()}`,
                    "Content-Type": "application/json",
                    "Accept": "application/vnd.github.v3+json"
                },
                body: JSON.stringify({
                    message: `Upload via SoraaHost: ${finalFileName}`,
                    content: base64Content
                })
            });

            const data = await response.json();

            if (response.status === 201 || response.ok) {
                // Gunakan link vercel Anda
                const publicUrl = `https://hostsoraa.vercel.app/uploads/${finalFileName}`;
                resLink.value = publicUrl;
                resultBox.classList.remove('hidden');
            } else {
                alert("Error GitHub: " + data.message);
                console.log(data);
            }
        } catch (err) {
            alert("Kesalahan Jaringan!");
            console.error(err);
        } finally {
            loader.classList.add('hidden');
            btnUpload.disabled = false;
        }
    };
}

function copyLink() {
    resLink.select();
    document.execCommand("copy");
    alert("Link disalin!");
}
