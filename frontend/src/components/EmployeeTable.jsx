import {
  Avatar,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { uploadUrl } from "../services/api";

export default function EmployeeTable({
  rows,
  loading,
  onView,
  onEdit,
  onDelete
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Photo</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Position</TableCell>
            <TableCell align="right">Salary</TableCell>
            <TableCell align="center" width={180}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <CircularProgress size={32} />
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography>No employees found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>
                  <Avatar
                    src={uploadUrl(row.picture)}
                    alt={row.firstName}
                    variant="rounded"
                  >
                    {row.firstName?.[0]}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Stack>
                    <Typography fontWeight={600}>
                      {row.firstName} {row.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {row.address}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.position}</TableCell>
                <TableCell align="right">
                  ${Number(row.salary || 0).toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton color="primary" onClick={() => onView(row._id)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="info" onClick={() => onEdit(row._id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(row._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
