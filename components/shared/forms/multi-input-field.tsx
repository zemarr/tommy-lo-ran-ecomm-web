'use client';

import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash } from "lucide-react";
type Props = {
  name: string;
  label: string;
  placeholder: string;
};

export function MultiInputField({ name, label, placeholder }: Props) {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <FormField
      control={control}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name={name as string}
      render={() => (
        <FormItem className="form-item w-full">
          <FormLabel>{label}</FormLabel>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={control}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  name={`${ name }.${ index }` as any}
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        placeholder={placeholder}
                        {...field}
                      />
                    </FormControl>
                  )}
                />

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-3"
            onClick={() => append("")}
          >
            <Plus size={16} className="mr-1" />
            Add {label.slice(0, -1)}
          </Button>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}