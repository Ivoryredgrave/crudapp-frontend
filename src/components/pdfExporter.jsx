import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import PropTypes from 'prop-types';

const PDFExporter = ({
  rows,
  columns,
  pdfFileName,
  branchName,
  departmentName,
  teamName,
  companyName
}) => {

  const getNestedPropertyValue = (object, accessorKey) => {
    const keys = accessorKey.split('.');
    let value = object;
    for (let key of keys) {
      value = value[key];
      if (value === undefined) return '';
    }
    return value;
  };

  const handleExportRows = () => {
    try {
      const orientation = 'landscape';
      const doc = new jsPDF(orientation);

      const filteredData = rows.map((row) => {
        const rowData = {};
        columns.forEach((column) => {
          let value = getNestedPropertyValue(row.original, column.accessorKey);

          if (column.accessorKey === 'permissions') {
            if (row.original.user_type === 'Admin') {
              value = 'All';
            } else if (value) {
              const pages = JSON.parse(value);
              value = pages.length > 0 ? pages.join('\n') : '';
            }
            rowData[column.header] = value;
          } else {
            rowData[column.header] = value;
          }
        });
        return rowData;
      });

      const today = new Date().toLocaleDateString();

      doc.setFontSize(15);
      doc.text(pdfFileName, 20, 10);

      doc.setFontSize(10);
      doc.text(branchName, 20, 16);

      doc.setFontSize(15);
      doc.text(departmentName, doc.internal.pageSize.width / 2, 10, { align: 'center' });

      doc.setFontSize(10);
      doc.text(teamName, doc.internal.pageSize.width / 2, 16, { align: 'center' });

      doc.setFontSize(15);
      doc.text(companyName, doc.internal.pageSize.width - 40, 10);

      doc.setFontSize(10);

      autoTable(doc, {
        startY: 20,
        theme: 'grid',
        columns: columns.map((col) => ({ header: col.header, dataKey: col.header })),
        body: filteredData,
        styles: {
          fontSize: 10,
          cellPadding: 2,
        },
        didDrawPage: (data) => {
          doc.text(
            'Page ' + data.pageNumber,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 5
          );
        },
      });

      doc.text(today, 10, doc.internal.pageSize.height - 10);

      doc.save(`${pdfFileName}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return {
    handleExportRows,
  };
};

export default PDFExporter;

PDFExporter.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string.isRequired,
    accessorKey: PropTypes.string.isRequired,
  })).isRequired,
  pdfFileName: PropTypes.string.isRequired,
  branchName: PropTypes.string.isRequired,
  departmentName: PropTypes.string.isRequired,
  teamName: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
};
