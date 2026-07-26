const TableRowSkeleton = ({ columns = 4 }) => (
  <tr className="border-t animate-pulse">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="p-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
    ))}
  </tr>
);

export default TableRowSkeleton;
