import React, { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button, Skeleton } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PropTypes from 'prop-types';
import PDFExporter from './pdfExporter';
import { useTheme } from '@mui/material/styles';

const CustomTable = ({
  loading,
  columns,
  data,
  pdfFileName,
  branchName,
  departmentName,
  teamName,
  companyName,
  pageSize,
  customContent,
  showExportButton,
  enableColumnFilters = false,
  enableGlobalFilter = false,
  enableRowActions = false,
  renderRowActions,
  hideActions = false,
  pinnedColumns = null,
  maxHeight = undefined,
}) => {

  const memoizedColumns = useMemo(() => {

    return columns.filter(col => !(hideActions && col.id === 'actions'));
  }, [columns, hideActions]);

  const memoizedData = useMemo(() => data, [data]);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const table = useMaterialReactTable({
    columns: memoizedColumns,
    data: memoizedData,
    enableColumnFilters,
    enableHiding: false,
    enableGlobalFilter,
    enableFacetedValues: true,
    enableSorting: false,
    enableRowSelection: false,
    enableStickyHeader: true,
    enableColumnPinning: true,
    enableRowActions: !hideActions && enableRowActions,
    renderRowActions,
    initialState: {
      pagination: { pageSize, pageIndex: 0 },
      showGlobalFilter: true,
      ...(pinnedColumns ? { columnPinning: { left: pinnedColumns } } : {}),

    },
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 25, 50, 100, 200, 500],
      variant: 'outlined',
    },
    renderTopToolbarCustomActions: ({ table }) => {
      const pdfExporter = PDFExporter({
        rows: table.getPrePaginationRowModel().rows,
        columns: memoizedColumns,
        pdfFileName,
        branchName,
        departmentName,
        teamName,
        companyName
      });

      return (
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            padding: '8px',
            flexWrap: 'wrap',
          }}
        >
          {customContent && (
            <Box sx={{ marginLeft: 'auto' }}>
              {customContent}
            </Box>
          )}

          {showExportButton && (
            <Button
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              onClick={pdfExporter.handleExportRows}
              startIcon={<FileDownloadIcon />}
            >
              Export to PDF
            </Button>
          )}
        </Box>
      );
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: maxHeight,
        backgroundColor: isDarkMode ? '#2e2e2e' : '#f1f1f1',
        '&::-webkit-scrollbar': {
          width: '12px',
          height: '12px',
          backgroundColor: isDarkMode ? '#2e2e2e' : '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: isDarkMode ? '#757575' : '#c1c1c1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: isDarkMode ? '#9e9e9e' : '#a1a1a1',
        },
        '&::-webkit-scrollbar-corner': {
          backgroundColor: isDarkMode ? '#2e2e2e' : '#f1f1f1',
        },
      },
    },
  });

  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={maxHeight} />
      ) : (
        <MaterialReactTable table={table} />
      )}
    </>
  );
};

CustomTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      accessorKey: PropTypes.string,
      header: PropTypes.string.isRequired,
      size: PropTypes.number,
      Cell: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  pdfFileName: PropTypes.string,
  branchName: PropTypes.string,
  departmentName: PropTypes.string,
  teamName: PropTypes.string,
  companyName: PropTypes.string,
  pageSize: PropTypes.number,
  customContent: PropTypes.node,
  showExportButton: PropTypes.bool,
  enableColumnFilters: PropTypes.bool,
  enableGlobalFilter: PropTypes.bool,
  enableRowActions: PropTypes.bool,
  renderRowActions: PropTypes.func,
  hideActions: PropTypes.bool,
  pinnedColumns: PropTypes.arrayOf(PropTypes.string),
  maxHeight: PropTypes.string,
};

export default React.memo(CustomTable);
