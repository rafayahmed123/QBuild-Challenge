/* eslint-disable react/prop-types */
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const MyTable = ({ data }) => {
    const tableContainerStyle = {
        maxHeight: '300px',
        width: '100%',
        marginTop: '20px',
        overflow: 'auto', 
        border: '2px solid #000000', 
    };

    return (
        <TableContainer component={Paper} style={tableContainerStyle}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>PARENT_NAME</TableCell>
                        <TableCell>COMPONENT_NAME</TableCell>
                        <TableCell>PART_NUMBER</TableCell>
                        <TableCell>TITLE</TableCell>
                        <TableCell>QUANTITY</TableCell>
                        <TableCell>TYPE</TableCell>
                        <TableCell>ITEM</TableCell>
                        <TableCell>MATERIAL</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{row.PARENT_NAME}</TableCell>
                            <TableCell>{row.COMPONENT_NAME}</TableCell>
                            <TableCell>{row.PART_NUMBER}</TableCell>
                            <TableCell>{row.TITLE}</TableCell>
                            <TableCell>{row.QUANTITY}</TableCell>
                            <TableCell>{row.TYPE}</TableCell>
                            <TableCell>{row.ITEM}</TableCell>
                            <TableCell>{row.MATERIAL}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MyTable;
