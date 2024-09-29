import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { utils, writeFile } from 'xlsx';
import './js/dropExport.css';

const Export = ({ tableId }) => {
    const exportToPDF = async () => {
        const input = document.getElementById(tableId);
        if (!input) {
            console.error("Table not found");
            return;
        }

    
        const columnsToHide = input.querySelectorAll('.hide-column');
        columnsToHide.forEach(col => {
            col.style.display = 'none';
        });

        
        const canvas = await html2canvas(input, { scale: 2 }); 
        const imgData = canvas.toDataURL('image/png');

        
        const pdf = new jsPDF({
            orientation: 'landscape', 
            unit: 'px',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

    
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

        const imgScaledWidth = imgWidth * ratio;
        const imgScaledHeight = imgHeight * ratio;

        pdf.addImage(imgData, 'PNG', 0, 0, imgScaledWidth, imgScaledHeight);
        pdf.save('table.pdf');

        
        columnsToHide.forEach(col => {
            col.style.display = '';
        });
    };

    const exportToExcel = () => {
        const table = document.getElementById(tableId);
        if (!table) {
            console.error("Tabla no existe");
            return;
        }

        const rows = [];
        for (let row of table.rows) {
            const rowData = [];
            for (let cell of row.cells) {
                
                if (!cell.classList.contains('hide-column')) {
                    if (cell.querySelector('input')) {
                        rowData.push(cell.querySelector('input').value);
                    } else {
                        rowData.push(cell.innerText);
                    }
                }
            }
            rows.push(rowData);
        }

        const ws = utils.aoa_to_sheet(rows);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Sheet1');
        writeFile(wb, 'table.xlsx');
    };

    return (
        <div className="dropdown-container">
            <div className="btn-group dropend">
                <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    Exportar
                </button>
                <ul className="dropdown-menu">
                    <li>
                        <button className="dropdown-item" type="button" onClick={exportToPDF}>
                            <FontAwesomeIcon icon={faFilePdf} className="menu-icon" style={{ color: 'red' }} />
                            PDF
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" type="button" onClick={exportToExcel}>
                            <FontAwesomeIcon icon={faFileExcel} className="menu-icon" style={{ color: 'green' }} />
                            Excel
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Export;


