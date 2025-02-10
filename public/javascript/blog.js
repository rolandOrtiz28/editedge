document.addEventListener("DOMContentLoaded", function () {
    // ✅ Initialize Quill Editor
    var quill = new Quill("#editor-container", {
        theme: "snow",
        placeholder: "Write your blog content here...",
        modules: {
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["blockquote", "code-block"],
                    [{ script: "sub" }, { script: "super" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ direction: "rtl" }],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    ["link", "image", "video"],
                    ["clean"]
                ],
                handlers: {
                    image: imageHandler
                }
            },
            imageResize: {}
        }
    });

    console.log("✅ Quill initialized successfully!");

    // ✅ Floating input box for editing image links
    const linkInputBox = document.createElement("div");
    linkInputBox.innerHTML = `
        <input type="text" id="image-link-input" placeholder="Enter link..." 
            class="border p-2 rounded-md shadow-sm w-64">
        <button id="save-link-btn" class="bg-blue-500 text-white p-1 rounded">Save</button>
    `;
    linkInputBox.style.position = "absolute";
    linkInputBox.style.display = "none";
    linkInputBox.style.background = "white";
    linkInputBox.style.border = "1px solid #ccc";
    linkInputBox.style.padding = "5px";
    linkInputBox.style.zIndex = "1000";
    document.body.appendChild(linkInputBox);

    let selectedImage = null;

    // ✅ Handle Image Click - Show Link Input
    quill.root.addEventListener("click", function (event) {
        if (event.target.tagName === "IMG") {
            selectedImage = event.target;

            // Check if the image is inside an <a> tag
            let parentLink = selectedImage.closest("a");
            document.getElementById("image-link-input").value = parentLink ? parentLink.href : "";

            // Position input box near image
            let rect = selectedImage.getBoundingClientRect();
            linkInputBox.style.top = `${rect.top + window.scrollY + rect.height + 5}px`;
            linkInputBox.style.left = `${rect.left + window.scrollX}px`;
            linkInputBox.style.display = "block";
        } else {
            linkInputBox.style.display = "none"; // Hide input box when clicking elsewhere
        }
    });

    // ✅ Save Image Link
    document.getElementById("save-link-btn").addEventListener("click", function () {
        let link = document.getElementById("image-link-input").value.trim();

        if (selectedImage) {
            if (link) {
                let parentLink = selectedImage.closest("a");
                if (!parentLink) {
                    let newLink = document.createElement("a");
                    newLink.href = link;
                    newLink.target = "_blank";
                    selectedImage.parentNode.insertBefore(newLink, selectedImage);
                    newLink.appendChild(selectedImage);
                } else {
                    parentLink.href = link;
                }
            } else {
                let parentLink = selectedImage.closest("a");
                if (parentLink) {
                    parentLink.parentNode.insertBefore(selectedImage, parentLink);
                    parentLink.remove();
                }
            }
        }

        linkInputBox.style.display = "none";
    });

    // ✅ Handle Image Upload
    function imageHandler() {
        let input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async function () {
            let file = input.files[0];
            let formData = new FormData();
            formData.append("image", file);

            try {
                let response = await fetch("/upload", {
                    method: "POST",
                    body: formData
                });

                let data = await response.json();
                if (data.url) {
                    let range = quill.getSelection();
                    quill.insertEmbed(range.index, "image", data.url);
                } else {
                    alert("Image upload failed.");
                }
            } catch (error) {
                console.error("Image Upload Failed:", error);
            }
        };
    }

    // ✅ SEO Analysis
    const titleInput = document.querySelector('input[name="title"]');
    const titleTagInput = document.querySelector('input[name="titleTag"]');
    const slugInput = document.querySelector('input[name="customSlug"]');
    const metaInput = document.querySelector('input[name="metaDescription"]');
    const keywordInput = document.createElement("input");

    keywordInput.type = "text";
    keywordInput.placeholder = "Enter focus keyword";
    keywordInput.classList.add("border", "p-2", "rounded-md", "w-full", "mb-3");
    document.querySelector("#seo-analysis").insertAdjacentElement("afterbegin", keywordInput);

    function updateSEOAnalysis() {
        const title = titleInput.value.trim();
        const meta = metaInput.value.trim();
        const content = quill.root.innerHTML;
        const keyword = keywordInput.value.trim().toLowerCase();
        const words = quill.getText().split(/\s+/).length;
        let keywordCount = (quill.getText().match(new RegExp(`\\b${keyword}\\b`, "gi")) || []).length;
        let keywordDensity = ((keywordCount / words) * 100).toFixed(2);

        document.getElementById("seo-title").innerHTML = `Title: <span class="${title.length >= 50 && title.length <= 60 ? 'text-green-600' : 'text-red-600'}">${title.length} characters</span>`;
        document.getElementById("seo-meta").innerHTML = `Meta: <span class="${meta.length >= 150 && meta.length <= 160 ? 'text-green-600' : 'text-red-600'}">${meta.length} characters</span>`;
        document.getElementById("seo-keywords").innerHTML = `Keyword Density: <span class="${keywordDensity >= 2 && keywordDensity <= 3 ? 'text-green-600' : 'text-red-600'}">${keywordDensity}%</span>`;
        document.getElementById("seo-readability").innerHTML = `Readability: <span class="${calculateReadability(quill.getText()) >= 60 ? 'text-green-600' : 'text-red-600'}">${calculateReadability(quill.getText())}</span>`;
    }

    function calculateReadability(text) {
        const sentenceCount = (text.match(/[.!?]/g) || []).length;
        const wordCount = text.split(/\s+/).length;
        const syllableCount = text.match(/[aeiouy]{1,2}/g)?.length || 0;
        return sentenceCount === 0 || wordCount === 0 ? 0 : Math.round(206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (syllableCount / wordCount)));
    }

    titleInput.addEventListener("input", updateSEOAnalysis);
    titleTagInput.addEventListener("input", updateSEOAnalysis);
    slugInput.addEventListener("input", updateSEOAnalysis);
    metaInput.addEventListener("input", updateSEOAnalysis);
    keywordInput.addEventListener("input", updateSEOAnalysis);
    quill.on("text-change", updateSEOAnalysis);

    // ✅ Handle Form Submission
    document.getElementById("blogForm").onsubmit = function (event) {
        event.preventDefault();
        let formData = new FormData();
        formData.append("title", titleInput.value);
        formData.append("titleTag", titleTagInput.value);
        formData.append("customSlug", slugInput.value);
        formData.append("metaDescription", metaInput.value);
        formData.append("tags", document.querySelector('input[name="tags"]').value);
        formData.append("content", quill.root.innerHTML);
        formData.append("status", document.activeElement.value);

        fetch("/blogs", { method: "POST", body: formData })
        .then(response => response.json())
        .then(data => { if (data.success) { window.location.href = `/blogs/${data.slug}`; } })
        .catch(error => alert("Error: " + error));
    };
});
