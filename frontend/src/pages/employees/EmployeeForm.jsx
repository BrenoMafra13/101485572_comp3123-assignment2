import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UploadIcon from "@mui/icons-material/Upload";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import useAuthGuard from "../../hooks/useAuthGuard";
import {
  createEmployee,
  getEmployee,
  updateEmployee
} from "../../services/employeeService";
import { uploadUrl } from "../../services/api";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  salary: "",
  department: "",
  position: ""
};

export default function EmployeeForm() {
  useAuthGuard();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();

  const [form, setForm] = useState(emptyForm);
  const [pictureFile, setPictureFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [formError, setFormError] = useState("");

  const { data: existingEmployee, isLoading: loadingEmployee, error: fetchError } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await getEmployee(id);
      return res.data;
    },
    enabled: isEdit
  });

  useEffect(() => {
    if (existingEmployee) {
      setForm({
        firstName: existingEmployee.firstName || "",
        lastName: existingEmployee.lastName || "",
        email: existingEmployee.email || "",
        address: existingEmployee.address || "",
        salary: existingEmployee.salary ? String(existingEmployee.salary) : "",
        department: existingEmployee.department || "",
        position: existingEmployee.position || ""
      });
      if (existingEmployee.picture) {
        setPreview(uploadUrl(existingEmployee.picture));
      }
    }
  }, [existingEmployee]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPictureFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const required = ["firstName", "lastName", "email", "address", "salary", "department", "position"];
    const missing = required.some((key) => !form[key]);
    if (missing) {
      setFormError("All fields are required");
      return false;
    }
    setFormError("");
    return true;
  };

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? updateEmployee(id, payload) : createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee-search"] });
      if (isEdit) {
        queryClient.invalidateQueries({ queryKey: ["employee", id] });
      }
      navigate("/employees");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      salary: Number(form.salary)
    };
    if (pictureFile) {
      payload.picture = pictureFile;
    }
    mutation.mutate(payload);
  };

  if (isEdit && loadingEmployee && !existingEmployee) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/employees")}
        >
          Back
        </Button>
        <Typography variant="h5">
          {isEdit ? "Edit Employee" : "Add Employee"}
        </Typography>
      </Stack>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Stack spacing={2} alignItems="center">
              <Avatar
                src={preview}
                sx={{ width: 140, height: 140 }}
                variant="rounded"
              >
                {form.firstName?.[0]}
              </Avatar>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
              >
                Upload photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="First name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Last name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Position"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Salary"
                  name="salary"
                  type="number"
                  value={form.salary}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {(formError || fetchError || mutation.error) && (
          <Typography color="error" sx={{ mt: 3 }}>
            {formError ||
              fetchError?.response?.data?.error ||
              fetchError?.message ||
              mutation.error?.response?.data?.error ||
              mutation.error?.message}
          </Typography>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={mutation.isPending || loadingEmployee}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/employees")}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
