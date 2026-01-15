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

// Klik area drop untuk pilih file
dropZone.onclick = () => fileInput.click();

// Tampilkan nama file saat dipilih
fileInput.onchange = () => {
    if (fileInput.files[0]) {
        fileNameDisplay.innerText = fileInput.files[0].name;
        fileNameDisplay.style.color = "#4285F4";
    }
};

async function uploadFile() {
    const file = fileInput.files[0];
    
    if (!file) {
        alert("Pilih file foto atau video terlebih dahulu!");
        return;
    }

    // Reset UI
    loader.classList.remove('hidden');
    resultBox.classList.add('hidden');
    btnUpload.disabled = true;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
        try {
            // Bersihkan Base64
            const base64Content = reader.result.split(',')[1];
            
            // Generate Nama File Random (agar tidak duplikat)
            const randomID = Math.random().toString(36).substring(2, 8);
            const cleanFileName = file.name.replace(/\s+/g, '-').toLowerCase();
            const finalFileName = `${randomID}_${cleanFileName}`;

            // Endpoint API GitHub
            const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/uploads/${finalFileName}`;

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Authorization": `token ${GITHUB_TOKEN.trim()}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: `Upload via SoraaHost: ${finalFileName}`,
                    content: base64Content
                })
            });

            const responseData = await response.json();

            if (response.ok) {
                // Link sesuai domain Vercel Anda
                const publicUrl = `https://hostsoraa.vercel.app/uploads/${finalFileName}`;
                resLink.value = publicUrl;
                resultBox.classList.remove('hidden');
                console.log("Berhasil Terunggah:", responseData);
            } else {
                // Logika Error Handling
                let errorMsg = responseData.message;
                if (response.status === 401) errorMsg = "Error bang.";
                if (response.status === 404) errorMsg = "Error bang";
                if (response.status === 403) errorMsg = "Error bang.";
                
                alert("Gagal Upload: " + errorMsg);
                console.error("Detail Error:", responseData);
            }

        } catch (error) {
            alert("Terjadi kesalahan koneksi!");
            console.error(error);
        } finally {
            loader.classList.add('hidden');
            btnUpload.disabled = false;
        }
    };

    reader.onerror = () => {
        alert("Gagal membaca file!");
        loader.classList.add('hidden');
        btnUpload.disabled = false;
    };
}

function copyLink() {
    resLink.select();
    resLink.setSelectionRange(0, 99999); // Untuk mobile
    
    navigator.clipboard.writeText(resLink.value)
        .then(() => alert("Link berhasil disalin ke clipboard!"))
        .catch(() => alert("Gagal menyalin link."));
}
