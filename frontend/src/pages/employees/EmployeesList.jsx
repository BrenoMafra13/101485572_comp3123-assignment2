import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import useAuthGuard from "../../hooks/useAuthGuard";
import EmployeeTable from "../../components/EmployeeTable";
import {
  getEmployees,
  searchEmployees,
  removeEmployee
} from "../../services/employeeService";

const initialFilters = {
  name: "",
  department: "",
  position: ""
};

export default function EmployeesList() {
  useAuthGuard();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(initialFilters);
  const [activeFilters, setActiveFilters] = useState(null);

  const fetchEmployees = async () => {
    if (activeFilters && Object.keys(activeFilters).length > 0) {
      const res = await searchEmployees(activeFilters);
      return res.data;
    }
    const res = await getEmployees();
    return res.data;
  };

  const nonEmptyFilters = () => {
    const payload = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) payload[key] = value;
    });
    return payload;
  };

  const {
    data: rows = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["employees", activeFilters],
    queryFn: fetchEmployees
  });

  const deleteMutation = useMutation({
    mutationFn: removeEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    }
  });

  const handleSearch = () => {
    const params = nonEmptyFilters();
    setActiveFilters(Object.keys(params).length ? params : null);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Delete this employee?");
    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setActiveFilters(null);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Employees</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/employees/new")}
        >
          Add Employee
        </Button>
      </Stack>

      {(error || deleteMutation.error) && (
        <Typography color="error">
          {error?.response?.data?.error ||
            error?.message ||
            deleteMutation.error?.response?.data?.error ||
            deleteMutation.error?.message}
        </Typography>
      )}

      <Box component="section">
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Name"
            name="name"
            value={filters.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Department"
            name="department"
            value={filters.department}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Position"
            name="position"
            value={filters.position}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button startIcon={<ClearIcon />} onClick={handleReset}>
            Clear
          </Button>
        </Stack>
      </Box>

      <EmployeeTable
        rows={rows}
        loading={isLoading || deleteMutation.isPending}
        onView={(id) => navigate(`/employees/${id}`)}
        onEdit={(id) => navigate(`/employees/${id}/edit`)}
        onDelete={handleDelete}
      />
    </Stack>
  );
}
