let OPENROUTER_API_KEY = "";

async function fetchApiKey() {
    try {
        const response = await fetch("/api/getApiKey");
        const data = await response.json();
        
        if (!data.apiKey) {
            throw new Error("API Key not available.");
        }

        OPENROUTER_API_KEY = data.apiKey; // Store key for future use
    } catch (error) {
        console.error("Error fetching API key:", error);
        alert("Failed to load API key. AI features may not work.");
    }
}

// Call fetchApiKey once when the page loads
fetchApiKey();
// Fetch the AI-generated template based on the selected letter type
async function fetchTemplate(letterType, letterTone, additionalInfo) {
if (!OPENROUTER_API_KEY) {
        alert("API key is missing. Please try again.");
        return;
    }
    const prompt = `Generate a professional letter template for a ${letterType} with a tone that is ${letterTone}. Include the following additional information: "${additionalInfo}". Use placeholders in [ ] for missing details.`;


    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
               "Authorization": `Bearer ${OPENROUTER_API_KEY}`
 // Replace with your valid API key
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 550
            })
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content.trim();
        } else {
            throw new Error("Template generation failed.");
        }
    } catch (error) {
        console.error("Error fetching template:", error);
        alert("Failed to generate template. Please try again.");
    }
}

// Extract placeholders from the AI-generated template
function extractPlaceholders(template) {
    const regex = /\[([^\]]+)]/g; // Match text within square brackets
    const placeholders = [];
    const seen = new Set();
    let match;

    while ((match = regex.exec(template)) !== null) {
        const placeholder = match[1].trim(); // Remove unnecessary spaces
        if (!seen.has(placeholder)) {
            seen.add(placeholder); // Avoid duplicate questions
            placeholders.push(placeholder);
        }
    }

    return placeholders;
}

// Load dynamic input fields based on placeholders
function loadInputFields(placeholders) {
    const container = document.getElementById("inputContainer");
    container.innerHTML = ""; // Clear existing inputs

    placeholders.forEach((placeholder) => {
        const label = document.createElement("label");
        label.innerText = `Please provide the following information: ${placeholder}`;
        const input = document.createElement("input");
        input.id = placeholder;
        input.placeholder = `Enter ${placeholder}`;
        input.required = true;

        container.appendChild(label);
        container.appendChild(input);
    });

    const generateButton = document.createElement("button");
    generateButton.innerText = "Generate Final Letter";
    generateButton.onclick = () => replacePlaceholders(placeholders);
    container.appendChild(generateButton);
}

// Replace placeholders with user-provided inputs and refine the letter
async function replacePlaceholders(placeholders) {
    const template = document.getElementById("template").value;
    const finalLetterArea = document.getElementById("finalLetter");
let finalLetter = template;
finalLetterArea.value = "Generating Final Letter...";
finalLetterArea.disabled = true; // Disable editing while loading


    placeholders.forEach((placeholder) => {
        const userInput = document.getElementById(placeholder).value.trim();
        if (userInput) {
            finalLetter = finalLetter.replace(new RegExp(`\\[${placeholder}\\]`, "g"), userInput);
        } else {
            alert(`Please provide a valid input for "${placeholder}".`);
            return;
        }
    });

    // Send the final letter to AI for grammar and language improvement
    try {
        // Send the final letter to AI for refinement
        const refinedLetter = await refineLetter(finalLetter);

        // Display the refined letter in the text area
        finalLetterArea.value = refinedLetter.trim();
    } catch (error) {
        console.error("Error refining letter:", error);
        finalLetterArea.value = "An error occurred while generating the letter.";
    } finally {
        finalLetterArea.disabled = false; // Re-enable editing after completion
    }
}

// Send the final letter to AI for grammar and language refinement
async function refineLetter(letter, letterTone) {
    const prompt = `Refine the following letter for grammar, clarity, and professionalism in tone ${letterTone}:\n\n${letter}`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
               "Authorization": `Bearer ${OPENROUTER_API_KEY}`
 // Replace with your valid API key
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 550
            })
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content.trim();
        } else {
            throw new Error("Refinement failed.");
        }
    } catch (error) {
        console.error("Error refining letter:", error);
        alert("Failed to refine the letter. Showing the original letter instead.");
        return letter; // Return the original letter if refinement fails
    }
}

// Handle the entire letter generation process
async function handleLetterGeneration() {
    const letterType = document.getElementById("letterType").value;
    const letterTone = document.getElementById("letterTone").value;
    const additionalInfo = document.getElementById("additionalInfo").value.trim();
const loadingIndicator = document.getElementById("loadingIndicator");



   if (!letterType || !letterTone) {
    alert("Please select both a letter type and a tone.");
    return;
}


    try {
        // Show Loading Indicator
        loadingIndicator.classList.remove("hidden");

        const template = await fetchTemplate(letterType, letterTone, additionalInfo);
        
        if (!template) {
            throw new Error("Template generation returned undefined.");
        }

        document.getElementById("template").value = template; // Ensure this executes
        const placeholders = extractPlaceholders(template);
        loadInputFields(placeholders); // Load input fields for placeholders
        return template; 
        
    } catch (error) {
        console.error("Error handling letter generation:", error);
    } finally {
        // Hide Loading Indicator when done
        loadingIndicator.classList.add("hidden");
    }
}

// Menu Toggle Functionality
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    // Ensure the menu is hidden by default on smaller screens
    if (window.innerWidth <= 768) {
        navLinks.classList.remove("active");
    }

    // Toggle the menu visibility when the menu button is clicked
    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }

    // Adjust menu visibility on window resize
    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            navLinks.classList.add("active");
        } else {
            navLinks.classList.remove("active");
        }
    });
});

// Attach event listener to the generate button
document.getElementById("generateTemplateButton").addEventListener("click", async function () {
    let loadingIndicator = document.getElementById("loadingIndicator");
    let templateBox = document.getElementById("template");

    // Show "Loading ···" message
    loadingIndicator.style.display = "inline"; 
    templateBox.value = ""; // Clear the old template text

    try {
        let generatedText = await handleLetterGeneration(); // Call AI function

        // Hide "Loading ···" message and display the generated text
        loadingIndicator.style.display = "none";
        templateBox.value = generatedText;
    } catch (error) {
        console.error("Error generating template:", error);
        loadingIndicator.innerText = "Error loading template.";
        setTimeout(() => loadingIndicator.style.display = "none", 3000);
    }
});


// Copy Final Letter to Clipboard
document.getElementById("copyFinalButton").addEventListener("click", () => {
    const finalText = document.getElementById("finalLetter").value;
    navigator.clipboard.writeText(finalText)
        .then(() => alert("Final letter copied to clipboard!"))
        .catch(err => console.error("Failed to copy text:", err));
});

// Download Final Letter as PDF
document.getElementById("downloadFinalButton").addEventListener("click", () => {
    const { jsPDF } = window.jspdf; // Access jsPDF
    const finalText = document.getElementById("finalLetter").value;

    if (finalText.trim() === "") {
        alert("Final letter is empty. Cannot generate PDF.");
        return;
    }

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Define margins and line height
    const marginLeft = 10;
    const marginTop = 20;
    const lineHeight = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - marginLeft * 2;

    // Split the text into lines that fit within the content width
    const lines = doc.splitTextToSize(finalText, contentWidth);

    // Check if the content exceeds one page
    let cursorY = marginTop;
    lines.forEach((line, index) => {
        if (cursorY + lineHeight > pageHeight - marginTop) {
            doc.addPage(); // Add a new page if the current page is full
            cursorY = marginTop; // Reset cursorY for the new page
        }
        doc.text(line, marginLeft, cursorY);
        cursorY += lineHeight; // Move cursorY for the next line
    });

    // Save the PDF file
    doc.save("Final_Letter.pdf");
});
