import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  LinearProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = location.state;
  const { token } = userDetails || {};

  // Project-specific states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [attachments, setAttachments] = useState([]);
  const [visibility, setVisibility] = useState("Public");
  const [roleFilters, setRoleFilters] = useState([]);
  const [institutionFilters, setInstitutionFilters] = useState([]);
  const [loading, setLoading] = useState(false);

  const roles = ["Student", "Faculty", "Alumni", "Admin"];
  const institutions = [
    "Heritage Institute of Technology",
    "Heritage Business School",
    "The Heritage Academy",
    "Heritage Law College",
    "The Heritage College",
    "Other"
  ];

  const handleAttachmentUpload = (event) => {
    setAttachments(event.target.files);
  };

  const handleCreateProject = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("skillsRequired", skillsRequired.join(","));
    formData.append("estimatedDuration", estimatedDuration);
    formData.append("teamSize", teamSize);
    formData.append("visibility", visibility);
    formData.append(
      "visibilityFilters",
      JSON.stringify({ role: roleFilters, institution: institutionFilters })
    );
    Array.from(attachments).forEach((file) => formData.append("attachments", file));

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/project/post-project`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      alert("Project posted successfully!");
      navigate("/post-feed", { state: userDetails });
    } catch (error) {
      console.error("Error creating project post:", error.message);
      alert("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Create New Project
      </Typography>
      <Card style={{ marginTop: "20px" }}>
        <CardContent>
          <TextField
            label="Project Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Project Description"
            multiline
            rows={4}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Skills Required (comma-separated)"
            fullWidth
            value={skillsRequired.join(",")}
            onChange={(e) => setSkillsRequired(e.target.value.split(","))}
            margin="normal"
          />
          <TextField
            label="Estimated Duration"
            fullWidth
            value={estimatedDuration}
            onChange={(e) => setEstimatedDuration(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Team Size"
            type="number"
            fullWidth
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Visibility</InputLabel>
            <Select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
              <MenuItem value="Public">Public</MenuItem>
              <MenuItem value="Connections Only">Connections Only</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </FormControl>

          {visibility === "Custom" && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Role Filters</InputLabel>
                <Select
                  multiple
                  value={roleFilters}
                  onChange={(e) => setRoleFilters(e.target.value)}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      <Checkbox checked={roleFilters.includes(role)} />
                      <ListItemText primary={role} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Institution Filters</InputLabel>
                <Select
                  multiple
                  value={institutionFilters}
                  onChange={(e) => setInstitutionFilters(e.target.value)}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {institutions.map((inst) => (
                    <MenuItem key={inst} value={inst}>
                      <Checkbox checked={institutionFilters.includes(inst)} />
                      <ListItemText primary={inst} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          <div style={{ margin: "20px 0" }}>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleAttachmentUpload}
            />
          </div>

          {loading && <LinearProgress style={{ marginBottom: "10px" }} />}

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateProject}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Project"
            }
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProjectPage;
