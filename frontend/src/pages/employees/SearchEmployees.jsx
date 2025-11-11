import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import useAuthGuard from "../../hooks/useAuthGuard";
import EmployeeTable from "../../components/EmployeeTable";
import {
  searchEmployees,
  removeEmployee
} from "../../services/employeeService";
import { useNavigate } from "react-router-dom";

const initialFilters = {
  name: "",
  department: "",
  position: ""
};

export default function SearchEmployees() {
  useAuthGuard();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(initialFilters);
  const [queryFilters, setQueryFilters] = useState(null);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const nonEmptyFilters = () => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    return params;
  };

  const {
    data: rows = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["employee-search", queryFilters],
    queryFn: async () => {
      const res = await searchEmployees(queryFilters);
      return res.data;
    },
    enabled: Boolean(queryFilters)
  });

  const deleteMutation = useMutation({
    mutationFn: removeEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-search"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    }
  });

  const handleSearch = () => {
    const params = nonEmptyFilters();
    if (Object.keys(params).length === 0) {
      setFormError("Enter at least one filter");
      return;
    }
    setFormError("");
    setQueryFilters(params);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setQueryFilters(null);
    setFormError("");
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Delete this employee?");
    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Search Employees</Typography>

      <Box>
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
        {(formError || error || deleteMutation.error) && (
          <Typography color="error" sx={{ mt: 2 }}>
            {formError ||
              error?.response?.data?.error ||
              error?.message ||
              deleteMutation.error?.response?.data?.error ||
              deleteMutation.error?.message}
          </Typography>
        )}
      </Box>

      {queryFilters && (
        <EmployeeTable
          rows={rows}
          loading={isLoading || deleteMutation.isPending}
          onView={(id) => navigate(`/employees/${id}`)}
          onEdit={(id) => navigate(`/employees/${id}/edit`)}
          onDelete={handleDelete}
        />
      )}
    </Stack>
  );
}
