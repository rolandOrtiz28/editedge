document.addEventListener("DOMContentLoaded", function () {
    // ✅ Ensure ImageResize is Loaded
    if (typeof window.ImageResize === "undefined") {
        console.error("❌ ImageResize module not found.");
    } else {
        console.log("✅ ImageResize module registered successfully!");
    }

    // ✅ Initialize Quill with Custom Toolbar
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
                    image: imageHandler // ✅ Custom Image Upload Handler with Links
                }
            },
            imageResize: {} // ✅ Enable Image Resizing
        }
    });

    console.log("✅ Quill initialized successfully!");

    // ✅ Set Quill Content to Existing Blog Content
    const existingContent = document.getElementById("contentInput").value;
    quill.root.innerHTML = existingContent;

    // ✅ Handle Image Upload & Linking in the Text Editor
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
                    let link = prompt("Enter a URL for the image (optional):");

                    let range = quill.getSelection();
                    if (link) {
                        // ✅ Insert Image Inside a Link
                        let imageHTML = `<a href="${link}" target="_blank"><img src="${data.url}" alt="Linked Image" /></a>`;
                        quill.clipboard.dangerouslyPasteHTML(range.index, imageHTML);
                    } else {
                        // ✅ Insert Image Without Link
                        quill.insertEmbed(range.index, "image", data.url);
                    }
                } else {
                    alert("Image upload failed.");
                }
            } catch (error) {
                console.error("Image Upload Failed:", error);
            }
        };
    }

    // ✅ Handle Form Submission with Loader
    document.getElementById("editBlogForm").onsubmit = function (event) {
        event.preventDefault();

        // ✅ Select Update Button & Loading State
        let updateBtn = document.querySelector('button[type="submit"]');
        let originalText = updateBtn.innerHTML;
        updateBtn.innerHTML = `<span class="spinner"></span> Updating...`;
        updateBtn.disabled = true;

        let formData = new FormData();
        formData.append("title", document.querySelector('input[name="title"]').value);
        formData.append("metaDescription", document.querySelector('input[name="metaDescription"]').value);
        formData.append("tags", document.querySelector('input[name="tags"]').value);
        formData.append("content", quill.root.innerHTML);
        formData.append("status", document.querySelector('select[name="status"]').value);
        formData.append("headerType", document.querySelector('select[name="headerType"]').value);

        // ✅ Add Image File to FormData (if changed)
        let imageInput = document.querySelector('input[name="image"]');
        if (imageInput.files.length > 0) {
            formData.append("image", imageInput.files[0]);
        }

        // ✅ Add Cover Image Link (If Provided)
        let imageLink = document.querySelector('input[name="imageLink"]').value;
        if (imageLink.trim() !== "") {
            formData.append("imageLink", imageLink);
        }

        fetch(document.getElementById("editBlogForm").action, {
            method: "PUT",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = `/blogs/${data.slug}`;
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error updating blog:", error);
            alert("Something went wrong. Please try again.");
        })
        .finally(() => {
            // ✅ Restore Button State After Submission
            updateBtn.innerHTML = originalText;
            updateBtn.disabled = false;
        });
    };
});
