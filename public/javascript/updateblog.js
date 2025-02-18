document.addEventListener("DOMContentLoaded", function () {
    if (typeof window.ImageResize === "undefined") {
        console.error("❌ ImageResize module not found.");
    } else {
        console.log("✅ ImageResize module registered successfully!");
    }


   
    var quill = new Quill("#editor-container", {
        theme: "snow",
        placeholder: "Edit your blog content...",
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

    // ✅ Load existing content
    const existingContent = document.getElementById("contentInput").value;
    quill.root.innerHTML = existingContent;

    // ✅ Detect and add inputs for images without links
    function updateImageLinkInputs() {
        const contentImages = quill.root.querySelectorAll("img");
        const linkURLContainer = document.getElementById("link-url-container");

        // Clear previous inputs
        linkURLContainer.innerHTML = "";

        contentImages.forEach((img, index) => {
            let parentLink = img.closest("a");
            let imgSrc = img.getAttribute("src");

            let inputGroup = document.createElement("div");
            inputGroup.classList.add("link-url-input-group", "mb-3");

            let label = document.createElement("label");
            label.textContent = `Image ${index + 1} Link:`;
            label.classList.add("block", "text-sm", "font-medium");

            let input = document.createElement("input");
            input.type = "text";
            input.classList.add("w-full", "border", "border-gray-300", "rounded-md", "p-2");
            input.value = parentLink ? parentLink.href : "";

            // ✅ Handle link input changes
            input.addEventListener("input", function () {
                if (input.value.trim()) {
                    if (!parentLink) {
                        let newLink = document.createElement("a");
                        newLink.href = input.value;
                        newLink.target = "_blank";

                        // Wrap the image inside the link
                        img.parentNode.insertBefore(newLink, img);
                        newLink.appendChild(img);
                    } else {
                        parentLink.href = input.value;
                    }
                } else {
                    // If input is cleared, remove the link
                    if (parentLink) {
                        parentLink.parentNode.insertBefore(img, parentLink);
                        parentLink.remove();
                    }
                }
            });

            inputGroup.appendChild(label);
            inputGroup.appendChild(input);
            linkURLContainer.appendChild(inputGroup);
        });
    }

    // ✅ Run update function on Quill content change
    quill.on("text-change", updateImageLinkInputs);
    updateImageLinkInputs(); // Run on page load

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
                    updateImageLinkInputs();
                } else {
                    alert("Image upload failed.");
                }
            } catch (error) {
                console.error("Image Upload Failed:", error);
            }
        };
    }

    
    // ✅ SEO Analysis Functionality
    const titleInput = document.querySelector('input[name="title"]');
    const titleTagInput = document.querySelector('input[name="titleTag"]'); // NEW: Title tag input
    const slugInput = document.querySelector('input[name="customSlug"]'); // NEW: Slug input
    const metaInput = document.querySelector('input[name="metaDescription"]');

    // ✅ Add Keyword Input to SEO Analysis Section
    const keywordInput = document.createElement("input");
    keywordInput.type = "text";
    keywordInput.placeholder = "Enter your focus keyword";
    keywordInput.classList.add("w-full", "border", "border-gray-300", "rounded-md", "p-2", "mb-3");

    // Insert keyword input above SEO Analysis list
    document.querySelector("#seo-analysis").insertAdjacentElement("afterbegin", keywordInput);

    function updateSEOAnalysis() {
        const title = titleInput.value.trim();
        const meta = metaInput.value.trim();
        const content = quill.root.innerHTML;
        const keyword = keywordInput.value.trim().toLowerCase();

        document.getElementById("seo-title").innerHTML = `Title: <span class="${title.length >= 50 && title.length <= 60 ? 'text-green-600' : 'text-red-600'}">${title.length} characters</span>`;
        document.getElementById("seo-meta").innerHTML = `Meta Description: <span class="${meta.length >= 150 && meta.length <= 160 ? 'text-green-600' : 'text-red-600'}">${meta.length} characters</span>`;

        const words = quill.getText().split(/\s+/).length;
        let keywordCount = 0;

        if (keyword) {
            const regex = new RegExp(`\\b${keyword}\\b`, "gi");
            keywordCount = (quill.getText().match(regex) || []).length;
        }

        let keywordDensity = ((keywordCount / words) * 100).toFixed(2);
        document.getElementById("seo-keywords").innerHTML = `Keyword Density: <span class="${keywordDensity >= 2 && keywordDensity <= 3 ? 'text-green-600' : 'text-red-600'}">${keywordDensity}%</span>`;

        let readabilityScore = calculateReadability(quill.getText());
        document.getElementById("seo-readability").innerHTML = `Readability Score: <span class="${readabilityScore >= 60 ? 'text-green-600' : 'text-red-600'}">${readabilityScore}</span>`;

        const links = content.match(/<a\s+href="([^"]*)"/g) || [];
        document.getElementById("seo-links").innerHTML = `Links: <span class="${links.length >= 1 ? 'text-green-600' : 'text-red-600'}">${links.length} links</span>`;

        const images = content.match(/<img\s+[^>]*alt="([^"]*)"/g) || [];
        document.getElementById("seo-images").innerHTML = `Images with Alt Text: <span class="${images.length >= 1 ? 'text-green-600' : 'text-red-600'}">${images.length} images</span>`;
    }

    titleInput.addEventListener("input", updateSEOAnalysis);
    titleTagInput.addEventListener("input", updateSEOAnalysis);
    slugInput.addEventListener("input", updateSEOAnalysis);
    metaInput.addEventListener("input", updateSEOAnalysis);
    keywordInput.addEventListener("input", updateSEOAnalysis);
    quill.on("text-change", updateSEOAnalysis);

    function calculateReadability(text) {
        const sentenceCount = (text.match(/[.!?]/g) || []).length;
        const wordCount = text.split(/\s+/).length;
        const syllableCount = text.match(/[aeiouy]{1,2}/g)?.length || 0;

        if (sentenceCount === 0 || wordCount === 0) return 0;

        const score = 206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (syllableCount / wordCount));
        return Math.round(score);
    }

    console.log("✅ SEO Analysis Enabled!");

    // ✅ Handle form submission
    document.getElementById("editBlogForm").onsubmit = function (event) {
        event.preventDefault();

        let formData = new FormData();
        formData.append("title", document.querySelector('input[name="title"]').value);
        formData.append("customSlug", document.querySelector('input[name="customSlug"]').value);
        formData.append("metaDescription", document.querySelector('input[name="metaDescription"]').value);
        formData.append("tags", document.querySelector('input[name="tags"]').value);
        formData.append("content", quill.root.innerHTML);
        formData.append("status", document.querySelector('select[name="status"]').value);
        formData.append("headerType", document.querySelector('select[name="headerType"]').value);
        formData.append("imageLink", document.querySelector('input[name="imageLink"]').value);

        let imageInput = document.querySelector('input[name="image"]');
        if (imageInput.files.length > 0) {
            formData.append("image", imageInput.files[0]);
        }

        fetch(document.getElementById("editBlogForm").action, { method: "PUT", body: formData })
            .then(response => response.json())
            .then(data => { window.location.href = `/blogs/${data.slug}`; })
            .catch(error => { alert("Update Failed!"); });
    };
});
