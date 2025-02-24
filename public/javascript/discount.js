document.addEventListener("DOMContentLoaded", () => {
    const columns = document.querySelectorAll(".kanban-items");
    const items = document.querySelectorAll(".kanban-item");

    items.forEach(item => {
        item.draggable = true;
        item.addEventListener("dragstart", dragStart);
    });

    columns.forEach(column => {
        column.addEventListener("dragover", dragOver);
        column.addEventListener("drop", drop);
    });

    function dragStart(e) {
        e.dataTransfer.setData("text", e.target.id);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData("text");
        const draggedItem = document.getElementById(draggedId);
        const newStatus = e.target.closest(".kanban-column").id; // Get new column ID
    
        if (!["pending", "active", "expired"].includes(newStatus)) return; // Ensure valid status
    
        e.target.appendChild(draggedItem);
    
        // Extract the actual ObjectId from "discount-<id>"
        const id = draggedId.replace("discount-", ""); // ✅ Fix: Remove "discount-" prefix
    
        // Send request to update discount status in the database
        fetch("/admin/update-discount-status", {  
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, status: newStatus })  // ✅ Now sending only ObjectId
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then(data => {
            console.log(`✅ Discount status updated to: ${newStatus}`);
        })
        .catch(error => {
            console.error("❌ Error updating discount status:", error);
            alert("Failed to update discount status. Please check the console for details.");
        });
    }
    
    
    
});

// Function to open form when clicking "Add Discount"
function openDiscountForm() {
    document.getElementById("discount-form").scrollIntoView({ behavior: "smooth" });
}

document.getElementById("service").addEventListener("change", function () {
    const service = this.value;
    const planSelect = document.getElementById("plan");
    planSelect.innerHTML = `<option value="">Loading...</option>`;

    fetch(`/get-pricing?service=${encodeURIComponent(service)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("Invalid plan data received");
            }

            planSelect.innerHTML = `<option value="">-- Select Plan --</option>`;
            data.forEach(plan => {
                const option = document.createElement("option");
                option.value = plan.title;  // Ensure correct key for plan
                option.textContent = plan.title;
                planSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("❌ Error fetching plans:", error);
            planSelect.innerHTML = `<option value="">Error loading plans</option>`;
        });
});
