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
const studentName = document.getElementById("studentName");
const studentEmail = document.getElementById("studentEmail");
const studentPhone = document.getElementById("studentPhone");
const studentIncome = document.getElementById("studentIncome");
const studentMarks = document.getElementById("studentMarks");
const studentCourse = document.getElementById("studentCourse");
const studentYear = document.getElementById("studentYear");


function showError(id, message) {
    document.getElementById(id).textContent = message;
}


function clearError(id) {
    document.getElementById(id).textContent = "";
}


/* STUDENT NAME */

studentName.addEventListener("input", function () {

    this.value = this.value.replace(/[^A-Za-z ]/g, "");

    if (this.value.trim() === "") {
        showError(
            "studentNameError",
            "Student name is required"
        );
    } else {
        clearError("studentNameError");
    }
});


/* EMAIL */

studentEmail.addEventListener("input", function () {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (this.value.trim() === "") {

        showError(
            "studentEmailError",
            "Email is required"
        );

    } else if (!emailPattern.test(this.value)) {

        showError(
            "studentEmailError",
            "Enter a valid email address"
        );

    } else {

        clearError("studentEmailError");
    }
});


/* PHONE */

studentPhone.addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, "");

    if (this.value.length !== 10) {

        showError(
            "studentPhoneError",
            "Phone number must contain exactly 10 digits"
        );

    } else {

        clearError("studentPhoneError");
    }
});


/* ANNUAL INCOME */

studentIncome.addEventListener("input", function () {

    const value = Number(this.value);

    if (this.value === "") {

        showError(
            "studentIncomeError",
            "Annual income is required"
        );

    } else if (value < 0) {

        showError(
            "studentIncomeError",
            "Income cannot be negative"
        );

    } else {

        clearError("studentIncomeError");
    }
});


/* MARKS */

studentMarks.addEventListener("input", function () {

    const value = Number(this.value);

    if (this.value === "") {

        showError(
            "studentMarksError",
            "Marks are required"
        );

    } else if (value < 0 || value > 100) {

        showError(
            "studentMarksError",
            "Marks must be between 0 and 100"
        );

    } else {

        clearError("studentMarksError");
    }
});


/* COURSE */

studentCourse.addEventListener("input", function () {

    this.value = this.value.replace(/[^A-Za-z ]/g, "");

    if (this.value.trim() === "") {

        showError(
            "studentCourseError",
            "Course is required"
        );

    } else {

        clearError("studentCourseError");
    }
});


/* YEAR */

studentYear.addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, "");

    const value = Number(this.value);

    if (this.value === "") {

        showError(
            "studentYearError",
            "Year is required"
        );

    } else if (value < 1 || value > 10) {

        showError(
            "studentYearError",
            "Enter a valid year"
        );

    } else {

        clearError("studentYearError");
    }
});


/* SUBMIT */

document.getElementById("studentForm").addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        let valid = true;

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        /* NAME */

        if (!studentName.value.trim()) {

            showError(
                "studentNameError",
                "Student name is required"
            );

            valid = false;
        }


        /* EMAIL */

        if (!emailPattern.test(studentEmail.value.trim())) {

            showError(
                "studentEmailError",
                "Enter a valid email address"
            );

            valid = false;
        }


        /* PHONE */

        if (!/^\d{10}$/.test(studentPhone.value)) {

            showError(
                "studentPhoneError",
                "Phone number must contain exactly 10 digits"
            );

            valid = false;
        }


        /* INCOME */

        if (
            studentIncome.value === "" ||
            Number(studentIncome.value) < 0
        ) {

            showError(
                "studentIncomeError",
                "Enter a valid annual income"
            );

            valid = false;
        }


        /* MARKS */

        if (
            studentMarks.value === "" ||
            Number(studentMarks.value) < 0 ||
            Number(studentMarks.value) > 100
        ) {

            showError(
                "studentMarksError",
                "Marks must be between 0 and 100"
            );

            valid = false;
        }


        /* COURSE */

        if (!studentCourse.value.trim()) {

            showError(
                "studentCourseError",
                "Course is required"
            );

            valid = false;
        }


        /* YEAR */

        if (
            studentYear.value === "" ||
            Number(studentYear.value) < 1 ||
            Number(studentYear.value) > 10
        ) {

            showError(
                "studentYearError",
                "Enter a valid year"
            );

            valid = false;
        }


        if (!valid) {
            return;
        }


        const student = {

            name: studentName.value.trim(),

            email: studentEmail.value.trim(),

            phone: studentPhone.value.trim(),

            annualIncome:
                Number(studentIncome.value),

            marks:
                Number(studentMarks.value),

            course:
                studentCourse.value.trim(),

            year:
                Number(studentYear.value)
        };


        try {

            const response = await fetch(
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


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to add student"
                );
            }


            document.getElementById(
                "studentMessage"
            ).innerHTML =
                `<span class="success-message">
                    Student added successfully
                </span>`;


            document.getElementById(
                "studentForm"
            ).reset();


            loadDashboard();


        } catch (error) {

            document.getElementById(
                "studentMessage"
            ).innerHTML =
                `<span class="error-message">
                    ${error.message}
                </span>`;
        }

    }
);
async function viewStudents() {

    const studentList =
        document.getElementById("studentList");

    try {

        const response =
            await fetch("/api/students");

        if (!response.ok) {
            throw new Error("Unable to load students");
        }

        const students =
            await response.json();

        if (students.length === 0) {

            studentList.innerHTML =
                "<p class='empty-message'>No students found.</p>";

            return;
        }


        let html = `
            <div class="student-list-header">
                <h3>All Students</h3>
                <span>${students.length} Students</span>
            </div>

            <div class="student-table-container">

                <table class="student-table">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Income</th>
                            <th>Marks</th>
                            <th>Course</th>
                            <th>Year</th>
                        </tr>
                    </thead>

                    <tbody>
        `;


        students.forEach(function(student) {

            html += `
                <tr>

                    <td>${student.studentId}</td>

                    <td>
                        <strong>
                            ${escapeHtml(student.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(student.email)}
                    </td>

                    <td>
                        ${escapeHtml(student.phone || "-")}
                    </td>

                    <td>
                        ₹${Number(
                student.annualIncome || 0
            ).toLocaleString("en-IN")}
                    </td>

                    <td>
                        ${student.marks || 0}%
                    </td>

                    <td>
                        ${escapeHtml(student.course || "-")}
                    </td>

                    <td>
                        ${student.year || "-"}
                    </td>

                </tr>
            `;

        });


        html += `
                    </tbody>

                </table>

            </div>
        `;


        studentList.innerHTML = html;

    }

    catch (error) {

        console.error(
            "Student Loading Error:",
            error
        );

        studentList.innerHTML = `
            <p class="error-message">
                Unable to load students.
            </p>
        `;

    }
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