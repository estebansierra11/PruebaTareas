import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { utils, writeFile } from 'xlsx';
import './js/dropExport.css';

const DropExport = ({ tableId }) => {
    const exportToPDF = async () => {
        const input = document.getElementById(tableId);
        if (!input) {
            console.error("Table not found");
            return;
        }

        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('table.pdf');
    };

    const exportToExcel = () => {
        const table = document.getElementById(tableId);
        if (!table) {
            console.error("Table not found");
            return;
        }

        const rows = [];
        for (let row of table.rows) {
            const rowData = [];
            for (let cell of row.cells) {
                if (cell.querySelector('input')) {
                    rowData.push(cell.querySelector('input').value);
                } else {
                    rowData.push(cell.innerText);
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

export default DropExport;
