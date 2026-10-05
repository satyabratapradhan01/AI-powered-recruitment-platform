import React from 'react';

export const Table = ({ children, className = '', ...props }) => (
  <div className="w-full overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-xs">
    <table className={`w-full text-left text-sm text-slate-600 ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, className = '', ...props }) => (
  <thead
    className={`bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80 ${className}`}
    {...props}
  >
    {children}
  </thead>
);

export const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={`divide-y divide-slate-100 bg-white ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '', isClickable = false, ...props }) => (
  <tr
    className={`transition-colors duration-150 ${
      isClickable ? 'cursor-pointer hover:bg-slate-50/80' : 'hover:bg-slate-50/50'
    } ${className}`}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead = ({ children, className = '', ...props }) => (
  <th className={`px-5 py-3.5 ${className}`} {...props}>
    {children}
  </th>
);

export const TableCell = ({ children, className = '', ...props }) => (
  <td className={`px-5 py-4 whitespace-nowrap text-slate-700 ${className}`} {...props}>
    {children}
  </td>
);

export default Table;
