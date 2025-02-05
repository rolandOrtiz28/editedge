document.addEventListener("DOMContentLoaded", function () {
    if (typeof window.ImageResize === "undefined") {
        console.error("❌ ImageResize module not found. Ensure it is loaded correctly.");
    } else {
        // Quill.register("modules/imageResize", window.ImageResize);
        console.log("✅ ImageResize module registered successfully!");
    }
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
                    image: imageHandler // ✅ Attach Custom Image Handler
                }
            },
            imageResize: {} // ✅ Enable Image Resizing
        }
    });
    

    // ✅ Set Quill Content to Existing Blog Content
    const existingContent = document.getElementById("contentInput").value;
    quill.root.innerHTML = existingContent;

    console.log("✅ Quill initialized successfully!");

    // ✅ Check if Quill is loaded
    if (!quill) {
        console.error("❌ Quill is not initialized correctly.");
    } else {
        console.log("✅ Quill is working correctly!");
    }

// ✅ Image Upload Handler for Quill
function imageHandler() {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async function () {
        let file = input.files[0];

        if (!file) return; // Prevent errors if no file is selected

        let formData = new FormData();
        formData.append("image", file);

        let range = quill.getSelection();
        quill.insertText(range.index, "Uploading...", "italic"); // Show temporary message

        try {
            let response = await fetch("/upload", {
                method: "POST",
                body: formData
            });

            let data = await response.json();
            if (data.url) {
                quill.deleteText(range.index, 11); // Remove "Uploading..." message
                quill.insertEmbed(range.index, "image", data.url);
            } else {
                alert("Image upload failed. Please try again.");
            }
        } catch (error) {
            console.error("Image Upload Failed:", error);
            alert("Something went wrong while uploading the image.");
        }
    };
}


    // ✅ Handle Form Submission
    document.getElementById("editBlogForm").onsubmit = function (event) {
        event.preventDefault();
    
        let formData = new FormData(this);
        formData.set("content", quill.root.innerHTML); // ✅ Update content from Quill
    
        fetch(this.action, {
            method: "PUT", // ✅ Correct method
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // ✅ Reload the page after 1 second to reflect the changes
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => console.error("Error updating blog:", error));
    };
});
