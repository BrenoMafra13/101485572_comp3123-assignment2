import {
  Avatar,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import useAuthGuard from "../../hooks/useAuthGuard";
import { getEmployee, removeEmployee } from "../../services/employeeService";
import { uploadUrl } from "../../services/api";

export default function EmployeeDetails() {
  useAuthGuard();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: employee,
    isLoading,
    error
  } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await getEmployee(id);
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: removeEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee-search"] });
      navigate("/employees");
    }
  });

  const handleDelete = () => {
    const confirmed = window.confirm("Delete this employee?");
    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (!employee) {
    return (
      <Stack spacing={2}>
        {(error || deleteMutation.error) && (
          <Typography color="error">
            {error?.response?.data?.error ||
              error?.message ||
              deleteMutation.error?.response?.data?.error ||
              deleteMutation.error?.message}
          </Typography>
        )}
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/employees")}>
          Back
        </Button>
      </Stack>
    );
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2} alignItems="center">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/employees")}>
            Back
          </Button>
          <Typography variant="h5">
            {employee.firstName} {employee.lastName}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/employees/${employee._id}/edit`)}
          >
            Edit
          </Button>
          <Button
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={3}>
          <Avatar
            src={uploadUrl(employee.picture)}
            variant="rounded"
            sx={{ width: "100%", height: 240 }}
          >
            {employee.firstName?.[0]}
          </Avatar>
        </Grid>
        <Grid item xs={12} md={9}>
          <Stack spacing={1}>
            <Typography variant="body1">
              Email: {employee.email}
            </Typography>
            <Typography variant="body1">
              Department: {employee.department}
            </Typography>
            <Typography variant="body1">
              Position: {employee.position}
            </Typography>
            <Typography variant="body1">
              Salary: ${Number(employee.salary).toLocaleString()}
            </Typography>
            <Typography variant="body1">
              Address: {employee.address}
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      {(error || deleteMutation.error) && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography color="error">
            {error?.response?.data?.error ||
              error?.message ||
              deleteMutation.error?.response?.data?.error ||
              deleteMutation.error?.message}
          </Typography>
        </>
      )}
    </Paper>
  );
}
