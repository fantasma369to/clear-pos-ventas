import React, { useState } from "react";
import styled from "styled-components";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

import { FaArrowsAltV } from "react-icons/fa";
import { Paginacion } from "../organismos/tablas/Paginacion";
import { ContentAccionesTabla } from "../organismos/tablas/ContentAccionesTabla";
import { Device } from "../../styles/breakpoints";
import { Check } from "../ui/toggles/Check";

export function TablaCrudTemplate({ data, columns, onEdit, onDelete,checkEdit }) {
  const [pagina, setPagina] = useState(1);
  const table = useReactTable({
    data,
    columns: [
      ...columns,
      ...(onEdit || onDelete
        ? [
            {
              id: "acciones",
              enableSorting: false,
              cell: (info) => (
                <div>
                  <ContentAccionesTabla
                    funcionEditar={onEdit && (() => onEdit(info.row.original))}
                    funcionEliminar={
                      onDelete && (() => onDelete(info.row.original))
                    }
                  />
                </div>
              ),
            },
           
          ]
        : [
          checkEdit &&
            {
              id: "check",
              accessorKey: "por_default",
              header: "Por default",
              enableSorting: false,
              cell: (info) => (
                <div className="ContentCell">
                  <Check onChange={() => CheckEdit(info.row.original)} checked={info.getValue()} />
                </div>
              ),
            },
        ]),
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Container>
      <table className="responsive-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getCanSort() && (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <FaArrowsAltV />
                    </span>
                  )}
                  {
                    {
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted()]
                  }
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${
                      header.column.getIsResizing() ? "isResizing" : ""
                    }`}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((item) => (
            <tr key={item.id}>
              {item.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Paginacion
        table={table}
        irinicio={() => table.setPageIndex(0)}
        pagina={table.getState().pagination.pageIndex + 1}
        setPagina={setPagina}
        maximo={table.getPageCount()}
      />
    </Container>
  );
}
const Container = styled.div`
  position: relative;

  .responsive-table {
    width: 100%;
    margin-bottom: 1.5em;
    border-spacing: 0;
    font-size: 0.7em;
    .ContentCell{
  display:flex;
  margin:auto;
  justify-content:center;
}
    @media ${Device.tablet} {
      font-size: 0.9em;
      transform: scale(1);
    }

    thead {
      position: relative;
      width: auto;
      overflow: auto;

      height: 50px;

      th {
        border-bottom: 1px solid ${({ theme }) => theme.color2};
        font-weight: 700;
        text-align: center;
        color: ${({ theme }) => theme.text};

        &:first-of-type {
          text-align: center;
        }
      }
    }
    tbody {
      tr {
        height: 50px;
        display: table-row;
        margin-bottom: 0;
        &:nth-of-type(even) {
          background-color: rgba(161, 161, 161, 0.1);
        }
        td {
          text-align: center;
          padding: 0.5em;
          border-bottom: 1px solid rgba(161, 161, 161, 0.32);

          @media (max-width: 768px) {
            padding: 0.4em;
          }
        }
      }
    }
  }
`;
