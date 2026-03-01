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
  // placeholder: string;
};

export function MultiVariantInputField({ name, label }: Props) {
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
            {fields.map((fieldItem, index) => (
              <div key={fieldItem.id} className="p-2 rounded-md overflow-hidden">
                <div className="grid md:grid-cols-3 gap-4 items-end">

                  {/* Size */}
                  <FormField
                    control={control}
                    name={`variants.${ index }.size`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Input placeholder="S, M, L..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Stock */}
                  <FormField
                    control={control}
                    name={`variants.${ index }.stock`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price Override */}
                  <FormField
                    control={control}
                    name={`variants.${ index }.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>

                <div className="mt-3 text-right">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
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