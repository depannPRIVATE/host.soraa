const GITHUB_TOKEN = "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";
const REPO_OWNER = "depannPRIVATE";
const REPO_NAME = "host.soraa";

const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');

dropZone.onclick = () => fileInput.click();
fileInput.onchange = () => {
    if (fileInput.files[0]) document.getElementById('fileNameDisplay').innerText = fileInput.files[0].name;
};

async function uploadFile() {
    const file = fileInput.files[0];
    if (!file) return;

    document.getElementById('loader').classList.remove('hidden');
    const btn = document.getElementById('btnUpload');
    btn.disabled = true;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const content = reader.result.split(',')[1];
        const fileName = Math.random().toString(36).substring(2, 10) + "_" + file.name.replace(/\s/g, '-');
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/uploads/${fileName}`;

        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: { "Authorization": `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Upload", content: content })
            });

            if (res.ok) {
                const link = `https://hostsoraa.vercel.app/uploads/${fileName}`;
                document.getElementById('resLink').value = link;
                document.getElementById('result').classList.remove('hidden');
            }
        } finally {
            document.getElementById('loader').classList.add('hidden');
            btn.disabled = false;
        }
    };
}

function copyLink() {
    const copyText = document.getElementById("resLink");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
}
