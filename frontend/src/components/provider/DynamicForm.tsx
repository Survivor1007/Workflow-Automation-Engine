import { type ProviderSchema } from "../../types/api";
import { useEditorStore } from "../../store/editorStore";
import { FieldRenderer } from "./FieldRenderer";

interface DynamicFormProps {
  schema: ProviderSchema;
  stepId: string;
}

export function DynamicForm({ schema, stepId }: DynamicFormProps) {
  const { steps, updateStepConfig } = useEditorStore();
  
  // Find the exact step data we are editing
  const step = steps.find(s => s.id === stepId);

  if (!step) return null;

  // The callback fired by individual FieldRenderers
  const handleFieldChange = (fieldName: string, value: any) => {
    updateStepConfig(stepId, { [fieldName]: value });
  };

  return (
    <div className="space-y-6">
      {schema.fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label htmlFor={field.name} className="block text-sm font-medium text-zinc-900 mb-1">
            {field.title} {field.required && <span className="text-red-500">*</span>}
          </label>
          
          {field.description && (
            <p className="text-xs text-zinc-500 mb-2">{field.description}</p>
          )}

          <FieldRenderer 
            field={field} 
            value={step.config[field.name]} 
            onChange={handleFieldChange} 
          />
        </div>
      ))}
    </div>
  );
}