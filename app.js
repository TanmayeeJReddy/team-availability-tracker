async function loadMembers() {
    try {
        const response = await fetch("http://localhost:5000/api/members");
        const members = await response.json();

        const teamList = document.getElementById("team-list");

        teamList.innerHTML = "";

        members.forEach(member => {
            const memberDiv = document.createElement("div");

            memberDiv.className = "member";

            memberDiv.innerHTML = `
                <div class="member-name">
                    ${member.name}
                </div>

                <select 
                    class="status-select"
                    onchange="updateStatus(${member.id}, this.value)"
                >
                    <option value="Available" ${member.status === "Available" ? "selected" : ""}>
                        Available
                    </option>

                    <option value="Busy" ${member.status === "Busy" ? "selected" : ""}>
                        Busy
                    </option>

                    <option value="Away" ${member.status === "Away" ? "selected" : ""}>
                        Away
                    </option>
                </select>
            `;

            teamList.appendChild(memberDiv);
        });

    } catch (error) {
        console.error("Error loading team members:", error);
    }
}


async function updateStatus(id, status) {
    try {
        const response = await fetch(
            `http://localhost:5000/api/members/${id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: status
                })
            }
        );

        const data = await response.json();

        console.log("Status updated:", data);

        loadMembers();

    } catch (error) {
        console.error("Error updating status:", error);
    }
}


loadMembers();

setInterval(loadMembers, 5000);