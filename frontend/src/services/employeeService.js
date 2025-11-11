import api from "./api";

const formDataFromPayload = (payload) => {
  const data = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      data.append(key, value);
    }
  });
  return data;
};

export const getEmployees = () => api.get("/employees");

export const searchEmployees = (filters) =>
  api.get("/employees/search", { params: filters });

export const getEmployee = (id) => api.get(`/employees/${id}`);

export const createEmployee = (payload) =>
  api.post("/employees", formDataFromPayload(payload), {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const updateEmployee = (id, payload) =>
  api.put(`/employees/${id}`, formDataFromPayload(payload), {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const removeEmployee = (id) => api.delete(`/employees/${id}`);
