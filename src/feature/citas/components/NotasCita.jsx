export default function NotasCita({
  value,
  onChange,
  label = "Notas para la cita",
  placeholder = "Ej: Chequeo preventivo, observaciones...",
  disabled = false,
}) {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 shadow-sm px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed placeholder:text-gray-400"
        rows={3}
        placeholder={placeholder}
        maxLength={250}
        disabled={disabled}
        spellCheck={false}
      />
      <div className="text-right text-xs text-gray-400 mt-1 select-none">
        {value.length}/250
      </div>
    </div>
  );
}
