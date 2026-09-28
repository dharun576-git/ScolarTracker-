document.addEventListener("DOMContentLoaded", function () {

    loadDashboard();

    setupStudentForm();
    setupSchemeForm();
    setupApplicationForm();
    setupVerificationForm();
    setupDisbursementForm();

});


/* =========================================================
   LOAD DASHBOARD
========================================================= */

async function loadDashboard() {

    try {

        const [
            studentsResponse,
            schemesResponse,
            applicationsResponse,
            disbursementsResponse
        ] = await Promise.all([

            fetch("/api/students"),
            fetch("/api/schemes"),
            fetch("/api/applications"),
            fetch("/api/disbursements")

        ]);


        if (!studentsResponse.ok) {
            throw new Error("Unable to load students");
        }

        if (!schemesResponse.ok) {
            throw new Error("Unable to load schemes");
        }

        if (!applicationsResponse.ok) {
            throw new Error("Unable to load applications");
        }

        if (!disbursementsResponse.ok) {
            throw new Error("Unable to load disbursements");
        }


        const students = await studentsResponse.json();
        const schemes = await schemesResponse.json();
        const applications = await applicationsResponse.json();
        const disbursements = await disbursementsResponse.json();


        console.log("Students:", students);
        console.log("Schemes:", schemes);
        console.log("Applications:", applications);
        console.log("Disbursements:", disbursements);


        /* STATISTICS */

        setElement(
            "totalStudents",
            students.length
        );

        setElement(
            "totalSchemes",
            schemes.length
        );

        setElement(
            "totalApplications",
            applications.length
        );


        const completedDisbursements =
            disbursements.filter(function (item) {

                return item.disbursementStatus === "COMPLETED";

            }).length;


        setElement(
            "totalDisbursements",
            completedDisbursements
        );


        /* APPLICATION STATUS */

        const eligible =
            applications.filter(function (application) {

                return application.eligibilityStatus === "ELIGIBLE";

            }).length;


        const underReview =
            applications.filter(function (application) {

                return application.applicationStatus === "UNDER_REVIEW";

            }).length;


        const verified =
            applications.filter(function (application) {

                return application.applicationStatus === "VERIFIED";

            }).length;


        const rejected =
            applications.filter(function (application) {

                return application.applicationStatus === "REJECTED";

            }).length;


        const disbursed =
            applications.filter(function (application) {

                return application.applicationStatus === "DISBURSED";

            }).length;


        setElement("eligibleCount", eligible);
        setElement("underReviewCount", underReview);
        setElement("verifiedCount", verified);
        setElement("rejectedCount", rejected);
        setElement("disbursedCount", disbursed);


        /* SYSTEM OVERVIEW */

        setElement(
            "eligibleApplications",
            eligible
        );

        setElement(
            "verifiedApplications",
            verified
        );

        setElement(
            "disbursedApplications",
            disbursed
        );


        /* TABLES */

        displaySchemes(schemes);

        displayApplications(applications);

    }

    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}


/* =========================================================
   ADD STUDENT
========================================================= */

function setupStudentForm() {

    const form =
        document.getElementById("studentForm");


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const student = {

                name:
                document.getElementById(
                    "studentName"
                ).value,

                email:
                document.getElementById(
                    "studentEmail"
                ).value,

                phone:
                document.getElementById(
                    "studentPhone"
                ).value,

                annualIncome:
                    Number(
                        document.getElementById(
                            "studentIncome"
                        ).value
                    ),

                marks:
                    Number(
                        document.getElementById(
                            "studentMarks"
                        ).value
                    ),

                course:
                document.getElementById(
                    "studentCourse"
                ).value,

                year:
                    Number(
                        document.getElementById(
                            "studentYear"
                        ).value
                    )

            };


            try {

                const response =
                    await fetch(
                        "/api/students",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(student)
                        }
                    );


                const result =
                    await readResponse(response);


                if (!response.ok) {

                    throw new Error(
                        getErrorMessage(result)
                    );

                }


                showMessage(
                    "studentMessage",
                    "Student added successfully.",
                    true
                );


                form.reset();


                await loadDashboard();

            }

            catch (error) {

                showMessage(
                    "studentMessage",
                    error.message,
                    false
                );

            }

        }
    );

}


/* =========================================================
   ADD SCHEME
========================================================= */

function setupSchemeForm() {

    const form =
        document.getElementById("schemeForm");


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const scheme = {

                schemeName:
                document.getElementById(
                    "schemeName"
                ).value,

                description:
                document.getElementById(
                    "schemeDescription"
                ).value,

                incomeLimit:
                    Number(
                        document.getElementById(
                            "incomeLimit"
                        ).value
                    ),

                minimumMarks:
                    Number(
                        document.getElementById(
                            "minimumMarks"
                        ).value
                    ),

                scholarshipAmount:
                    Number(
                        document.getElementById(
                            "scholarshipAmount"
                        ).value
                    ),

                status:
                document.getElementById(
                    "schemeStatus"
                ).value

            };


            try {

                const response =
                    await fetch(
                        "/api/schemes",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(scheme)
                        }
                    );


                const result =
                    await readResponse(response);


                if (!response.ok) {

                    throw new Error(
                        getErrorMessage(result)
                    );

                }


                showMessage(
                    "schemeMessage",
                    "Scholarship scheme added successfully.",
                    true
                );


                form.reset();


                await loadDashboard();

            }

            catch (error) {

                showMessage(
                    "schemeMessage",
                    error.message,
                    false
                );

            }

        }
    );

}


/* =========================================================
   SUBMIT APPLICATION
========================================================= */

function setupApplicationForm() {

    const form =
        document.getElementById(
            "applicationForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const application = {

                studentId:
                    Number(
                        document.getElementById(
                            "applicationStudentId"
                        ).value
                    ),

                schemeId:
                    Number(
                        document.getElementById(
                            "applicationSchemeId"
                        ).value
                    )

            };


            try {

                const response =
                    await fetch(
                        "/api/applications",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(application)
                        }
                    );


                const result =
                    await readResponse(response);


                if (!response.ok) {

                    throw new Error(
                        getErrorMessage(result)
                    );

                }


                showMessage(
                    "applicationMessage",
                    "Application submitted successfully.",
                    true
                );


                form.reset();


                await loadDashboard();

            }

            catch (error) {

                showMessage(
                    "applicationMessage",
                    error.message,
                    false
                );

            }

        }
    );

}


/* =========================================================
   VERIFICATION
========================================================= */

function setupVerificationForm() {

    const form =
        document.getElementById(
            "verificationForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const applicationId =
                document.getElementById(
                    "verificationApplicationId"
                ).value;


            const verification = {

                verifierName:
                document.getElementById(
                    "verifierName"
                ).value,

                verificationStatus:
                document.getElementById(
                    "verificationStatus"
                ).value,

                remarks:
                document.getElementById(
                    "verificationRemarks"
                ).value

            };


            try {

                const response =
                    await fetch(
                        "/api/verifications/" +
                        applicationId,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    verification
                                )
                        }
                    );


                const result =
                    await readResponse(response);


                if (!response.ok) {

                    throw new Error(
                        getErrorMessage(result)
                    );

                }


                showMessage(
                    "verificationMessage",
                    "Application verification completed successfully.",
                    true
                );


                form.reset();


                await loadDashboard();

            }

            catch (error) {

                showMessage(
                    "verificationMessage",
                    error.message,
                    false
                );

            }

        }
    );

}


/* =========================================================
   DISBURSEMENT
========================================================= */

function setupDisbursementForm() {

    const form =
        document.getElementById(
            "disbursementForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const applicationId =
                document.getElementById(
                    "disbursementApplicationId"
                ).value;


            try {

                const response =
                    await fetch(
                        "/api/disbursements/" +
                        applicationId,
                        {
                            method: "POST"
                        }
                    );


                const result =
                    await readResponse(response);


                if (!response.ok) {

                    throw new Error(
                        getErrorMessage(result)
                    );

                }


                showMessage(
                    "disbursementMessage",
                    "Disbursement completed successfully.",
                    true
                );


                form.reset();


                await loadDashboard();

            }

            catch (error) {

                showMessage(
                    "disbursementMessage",
                    error.message,
                    false
                );

            }

        }
    );

}


/* =========================================================
   DISPLAY SCHEMES
========================================================= */

function displaySchemes(schemes) {

    const table =
        document.getElementById(
            "schemeTableBody"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    schemes.forEach(function (scheme) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${scheme.schemeId}</td>

            <td>${escapeHtml(
            scheme.schemeName || "-"
        )}</td>

            <td>${escapeHtml(
            scheme.description || "-"
        )}</td>

            <td>
                ₹${Number(
            scheme.incomeLimit || 0
        ).toLocaleString("en-IN")}
            </td>

            <td>
                ${scheme.minimumMarks || 0}%
            </td>

            <td>
                ₹${Number(
            scheme.scholarshipAmount || 0
        ).toLocaleString("en-IN")}
            </td>

            <td>
                ${scheme.status || "-"}
            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================================================
   DISPLAY APPLICATIONS
========================================================= */

function displayApplications(applications) {

    const table =
        document.getElementById(
            "applicationTableBody"
        );


    const recentTable =
        document.getElementById(
            "recentApplicationTableBody"
        );


    if (table) {

        table.innerHTML = "";

        applications.forEach(function (application) {

            table.appendChild(
                createApplicationRow(application)
            );

        });

    }


    if (recentTable) {

        recentTable.innerHTML = "";


        const recentApplications =
            [...applications]
                .reverse()
                .slice(0, 10);


        recentApplications.forEach(
            function (application) {

                recentTable.appendChild(
                    createApplicationRow(
                        application
                    )
                );

            }
        );

    }

}


/* =========================================================
   CREATE APPLICATION ROW
========================================================= */

function createApplicationRow(application) {

    const row =
        document.createElement("tr");


    const studentName =
        application.student
            ? application.student.name
            : "-";


    const schemeName =
        application.scheme
            ? application.scheme.schemeName
            : "-";


    const eligibility =
        application.eligibilityStatus || "-";


    const status =
        application.applicationStatus || "-";


    row.innerHTML = `

        <td>
            ${application.applicationId}
        </td>

        <td>
            ${escapeHtml(studentName)}
        </td>

        <td>
            ${escapeHtml(schemeName)}
        </td>

        <td>
            ${createStatusBadge(eligibility)}
        </td>

        <td>
            ${createStatusBadge(status)}
        </td>

        <td>
            ${escapeHtml(
        application.remarks || "-"
    )}
        </td>

    `;


    return row;

}


/* =========================================================
   STATUS BADGE
========================================================= */

function createStatusBadge(status) {

    const value =
        String(status)
            .toUpperCase();


    let className =
        "status-badge";


    if (value === "ELIGIBLE") {

        className +=
            " status-eligible";

    }

    else if (value === "UNDER_REVIEW") {

        className +=
            " status-review";

    }

    else if (value === "VERIFIED" ||
        value === "APPROVED") {

        className +=
            " status-verified";

    }

    else if (value === "REJECTED") {

        className +=
            " status-rejected";

    }

    else if (value === "DISBURSED") {

        className +=
            " status-disbursed";

    }


    return `
        <span class="${className}">
            ${escapeHtml(status)}
        </span>
    `;

}


/* =========================================================
   HELPER
========================================================= */

function setElement(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


function showMessage(id, message, success) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.style.color =
        success
            ? "#16a34a"
            : "#dc2626";

}


async function readResponse(response) {

    const text =
        await response.text();


    if (!text) {
        return {};
    }


    try {

        return JSON.parse(text);

    }

    catch {

        return {
            message: text
        };

    }

}


function getErrorMessage(result) {

    if (!result) {
        return "Request failed";
    }


    if (result.message) {
        return result.message;
    }


    if (result.error) {
        return result.error;
    }


    if (typeof result === "string") {
        return result;
    }


    return "Request failed";

}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}