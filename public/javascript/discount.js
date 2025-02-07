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
        const id = e.dataTransfer.getData("text");
        const draggedItem = document.getElementById(id);
        e.target.appendChild(draggedItem);
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

    fetch(`/admin/get-plans?service=${encodeURIComponent(service)}`)
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
                option.value = plan;
                option.textContent = plan;
                planSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("❌ Error fetching plans:", error);
            planSelect.innerHTML = `<option value="">Error loading plans</option>`;
        });
});