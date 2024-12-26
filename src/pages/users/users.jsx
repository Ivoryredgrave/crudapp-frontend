import React, { useState, useEffect, useRef, useCallback, startTransition } from "react";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { createMRTColumnHelper } from 'material-react-table';
import {
  Box,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';

import CustomBreadcrumbs from '../../components/customBreadcrumbs';
import CustomTable from "../../components/customTable";
import CustomAlert from "../../components/customAlert";

import { createUser, getUsers, updateUser } from "../../API/apiUsers";
import { getUserFromSession } from '../../utils/storageUtils';
import UserModal from "./userModal";

const breadcrumbItems = ['Users'];

const permissionsOptions = [
  '/users',
  '/dashboard',
];

const columnHelper = createMRTColumnHelper();

const columns = [
  columnHelper.accessor('user_type', {
    header: 'User type',
    size: 150,
    filterVariant: 'multi-select',
  }),
  columnHelper.accessor('full_name', { header: 'Full name', size: 150 }),
  columnHelper.accessor('status', {
    header: 'Status',
    size: 150,
    filterVariant: 'multi-select',
    Cell: ({ cell }) => (
      <Box
        component="span"
        sx={(theme) => ({
          backgroundColor: cell.getValue() === 'Active'
            ? theme.palette.success.light
            : cell.getValue() === 'Inactive'
              ? theme.palette.error.light
              : theme.palette.grey[400],
          borderRadius: '0.25rem',
          color: 'black',
          p: '0.25rem',
        })}
      >
        {cell.getValue()}
      </Box>
    ),
  }),
  columnHelper.accessor('username', { header: 'Username', size: 150 }),
  columnHelper.accessor('permissions', {
    header: 'Permissions',
    size: 150,
    enableColumnFilter: false,
    Cell: ({ row, cell }) => {
      const chipStyles = { width: '100%', margin: '2px 0' };
      const value = cell.getValue();
      const userType = row.original.user_type;

      if (userType === 'Admin') {
        return <Chip label="All" variant="outlined" color="primary" sx={chipStyles} />;
      }

      if (value) {
        const pages = JSON.parse(value);
        return (
          <>
            {pages.map((page, index) => (
              <Chip key={index} label={page} variant="outlined" color="secondary" sx={chipStyles} />
            ))}
          </>
        );
      }

      return null;
    },
  }),
  columnHelper.accessor('registration_date', { header: 'Created date', size: 150, enableColumnFilter: false }),
  columnHelper.accessor('last_update_date', { header: 'Last update date', size: 150, enableColumnFilter: false }),
  columnHelper.accessor('insertion_user', { header: 'Insertion user', size: 150, enableColumnFilter: false }),
  columnHelper.accessor('update_user', { header: 'Update user', size: 150, enableColumnFilter: false }),
];

const user = getUserFromSession();

const Users = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [isPermissionsDisabled, setIsPermissionsDisabled] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const formDataRef = useRef({
    full_name: '',
    username: '',
    password: '',
    insertion_user: user.full_name || '',
    user_type: '',
    status: 'Active',
  });
  const [_, setForceRender] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => { setShowPassword(!showPassword); };

  const handleOpen = () => {
    formDataRef.current = {
      full_name: '',
      username: '',
      password: '',
      user_type: '',
    };
    setPermissions([]);
    setOpen(true);
  };

  const handleClose = () => {
    formDataRef.current = {
      full_name: '',
      username: '',
      password: '',
      user_type: '',
    };
    setPermissions([]);
    setIsPermissionsDisabled(false);
    setIsEditing(false);
    setEditUserId(null);
    setOpen(false);
    setShowPassword(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    formDataRef.current[name] = value.trim();

    if (name === 'user_type') {

      setForceRender(prev => !prev);

      const isAdmin = value === 'Admin'
      setIsPermissionsDisabled(isAdmin);
      if (isAdmin) {
        setPermissions([]);
      }
    }

    if (name === 'status') {
      setForceRender(prev => !prev);
    }

  };

  const handlePageChange = (event) => {
    setPermissions(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    for (let key in formDataRef.current) {
      if (typeof formDataRef.current[key] === 'string') {
        formDataRef.current[key] = formDataRef.current[key].trim();
      }
    }

    if (!formDataRef.current.insertion_user) {
      formDataRef.current.insertion_user = user.full_name || '';
    }

    if (!formDataRef.current.full_name || !formDataRef.current.username || (!isEditing && !formDataRef.current.password)) {
      setAlert({
        open: true,
        message: 'Empty or blank fields are not allowed.',
        severity: 'error',
      });
      return;
    }

    if (isEditing && !formDataRef.current.password) {
      delete formDataRef.current.password;
    }

    try {
      formDataRef.current.permissions = permissions;

      if (isEditing) {
        await updateUser(editUserId, formDataRef.current);
        setAlert({
          open: true,
          message: 'User successfully updated',
          severity: 'success',
        });
        fetchUsers(false);
      } else {
        await createUser(formDataRef.current);
        setAlert({
          open: true,
          message: 'User successfully created',
          severity: 'success',
        });
        fetchUsers(false);
      }

      handleClose();
    } catch (error) {
      if (error.status === 409) {
        setAlert({
          open: true,
          message: 'Username already exists. Please choose a different one.',
          severity: 'error',
        });
      } else {
        setAlert({
          open: true,
          message: error.message || `Error ${isEditing ? 'updating' : 'creating'} user`,
          severity: 'error',
        });
      }
    }
  };

  const handleEdit = (row) => {
    const userData = row.original;
    formDataRef.current = {
      full_name: userData.full_name || '',
      username: userData.username || '',
      update_user: user.full_name || '',
      password: '',
      status: userData.status || 'Active',
      user_type: userData.user_type || '',
    };
    setPermissions(JSON.parse(userData.permissions) || []);
    setEditUserId(userData.user_id);
    setIsEditing(true);
    setIsPermissionsDisabled(userData.user_type === 'Admin');
    setOpen(true);
  };

  const fetchUsers = useCallback(
    async (shouldSetLoading = true) => {
      if (shouldSetLoading) setLoading(true);
      try {
        await getUsers((fetchedData) => {
          startTransition(() => {
            setData(fetchedData);
          });
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        if (shouldSetLoading) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Users | Crudapp</title>
        </Helmet>

        <CustomBreadcrumbs items={breadcrumbItems} />

        <CustomTable
          columns={columns}
          data={data}
          loading={loading}
          pageSize={25}
          customContent={
            <Button
              onClick={handleOpen}
              startIcon={<PersonAddIcon />}
            >
              Add user
            </Button>
          }
          enableRowActions={true}
          renderRowActions={({ row }) => (
            <Box>
              <IconButton onClick={() => handleEdit(row)}>
                <EditIcon />
              </IconButton>
            </Box>
          )}
          showExportButton={true}
          pdfFileName={"User Report"}
          branchName={"Branch Name"}
          departmentName={"Department Name"}
          teamName={"Team Name"}
          companyName={"Company Name"}
          enableColumnFilters={true}
          enableGlobalFilter={true}
          maxHeight={'66vh'}
        />

        <UserModal
          open={open}
          handleClose={handleClose}
          isEditing={isEditing}
          formDataRef={formDataRef}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          permissions={permissions}
          isPermissionsDisabled={isPermissionsDisabled}
          permissionsOptions={permissionsOptions}
          handlePageChange={handlePageChange}
        />

        <CustomAlert
          open={alert.open}
          message={alert.message}
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
        />

      </HelmetProvider>
    </>
  );
};

export default Users;