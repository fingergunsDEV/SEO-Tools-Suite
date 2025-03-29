document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll(".nav-btn");
    const toolContainers = document.querySelectorAll(".tool-container");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove("active"));

            // Add active class to the clicked button
            button.classList.add("active");

            // Get the target tool from the button's data attribute
            const selectedTool = button.getAttribute("data-tool");

            // Hide all tool containers
            toolContainers.forEach(tool => tool.classList.remove("active"));

            // Show the selected tool
            document.getElementById(selectedTool).classList.add("active");
        });
    });
});
