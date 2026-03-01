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
};

export function MultiVariantInputField({ name, label }: Props) {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name, // should be "variants"
  });

  // Default values for a new variant
  const defaultVariant = {
    size: '',
    stock: 0,
    price: '',
  };

  return (
    <div className="space-y-4">
      {fields.map((fieldItem, index) => (
        <div key={fieldItem.id} className="p-4 border border-border rounded-md space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Size */}
            <FormField
              control={control}
              name={`${ name }.${ index }.size`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., S, M, L" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stock */}
            <FormField
              control={control}
              name={`${ name }.${ index }.stock`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Override */}
            <FormField
              control={control}
              name={`${ name }.${ index }.price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Leave blank to use base price"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? e.target.value : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => remove(index)}
            >
              <Trash size={16} className="mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append(defaultVariant)}
        className="w-full"
      >
        <Plus size={16} className="mr-1" />
        Add Variant
      </Button>
    </div>
  );
}