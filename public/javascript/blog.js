document.addEventListener("DOMContentLoaded", function () {
    // ✅ Ensure ImageResize is Loaded Before Registering
    if (typeof window.ImageResize === "undefined") {
        console.error("❌ ImageResize module not found. Ensure it is loaded correctly.");
    } else {
        // Quill.register("modules/imageResize", window.ImageResize);
        console.log("✅ ImageResize module registered successfully!");
    }

    // ✅ Initialize Quill
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

    console.log("✅ Quill initialized successfully!");

    // ✅ Check if Quill is loaded
    if (!quill) {
        console.error("❌ Quill is not initialized correctly.");
    } else {
        console.log("✅ Quill is working correctly!");
    }

    // ✅ Image Upload Handler
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


    // ✅ Handle Form Submission
    document.getElementById("blogForm").onsubmit = function (event) {
        event.preventDefault();
    
        let formData = new FormData();
        formData.append("title", document.querySelector('input[name="title"]').value);
        formData.append("metaDescription", document.querySelector('input[name="metaDescription"]').value);
        formData.append("tags", document.querySelector('input[name="tags"]').value);
        formData.append("content", quill.root.innerHTML);
        formData.append("status", document.activeElement.name === "status" ? document.activeElement.value : "draft");
    
        // ✅ Add Image File to FormData
        let imageInput = document.querySelector('input[name="image"]');
        if (imageInput.files.length > 0) {
            formData.append("image", imageInput.files[0]);
        }
    
        fetch("/blogs", {
            method: "POST",
            body: formData  // ✅ Send form data including image
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = `/blogs/${data.slug}`; // ✅ Redirect to the new blog
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => console.error("Error saving blog:", error));
    };
    
});
