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
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = location.state;
  const { token } = userDetails || {};

  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [media, setMedia] = useState([]);
  const [visibility, setVisibility] = useState("Public");
  const [roleFilters, setRoleFilters] = useState([]);
  const [institutionFilters, setInstitutionFilters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Predefined options
  const roles = ["Student", "Faculty", "Alumni", "Admin"];
  const institutions = [
    "Heritage Law College",
    "Heritage Technology College",
    "Heritage Business Academy",
    "Heritage Arts & Humanities College",
    "Heritage Medical College",
    "Heritage School of Architecture",
    "Other",
  ];
  const categories = [
    "Announcement",
    "Discussion",
    "Idea",
    "Event",
    "Achievement",
    "Help Request",
  ];
  const availableTags = [
    "Leadership",
    "Research",
    "Entrepreneurship",
    "Programming",
    "AI",
    "Data Science",
    "Cybersecurity",
    "Robotics",
    "Human Rights",
    "Corporate Law",
    "Criminal Justice",
    "Marketing",
    "Finance",
    "Business Strategy",
    "Public Health",
    "Medicine",
    "Biotech",
    "UI/UX",
    "Graphic Design",
    "Architecture",
    "Physics",
    "Chemistry",
    "Biology",
    "Sports",
    "Music",
    "Arts",
    "Photography",
    "Writing",
    "Traveling",
    "Volunteering",
    "Other",
  ];

  const handleMediaUpload = (event) => {
    setMedia(event.target.files);
  };

  const handleCreatePost = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("content", content);
    formData.append("category", category);
    formData.append("visibility", visibility);

    // Safely handle tags
    try {
      formData.append("tags", JSON.stringify(tags));
    } catch (error) {
      console.error("Error parsing tags:", error.message);
      alert("Invalid tags format. Please check your input.");
      setLoading(false);
      return;
    }

    // Safely handle visibility filters
    const visibilityFiltersData = {
      role: roleFilters,
      institution: institutionFilters,
    };
    try {
      formData.append("visibilityFilters", JSON.stringify(visibilityFiltersData));
    } catch (error) {
      console.error("Error parsing visibility filters:", error.message);
      alert("Invalid visibility filters format. Please check your selections.");
      setLoading(false);
      return;
    }

    // Append media files
    for (let i = 0; i < media.length; i++) {
      formData.append("media", media[i]);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/create-post`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Post created successfully!");
      navigate("/post-feed", { state: userDetails });
    } catch (error) {
      console.error("Error creating post:", error.message);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!userDetails) {
    return <p>User details not found. Please log in again.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Create New Post
      </Typography>
      <Card style={{ padding: "20px", marginTop: "20px" }}>
        <CardContent>
          <TextField
            label="Content"
            multiline
            rows={4}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {availableTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  <Checkbox checked={tags.includes(tag)} />
                  <ListItemText primary={tag} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
              onChange={handleMediaUpload}
            />
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreatePost}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Post"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePostPage;
