import { type ProviderSchema } from "../../types/api";
import { useEditorStore } from "../../store/editorStore";
import { FieldRenderer } from "./FieldRenderer";

interface DynamicFormProps {
  schema: ProviderSchema;
  stepId: string;
}

export function DynamicForm({ schema, stepId }: DynamicFormProps) {
  const { steps, updateStepConfig } = useEditorStore();
  const step = steps.find(s => s.id === stepId);

  if (!step) return null;

  const handleFieldChange = (fieldName: string, value: any) => {
    updateStepConfig(stepId, { [fieldName]: value });
  };

  const properties = schema.ui_schema?.properties || {};
  const requiredFields = schema.ui_schema?.required || [];

  return (
    <div className="space-y-6">
      {Object.entries(properties).map(([fieldName, fieldSchema]) => {
        const isRequired = requiredFields.includes(fieldName);
        
        // Merge the key into the object so FieldRenderer knows the field name
        const fieldProps = { name: fieldName, ...fieldSchema } as any;

        return (
          <div key={fieldName} className="flex flex-col">
            <label htmlFor={fieldName} className="block text-sm font-medium text-zinc-900 mb-1">
              {fieldSchema.title || fieldName} {isRequired && <span className="text-red-500">*</span>}
            </label>
            
            {fieldSchema.description && (
              <p className="text-xs text-zinc-500 mb-2">{fieldSchema.description}</p>
            )}

            <FieldRenderer 
              field={fieldProps} 
              value={step.config[fieldName]} 
              onChange={handleFieldChange} 
            />
          </div>
        );
      })}
    </div>
  );
}