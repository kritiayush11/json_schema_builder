import { useState, useEffect } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  type Control,
  type FieldPath,
} from "react-hook-form";
import { Plus, X, ChevronDown, ChevronRight, Copy, Trash2 } from "lucide-react";

// Types
type FieldType = "string" | "number" | "nested";

interface SchemaField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  nested?: SchemaField[];
}

interface FormData {
  fields: SchemaField[];
}

// UI Components
const Input = ({ className = "", error = false, ...props }: any) => (
  <input
    className={`h-9 px-3 py-1 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      error ? "border-red-500" : "border-gray-300"
    } ${className}`}
    {...props}
  />
);

const Select = ({
  children,
  value,
  onChange,
  className = "",
  error = false,
}: any) => {
  return (
    <select
      value={value || ""}
      onChange={onChange}
      className={`h-9 px-3 py-1 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
        error ? "border-red-500" : "border-gray-300"
      } ${className}`}
    >
      {children}
    </select>
  );
};

const Switch = ({ checked, onChange, disabled = false }: any) => (
  <label
    className={`relative inline-flex items-center ${
      disabled ? "cursor-not-allowed" : "cursor-pointer"
    }`}
  >
    <input
      type="checkbox"
      className="sr-only"
      checked={checked || false}
      onChange={onChange}
      disabled={disabled}
    />
    <div
      className={`w-11 h-6 rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-gray-300"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        } mt-0.5`}
      />
    </div>
  </label>
);

type ButtonVariant = "primary" | "outline" | "danger" | "ghost";
type ButtonSize = "default" | "sm" | "xs";

const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary" as ButtonVariant,
  disabled = false,
  size = "default" as ButtonSize,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  size?: ButtonSize;
  type?: "button" | "submit";
}) => {
  const baseClass =
    "font-medium rounded-md transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400",
    ghost: "text-gray-600 hover:bg-gray-100 disabled:text-gray-400",
  };

  const sizes: Record<ButtonSize, string> = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    xs: "px-2 py-1 text-xs",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

// Notification Component
const Toast = ({
  message,
  type = "success",
  onClose,
}: {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}) => (
  <div
    className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`}
  >
    <div className="flex items-center justify-between">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <X size={16} />
      </button>
    </div>
  </div>
);

// Field Row Component
const FieldRow = ({
  fieldPath,
  control,
  remove,
  nestingLevel = 0,
  showRemove = true,
  errors = {},
}: {
  fieldPath: FieldPath<FormData>;
  control: Control<FormData>;
  remove: () => void;
  nestingLevel?: number;
  showRemove?: boolean;
  errors?: any;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const fieldValue = control._getWatch(fieldPath);
  const fieldType = fieldValue?.type;

  // Get nested path for errors
  const pathParts = fieldPath.split(".");
  let currentErrors = errors;
  pathParts.forEach((part) => {
    if (currentErrors && currentErrors[part]) {
      currentErrors = currentErrors[part];
    }
  });

  return (
    <div
      className={`${
        nestingLevel > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        {/* Collapse/Expand for nested fields */}
        {fieldType === "nested" && (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        )}

        <div className="flex-1">
          <Controller
            name={`${fieldPath}.name` as FieldPath<FormData>}
            control={control}
            rules={{ required: "Field name is required" }}
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  placeholder="Field name"
                  className="w-full"
                  error={fieldState.error}
                />
                {fieldState.error && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="w-32">
          <Controller
            name={`${fieldPath}.type` as FieldPath<FormData>}
            control={control}
            rules={{ required: "Type is required" }}
            render={({ field, fieldState }) => (
              <div>
                <Select
                  value={field.value}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    field.onChange(e.target.value)
                  }
                  error={fieldState.error}
                >
                  <option value="">Field Type</option>
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="nested">nested</option>
                </Select>
                {fieldState.error && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">Required</span>
          <Controller
            name={`${fieldPath}.required` as FieldPath<FormData>}
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.onChange(e.target.checked)
                }
              />
            )}
          />
        </div>

        {showRemove && (
          <Button
            variant="ghost"
            size="xs"
            onClick={remove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {fieldType === "nested" && !isCollapsed && (
        <div className="mt-4 pl-4 border-l-2 border-blue-200 bg-blue-50 rounded-r-md">
          <NestedFieldsArray
            parentPath={fieldPath}
            control={control}
            nestingLevel={nestingLevel + 1}
            errors={currentErrors}
          />
        </div>
      )}
    </div>
  );
};

// Nested Fields Component
const NestedFieldsArray = ({
  parentPath,
  control,
  nestingLevel,
  errors = {},
}: {
  parentPath: string;
  control: Control<FormData>;
  nestingLevel: number;
  errors?: any;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: control as unknown as Control<any>,
    name: `${parentPath}.nested`,
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addNestedField = () => {
    append({
      id: generateId(),
      name: "",
      type: "string" as FieldType,
      required: false,
      nested: [],
    } as any);
  };

  return (
    <div className="space-y-4">
      {/* Always show Add Item button for nested fields */}
      <div className="mb-4">
        <Button
          type="button"
          onClick={addNestedField}
          variant="primary"
          size="sm"
          className="w-full"
        >
          <Plus size={16} />
          Add Item
        </Button>
      </div>

      {/* Render nested fields */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 rounded-md p-3 bg-white"
        >
          <FieldRow
            fieldPath={`${parentPath}.nested.${index}` as FieldPath<FormData>}
            control={control}
            remove={() => remove(index)}
            nestingLevel={nestingLevel}
            errors={errors?.nested}
          />
        </div>
      ))}
    </div>
  );
};

// Main Schema Builder Component
const JSONSchemaBuilder = () => {
  const [jsonOutput, setJsonOutput] = useState("{}");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isValidJson, setIsValidJson] = useState(true);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    trigger,
  } = useForm<FormData>({
    defaultValues: {
      fields: [
        {
          id: Math.random().toString(36).substr(2, 9),
          name: "",
          type: "string" as FieldType,
          required: false,
          nested: [],
        },
      ],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const watchedFields = watch("fields");

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addTopLevelField = () => {
    append({
      id: generateId(),
      name: "",
      type: "string" as FieldType,
      required: false,
      nested: [],
    } as any);
  };

  // Generate JSON output dynamically based on form fields - truly live
  const generateJSON = (fields: SchemaField[]): any => {
    if (!fields || fields.length === 0) return {};

    const result: any = {};

    fields.forEach((field) => {
      // Generate JSON even for incomplete fields to show live preview
      if (field.name) {
        // Only need field name to start showing in JSON
        if (field.type === "nested") {
          if (field.nested && field.nested.length > 0) {
            result[field.name] = generateJSON(field.nested);
          } else {
            result[field.name] = {}; // Empty object for nested without children
          }
        } else if (field.type === "string") {
          result[field.name] = "STRING";
        } else if (field.type === "number") {
          result[field.name] = "number";
        } else if (field.name && !field.type) {
          // Show field in JSON even without type selected yet
          result[field.name] = "";
        }
      }
    });

    return result;
  };

  // Update JSON output when fields change with enhanced live feedback
  useEffect(() => {
    try {
      const json = generateJSON(watchedFields || []);
      const jsonString = JSON.stringify(json, null, 2);
      setJsonOutput(jsonString);
      setIsValidJson(true);

      // Enhanced visual feedback for live typing
      const previewElement = document.getElementById("json-preview");
      if (previewElement) {
        previewElement.classList.add("json-updating");
        setTimeout(() => {
          previewElement.classList.remove("json-updating");
          previewElement.classList.add("json-updated");
          setTimeout(() => {
            previewElement.classList.remove("json-updated");
          }, 200);
        }, 100);
      }
    } catch (error) {
      setIsValidJson(false);
      setJsonOutput('{ "error": "Invalid JSON structure" }');
    }
  }, [watchedFields]);

  // Copy JSON to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput);
      showToast("JSON copied to clipboard!", "success");
    } catch (error) {
      showToast("Failed to copy JSON", "error");
    }
  };

  // Clear all fields
  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all fields?")) {
      reset({ fields: [] });
      showToast("All fields cleared!", "success");
    }
  };

  // Show toast notification
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Form submission
  const onSubmit = async (data: FormData) => {
    try {
      // Validate all fields
      const isFormValid = await trigger();

      if (!isFormValid) {
        showToast("Please fix validation errors before submitting", "error");
        return;
      }

      console.log("Schema Data:", data);
      console.log("Generated JSON:", JSON.parse(jsonOutput));

      showToast("Schema submitted successfully!", "success");

      // You can add API call here
      // await submitSchema(data);
    } catch (error) {
      console.error("Submission error:", error);
      showToast("Failed to submit schema", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            JSON Schema Builder
          </h1>
          <p className="text-gray-600">
            Build dynamic JSON schemas with nested structures
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Schema Builder */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Schema Builder
              </h2>
              <div className="flex gap-2">
                {fields.length > 0 && (
                  <Button
                    type="button"
                    onClick={clearAll}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 size={16} />
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <FieldRow
                      fieldPath={`fields.${index}` as FieldPath<FormData>}
                      control={control}
                      remove={() => remove(index)}
                      showRemove={fields.length > 1}
                      errors={errors?.fields?.[index]}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={addTopLevelField}
                  variant="primary"
                  className="w-full"
                >
                  <Plus size={16} />
                  Add Item
                </Button>

                {fields.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={!isValid || !isValidJson}
                    >
                      Submit Schema
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right Panel - JSON Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                JSON Preview
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  disabled={!isValidJson}
                >
                  <Copy size={16} />
                  Copy
                </Button>
              </div>
            </div>

            <div
              id="json-preview"
              className={`bg-gray-900 text-green-400 rounded-md p-4 font-mono text-sm overflow-auto max-h-96 transition-all duration-200 ${
                !isValidJson ? "text-red-400" : ""
              }`}
              style={{
                boxShadow: "inset 0 0 10px rgba(0,0,0,0.3)",
              }}
            >
              <pre>{jsonOutput}</pre>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>• 🔄 Updates instantly as you type</p>
              <p>• 📋 Copy the generated JSON to clipboard</p>
              <p>• 🔗 Supports unlimited nesting levels</p>
              <p>• ⚡ Real-time synchronization</p>
            </div>

            <style>{`
              #json-preview.json-updating {
                transform: scale(1.01);
                box-shadow: inset 0 0 15px rgba(59, 130, 246, 0.4),
                  0 0 8px rgba(59, 130, 246, 0.3);
                border: 1px solid rgba(59, 130, 246, 0.4);
              }
              #json-preview.json-updated {
                transform: scale(1);
                box-shadow: inset 0 0 20px rgba(34, 197, 94, 0.3),
                  0 0 10px rgba(34, 197, 94, 0.2);
                border: 1px solid rgba(34, 197, 94, 0.3);
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JSONSchemaBuilder;
