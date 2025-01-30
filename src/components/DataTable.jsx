import React, { useEffect, useState } from "react";

const DynamicTable = () => {
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    // Fetch the data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://ipl-backend-cv67.onrender.com/api/all"
        ); // Replace with your backend API endpoint
        const data = await response.json();
        setTeamData(data.data); // Assuming data is inside `data.data` object
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to convert data to CSV format
  const convertToCSV = (data) => {
    const header = [
      "Team Name",
      "Team Size",
      "Team Leader Name",
      "Email",
      "Phone Number",
      "Team Members",
      "College",
    ];
    const rows = data.map((team) => [
      team.teamName,
      team.teamSize,
      team.teamLeaderName,
      team.email,
      team.phoneNumber,
      `${team.teamMember1}, ${team.teamMember2}, ${team.teamMember3}, ${team.teamMember4}`,
      team.college,
    ]);

    // Combine the header and rows into a single string
    const csvContent = [
      header.join(","), // Header row
      ...rows.map((row) => row.join(",")), // Data rows
    ].join("\n");

    return csvContent;
  };

  // Function to trigger the CSV download
  const downloadCSV = () => {
    const csvData = convertToCSV(teamData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      // Feature detection for browsers
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "team_data.csv"); // Filename for the download
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h2>Team Data</h2>
      <button onClick={downloadCSV} style={{ marginBottom: "10px" }}>
        Download CSV
      </button>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Team Size</th>
            <th>Team Leader Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Team Members</th>
            <th>College</th>
          </tr>
        </thead>
        <tbody>
          {teamData.length > 0 ? (
            teamData.map((team, index) => (
              <tr key={index}>
                <td>{team.teamName}</td>
                <td>{team.teamSize}</td>
                <td>{team.teamLeaderName}</td>
                <td>{team.email}</td>
                <td>{team.phoneNumber}</td>
                <td>{`${team.teamMember1}, ${team.teamMember2}, ${team.teamMember3}, ${team.teamMember4}`}</td>
                <td>{team.college}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No team data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
