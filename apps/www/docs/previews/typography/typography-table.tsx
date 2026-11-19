const rows = [
  { section: 'Getting set up', owner: 'Priya', updated: 'Mar 4' },
  { section: 'Running locally', owner: 'Sam', updated: 'Mar 6' },
  { section: 'Shipping a change', owner: 'Ana', updated: 'Mar 11' },
];

export default function TypographyTable() {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">
        <thead>
          <tr className="border-t border-separator">
            <th className="border border-separator px-4 py-2 text-left font-bold">Section</th>
            <th className="border border-separator px-4 py-2 text-left font-bold">Owner</th>
            <th className="border border-separator px-4 py-2 text-left font-bold">Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.section} className="border-t border-separator even:bg-ui">
              <td className="border border-separator px-4 py-2 text-left">{row.section}</td>
              <td className="border border-separator px-4 py-2 text-left">{row.owner}</td>
              <td className="border border-separator px-4 py-2 text-left">{row.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
