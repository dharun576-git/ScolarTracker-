document.addEventListener("DOMContentLoaded", function () {

    console.log("================================");
    console.log("ScholarTrack Dashboard Loaded");
    console.log("================================");

    loadDashboard();

});


async function loadDashboard() {

    try {

        const students = await getData("/api/students");
        const schemes = await getData("/api/schemes");
        const applications = await getData("/api/applications");
        const disbursements = await getData("/api/disbursements");

        console.log("Students:", students);
        console.log("Schemes:", schemes);
        console.log("Applications:", applications);
        console.log("Disbursements:", disbursements);

        updateStudents(students);
        updateSchemes(schemes);
        updateApplications(applications);
        updateDisbursements(disbursements);

        updateStatistics(
            students,
            schemes,
            applications,
            disbursements
        );

    } catch (error) {

        console.error("DASHBOARD ERROR:", error);

    }

}


async function getData(url) {

    const response = await fetch(url);

    console.log(url, "Status:", response.status);

    if (!response.ok) {
        throw new Error(
            url + " returned HTTP " + response.status
        );
    }

    return await response.json();
}


/* =========================
   STUDENTS
========================= */

function updateStudents(students) {

    const element =
        document.getElementById("totalStudents");

    if (element) {
        element.innerText = students.length;
    }

}


/* =========================
   SCHEMES
========================= */

function updateSchemes(schemes) {

    const element =
        document.getElementById("totalSchemes");

    if (element) {
        element.innerText = schemes.length;
    }

    const table =
        document.getElementById("schemeTableBody");

    if (!table) {
        console.error("schemeTableBody not found");
        return;
    }

    table.innerHTML = "";

    schemes.forEach(scheme => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${scheme.schemeId}</td>

            <td>${scheme.schemeName}</td>

            <td>${scheme.description || "-"}</td>

            <td>₹${Number(scheme.incomeLimit).toLocaleString("en-IN")}</td>

            <td>${scheme.minimumMarks}%</td>

            <td>₹${Number(scheme.scholarshipAmount).toLocaleString("en-IN")}</td>

            <td>
                <span class="status active">
                    ${scheme.status || "ACTIVE"}
                </span>
            </td>
        `;

        table.appendChild(row);

    });

}


/* =========================
   APPLICATIONS
========================= */

function updateApplications(applications) {

    const total =
        document.getElementById("totalApplications");

    if (total) {
        total.innerText = applications.length;
    }

    const table =
        document.getElementById("applicationTableBody");

    if (!table) {
        console.error("applicationTableBody not found");
        return;
    }

    table.innerHTML = "";

    applications.forEach(application => {

        const studentName =
            application.student
                ? application.student.name
                : "-";

        const schemeName =
            application.scheme
                ? application.scheme.schemeName
                : "-";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${application.applicationId}</td>

            <td>${studentName}</td>

            <td>${schemeName}</td>

            <td>
                <span class="status eligible">
                    ${application.eligibilityStatus || "-"}
                </span>
            </td>

            <td>
                <span class="status rejected">
                    ${application.applicationStatus || "-"}
                </span>
            </td>

            <td>
                ${application.remarks || "-"}
            </td>
        `;

        table.appendChild(row);

    });

}


/* =========================
   DISBURSEMENTS
========================= */

function updateDisbursements(disbursements) {

    const total =
        document.getElementById("totalDisbursements");

    if (total) {

        const completed =
            disbursements.filter(
                d => d.disbursementStatus === "COMPLETED"
            ).length;

        total.innerText = completed;
    }

}


/* =========================
   DASHBOARD STATISTICS
========================= */

function updateStatistics(
    students,
    schemes,
    applications,
    disbursements
) {

    const eligible =
        applications.filter(
            a => a.eligibilityStatus === "ELIGIBLE"
        ).length;

    const underReview =
        applications.filter(
            a => a.applicationStatus === "UNDER_REVIEW"
        ).length;

    const verified =
        applications.filter(
            a => a.applicationStatus === "VERIFIED"
        ).length;

    const rejected =
        applications.filter(
            a => a.applicationStatus === "REJECTED"
        ).length;

    const disbursed =
        applications.filter(
            a => a.applicationStatus === "DISBURSED"
        ).length;


    setText("eligibleCount", eligible);

    setText("underReviewCount", underReview);

    setText("verifiedCount", verified);

    setText("rejectedCount", rejected);

    setText("disbursedCount", disbursed);


    setText("eligibleApplications", eligible);

    setText("verifiedApplications", verified);

    setText("disbursedApplications", disbursed);

}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.innerText = value;
    }

}


/* =========================
   REFRESH
========================= */

function refreshDashboard() {

    loadDashboard();

}