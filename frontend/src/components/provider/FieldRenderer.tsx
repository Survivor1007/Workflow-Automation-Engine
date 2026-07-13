import { type SchemaField } from "../../types/api";
import { cn } from "../../utils/cn";

interface FieldRendererProps {
  field: SchemaField;
  value: any;
  onChange: (name: string, value: any) => void;
}

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const baseInputClass = "w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all";

  // Provide fallback to default if value is undefined
  const currentValue = value !== undefined ? value : (field.default || "");

  switch (field.type) {
    case "string":
      return (
        <input
          type="text"
          id={field.name}
          value={currentValue}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={baseInputClass}
          placeholder={`Enter ${field.title.toLowerCase()}...`}
        />
      );

    case "textarea":
      return (
        <textarea
          id={field.name}
          value={currentValue}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={cn(baseInputClass, "min-h-[100px] font-mono text-xs")}
          placeholder={`Accepts {{ variables }}...`}
        />
      );

    case "integer":
      return (
        <input
          type="number"
          id={field.name}
          value={currentValue}
          onChange={(e) => onChange(field.name, parseInt(e.target.value, 10))}
          className={baseInputClass}
        />
      );

    case "boolean":
      return (
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id={field.name}
            checked={!!currentValue}
            onChange={(e) => onChange(field.name, e.target.checked)}
            className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900"
          />
          <span className="ml-2 text-sm text-zinc-600">Enable this option</span>
        </div>
      );

    default:
      return <div className="text-red-500 text-sm">Unsupported field type: {field.type}</div>;
  }
}