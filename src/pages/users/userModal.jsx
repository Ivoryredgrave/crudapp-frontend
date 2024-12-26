import React from 'react';
import PropTypes from 'prop-types';
import {
    Modal,
    Box,
    Typography,
    Divider,
    Grid,
    TextField,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack,
    Button,
} from '@mui/material';
import {
    ManageAccounts as ManageAccountsIcon,
    PersonAdd as PersonAddIcon,
    Visibility,
    VisibilityOff,
    Add as AddIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { modalStyles } from '../../styles/modalStyles';

const UserModal = ({
    open,
    handleClose,
    isEditing,
    formDataRef,
    handleChange,
    handleSubmit,
    showPassword,
    togglePasswordVisibility,
    permissions,
    isPermissionsDisabled,
    permissionsOptions,
    handlePageChange,
}) => {

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyles}>
                <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                    {isEditing ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ManageAccountsIcon />
                            Edit user
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonAddIcon />
                            Create new user
                        </Box>
                    )}
                </Typography>

                <Divider />

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                margin="normal"
                                label="Full name"
                                name="full_name"
                                defaultValue={formDataRef.current.full_name}
                                onChange={handleChange}
                                autoComplete="off"
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>

                        {!isEditing && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    margin="normal"
                                    label="Username"
                                    name="username"
                                    defaultValue={formDataRef.current.username}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    inputProps={{ maxLength: 20 }}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required={!isEditing}
                                margin="normal"
                                label={isEditing ? 'Password (optional)' : 'Password'}
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                defaultValue={formDataRef.current.password}
                                onChange={handleChange}
                                autoComplete="off"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required margin="normal">
                                <InputLabel>Permissions</InputLabel>
                                <Select
                                    labelId="permissions-label"
                                    label="Permissions"
                                    id="permissions"
                                    multiple
                                    name="permissions"
                                    disabled={isPermissionsDisabled}
                                    value={permissions}
                                    onChange={handlePageChange}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {permissionsOptions.map((page) => (
                                        <MenuItem key={page} value={page}>
                                            {page}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl required fullWidth margin="normal">
                                <InputLabel id="user-type-label">User type</InputLabel>
                                <Select
                                    labelId="user-type-label"
                                    label="User type"
                                    name="user_type"
                                    value={formDataRef.current.user_type}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Admin">Admin</MenuItem>
                                    <MenuItem value="User">User</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {isEditing && (
                            <Grid item xs={12} sm={6}>
                                <FormControl required fullWidth margin="normal">
                                    <InputLabel id="status-label">Status</InputLabel>
                                    <Select
                                        labelId="status-label"
                                        label="Status"
                                        name="status"
                                        value={formDataRef.current.status}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                    </Grid>

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            marginTop: 3,
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            startIcon={<AddIcon />}
                        >
                            Save
                        </Button>
                        <Button
                            onClick={handleClose}
                            variant="contained"
                            color="primary"
                            startIcon={<ClearIcon />}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Modal>
    );
};

UserModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    formDataRef: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    showPassword: PropTypes.bool.isRequired,
    togglePasswordVisibility: PropTypes.func.isRequired,
    permissions: PropTypes.array.isRequired,
    isPermissionsDisabled: PropTypes.bool.isRequired,
    permissionsOptions: PropTypes.array.isRequired,
    handlePageChange: PropTypes.func.isRequired,
};

export default UserModal;