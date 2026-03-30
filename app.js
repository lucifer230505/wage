// DETECT CURRENT PAGE
const page = document.body.dataset.page;

/* =========================
   GLOBAL: MOBILE NAV MENU
========================= */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });
}


/* =========================
   CALCULATOR PAGE
========================= */
if (page === "calculator") {

    const rate = document.getElementById("rate");
    const hours = document.getElementById("hours");
    const overtimeHours = document.getElementById("overtimeHours");
    const overtimeRate = document.getElementById("overtimeRate");
    const tax = document.getElementById("tax");
    const bonus = document.getElementById("bonus");

    const calculateBtn = document.getElementById("calculateBtn");
    const saveBtn = document.getElementById("saveBtn");

    const grossPayEl = document.getElementById("grossPay");
    const taxAmountEl = document.getElementById("taxAmount");
    const netPayEl = document.getElementById("netPay");
    const weeklyPayEl = document.getElementById("weeklyPay");
    const monthlyPayEl = document.getElementById("monthlyPay");

    let lastCalculation = null;

    function formatMoney(amount) {
        return "₦" + amount.toLocaleString();
    }

    function calculateWage() {
        const r = parseFloat(rate.value) || 0;
        const h = parseFloat(hours.value) || 0;
        const oh = parseFloat(overtimeHours.value) || 0;
        const or = parseFloat(overtimeRate.value) || 1;
        const t = parseFloat(tax.value) || 0;
        const b = parseFloat(bonus.value) || 0;

        const basePay = r * h;
        const overtimePay = oh * r * or;

        const gross = basePay + overtimePay + b;
        const taxAmount = gross * (t / 100);
        const net = gross - taxAmount;

        const weekly = net * 5;
        const monthly = net * 20;

        // Display
        grossPayEl.textContent = formatMoney(gross);
        taxAmountEl.textContent = formatMoney(taxAmount);
        netPayEl.textContent = formatMoney(net);
        weeklyPayEl.textContent = formatMoney(weekly);
        monthlyPayEl.textContent = formatMoney(monthly);

        // Save last calculation
        lastCalculation = {
            rate: r,
            hours: h,
            netPay: net,
            date: new Date().toLocaleDateString()
        };
    }

    calculateBtn.addEventListener("click", calculateWage);

    // SAVE TO LOCAL STORAGE
    saveBtn.addEventListener("click", () => {
        if (!lastCalculation) {
            alert("Please calculate first!");
            return;
        }

        let history = JSON.parse(localStorage.getItem("wageHistory")) || [];
        history.push(lastCalculation);

        localStorage.setItem("wageHistory", JSON.stringify(history));

        alert("Saved successfully!");
    });
}


/* =========================
   HISTORY PAGE
========================= */
if (page === "history") {

    const historyList = document.getElementById("historyList");
    const emptyState = document.getElementById("emptyState");
    const clearBtn = document.getElementById("clearHistoryBtn");

    let history = JSON.parse(localStorage.getItem("wageHistory")) || [];

    function renderHistory() {
        historyList.innerHTML = "";

        if (history.length === 0) {
            emptyState.style.display = "block";
            return;
        }

        emptyState.style.display = "none";

        history.forEach((item, index) => {
            const div = document.createElement("div");
            div.classList.add("history-item");

            div.innerHTML = `
                <div class="history-info">
                    <p><strong>Rate:</strong> ₦${item.rate}/hr</p>
                    <p><strong>Hours:</strong> ${item.hours} hrs</p>
                    <p><strong>Net Pay:</strong> ₦${item.netPay.toLocaleString()}</p>
                </div>

                <div class="history-meta">
                    <span>${item.date}</span>
                    <button class="btn small delete-btn" data-index="${index}">Delete</button>
                </div>
            `;

            historyList.appendChild(div);
        });
    }

    // DELETE SINGLE ITEM
    historyList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const index = e.target.dataset.index;
            history.splice(index, 1);
            localStorage.setItem("wageHistory", JSON.stringify(history));
            renderHistory();
        }
    });

    // CLEAR ALL
    clearBtn.addEventListener("click", () => {
        if (confirm("Clear all history?")) {
            localStorage.removeItem("wageHistory");
            history = [];
            renderHistory();
        }
    });

    renderHistory();
}


/* =========================
   CONTACT PAGE
========================= */
if (page === "contact") {

    const form = document.getElementById("contactForm");

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    const successMessage = document.getElementById("successMessage");

    function showError(id, msg) {
        document.getElementById(id).textContent = msg;
    }

    function clearErrors() {
        document.querySelectorAll(".error").forEach(el => el.textContent = "");
    }

    function validateEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        clearErrors();
        let valid = true;

        if (name.value.trim() === "") {
            showError("nameError", "Name is required");
            valid = false;
        }

        if (!validateEmail(email.value)) {
            showError("emailError", "Valid email required");
            valid = false;
        }

        if (subject.value.trim() === "") {
            showError("subjectError", "Subject is required");
            valid = false;
        }

        if (message.value.trim() === "") {
            showError("messageError", "Message is required");
            valid = false;
        }

        if (valid) {
            successMessage.textContent = "Message sent successfully!";
            form.reset();
        }
    });
}

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light");
        themeToggle.textContent = "☀️";
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light");

        if (document.body.classList.contains("light")) {
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "🌙";
        }
    });
}