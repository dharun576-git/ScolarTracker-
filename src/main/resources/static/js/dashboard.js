document.addEventListener("DOMContentLoaded", function () {

    console.log("ScholarTrack Dashboard Loaded");

    loadDashboard();

});


/* =========================================================
   LOAD DASHBOARD
========================================================= */

async function loadDashboard() {

    try {

        const students = await fetchData("/api/students");

        const schemes = await fetchData("/api/schemes");

        const applications = await fetchData("/api/applications");

        const disbursements = await fetchData("/api/disbursements");


        console.log("Students:", students);

        console.log("Schemes:", schemes);

        console.log("Applications:", applications);

        console.log("Disbursements:", disbursements);


        /* DASHBOARD CARDS */

        setValue(
            "studentCount",
            students.length
        );

        setValue(
            "schemeCount",
            schemes.length
        );

        setValue(
            "applicationCount",
            applications.length
        );


        const completedDisbursements =
            disbursements.filter(
                d =>
                    d.disbursementStatus === "COMPLETED"
            ).length;


        setValue(
            "disbursementCount",
            completedDisbursements
        );


        /* OTHER SECTIONS */

        updateApplications(applications);

        updateSchemes(schemes);

        updateApplicationStatus(applications);

        updateSystemOverview(applications);

    }
    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}


/* =========================================================
   FETCH API DATA
========================================================= */

async function fetchData(url) {

    const response = await fetch(url);

    console.log(
        url + " -> " + response.status
    );


    if (!response.ok) {

        throw new Error(
            "Failed to load " +
            url +
            " | HTTP " +
            response.status
        );

    }


    return await response.json();

}


/* =========================================================
   SET HTML VALUE
========================================================= */

function setValue(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.innerText = value;

    }
    else {

        console.warn(
            "HTML element not found: " + id
        );

    }

}


/* =========================================================
   RECENT APPLICATIONS
========================================================= */

function updateApplications(applications) {

    console.log(
        "Updating Applications:",
        applications.length
    );


    const tableBody =
        document.getElementById(
            "applicationTableBody"
        );


    if (!tableBody) {

        console.error(
            "applicationTableBody not found"
        );

        return;

    }


    tableBody.innerHTML = "";


    if (applications.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No applications found
                </td>
            </tr>
        `;

        return;

    }


    applications.forEach(application => {


        const studentName =
            application.student &&
            application.student.name
                ? application.student.name
                : "-";


        const schemeName =
            application.scheme &&
            application.scheme.schemeName
                ? application.scheme.schemeName
                : "-";


        const eligibility =
            application.eligibilityStatus
                ? application.eligibilityStatus
                : "-";


        const applicationStatus =
            application.applicationStatus
                ? application.applicationStatus
                : "-";


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${application.applicationId}
            </td>

            <td>
                ${studentName}
            </td>

            <td>
                ${schemeName}
            </td>

            <td>
                <span class="status ${getStatusClass(eligibility)}">
                    ${eligibility}
                </span>
            </td>

            <td>
                <span class="status ${getStatusClass(applicationStatus)}">
                    ${applicationStatus}
                </span>
            </td>

        `;


        tableBody.appendChild(row);

    });

}


/* =========================================================
   SCHOLARSHIP SCHEMES
========================================================= */

function updateSchemes(schemes) {

    console.log(
        "Updating Schemes:",
        schemes.length
    );


    const tableBody =
        document.getElementById(
            "schemeTableBody"
        );


    if (!tableBody) {

        console.error(
            "schemeTableBody not found"
        );

        return;

    }


    tableBody.innerHTML = "";


    if (schemes.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No scholarship schemes found
                </td>
            </tr>
        `;

        return;

    }


    schemes.forEach(scheme => {


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${scheme.schemeId}
            </td>

            <td>
                ${scheme.schemeName}
            </td>

            <td>
                ${scheme.description || "-"}
            </td>

            <td>
                ₹${formatNumber(scheme.incomeLimit)}
            </td>

            <td>
                ${scheme.minimumMarks}%
            </td>

            <td>
                ₹${formatNumber(scheme.scholarshipAmount)}
            </td>

            <td>
                <span class="status active">
                    ${scheme.status || "ACTIVE"}
                </span>
            </td>

        `;


        tableBody.appendChild(row);

    });

}


/* =========================================================
   APPLICATION STATUS
========================================================= */

function updateApplicationStatus(applications) {


    const eligible =
        applications.filter(
            application =>
                application.eligibilityStatus ===
                "ELIGIBLE"
        ).length;


    const underReview =
        applications.filter(
            application =>
                application.applicationStatus ===
                "UNDER_REVIEW"
        ).length;


    const verified =
        applications.filter(
            application =>
                application.applicationStatus ===
                "VERIFIED"
        ).length;


    const rejected =
        applications.filter(
            application =>
                application.applicationStatus ===
                "REJECTED"
        ).length;


    const disbursed =
        applications.filter(
            application =>
                application.applicationStatus ===
                "DISBURSED"
        ).length;


    console.log(
        "Status:",
        {
            eligible,
            underReview,
            verified,
            rejected,
            disbursed
        }
    );


    /* APPLICATION STATUS CARDS */

    setValue(
        "eligibleCount",
        eligible
    );


    setValue(
        "underReviewCount",
        underReview
    );


    setValue(
        "verifiedCount",
        verified
    );


    setValue(
        "rejectedCount",
        rejected
    );


    setValue(
        "disbursedCount",
        disbursed
    );

}


/* =========================================================
   SYSTEM OVERVIEW
========================================================= */

function updateSystemOverview(applications) {


    const eligible =
        applications.filter(
            application =>
                application.eligibilityStatus ===
                "ELIGIBLE"
        ).length;


    const verified =
        applications.filter(
            application =>
                application.applicationStatus ===
                "VERIFIED"
        ).length;


    const disbursed =
        applications.filter(
            application =>
                application.applicationStatus ===
                "DISBURSED"
        ).length;


    setValue(
        "eligibleApplications",
        eligible
    );


    setValue(
        "verifiedApplications",
        verified
    );


    setValue(
        "disbursedApplications",
        disbursed
    );

}


/* =========================================================
   STATUS CSS CLASS
========================================================= */

function getStatusClass(status) {

    if (!status) {
        return "";
    }


    switch (
        status.toUpperCase()
        ) {

        case "ELIGIBLE":
            return "eligible";


        case "UNDER_REVIEW":
            return "under-review";


        case "VERIFIED":
            return "verified";


        case "REJECTED":
            return "rejected";


        case "DISBURSED":
            return "disbursed";


        case "ACTIVE":
            return "active";


        default:
            return "";

    }

}


/* =========================================================
   NUMBER FORMAT
========================================================= */

function formatNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "0";

    }


    return Number(value).toLocaleString(
        "en-IN"
    );

}


/* =========================================================
   REFRESH DASHBOARD
========================================================= */

function refreshDashboard() {

    loadDashboard();

}