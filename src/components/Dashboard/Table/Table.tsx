import { Modal } from "@/components/BellMazeh/Modal";
import { useState } from "react";
import { CellData, CellTypeEnum, TableProps } from "./types";

const Table = ({ columns, data, className = "", onSort }: TableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleRow = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  const renderCell = (cellData: CellData, cellType: CellTypeEnum) => {
    switch (cellType) {
      case "text":
        return <span className="text-gray-800">{cellData as string}</span>;

      case "text-bold":
        return <span className="font-bold text-gray-900">{cellData as string}</span>;

      case "status":
        return (
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              cellData ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {(cellData as boolean) ? "فعال" : "غیرفعال"}
          </span>
        );

      case "button": {
        const { onClick, label } = cellData as { onClick: () => void; label: string };
        return (
          <button
            onClick={onClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {label}
          </button>
        );
      }

      case "modal": {
        const { label } = cellData as { label: string };
        return (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            {label}
          </button>
        );
      }

      case "link": {
        const { href, label } = cellData as { href: string; label: string };
        return (
          <a href={href} className="text-blue-500 hover:text-blue-600 underline">
            {label}
          </a>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      {/* Desktop View */}
      <table className="hidden md:table w-full">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-right ${column.sortable ? "cursor-pointer" : ""}`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center justify-between">
                  {column.header}
                  {column.sortable && (
                    <span className="text-gray-400">
                      {sortConfig?.key === column.key &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-gray-50 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4">
                  {renderCell(row[column.key], column.cellType)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="bg-white rounded-lg shadow p-4 space-y-2">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleRow(rowIndex)}
            >
              <span className="font-bold">
                {renderCell(row[columns[0].key], columns[0].cellType)}
              </span>
              <span
                className={`transform transition-transform ${
                  expandedRows.has(rowIndex) ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>

            {expandedRows.has(rowIndex) && (
              <div className="pt-2 space-y-2">
                {columns.slice(1).map((column) => (
                  <div key={column.key} className="flex justify-between">
                    <span className="text-gray-600">{column.header}:</span>
                    <span>{renderCell(row[column.key], column.cellType)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <>test</>
      </Modal>
    </div>
  );
};

export default Table;
