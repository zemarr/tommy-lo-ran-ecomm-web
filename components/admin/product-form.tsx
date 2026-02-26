'use client';

import React from 'react';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import { useForm, ControllerRenderProps, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertProductSchema, updateProductSchema } from '@/lib/validators';
import { z } from 'zod';
import { CATEGORIES, PRODUCT_DEFAULT_VALUES } from '@/lib/constants';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import slugify from 'slugify';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { createProduct, updateProduct } from "@/lib/server/actions/product.actions";
import { toast } from "sonner";
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Checkbox } from '../ui/checkbox';
import { UploadButton } from '@/lib/uploadThing';
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from '../ui/select';
import { MultiInputField } from '../shared/forms/multi-input-field';

const ProductForm = ({ type, product, productId }: {
  type: 'Create' | 'Update',
  product?: Product,
  productId?: string
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(type === 'Update' ? updateProductSchema : insertProductSchema),
    defaultValues: (product && type === 'Update') ? product : PRODUCT_DEFAULT_VALUES,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (values) => {
    // on create
    if (type === 'Create') {
      console.log(values, 'values')

      const res = await createProduct({
        ...values,
        popularity: 0,
        deliveryFee: {
          lag: values?.deliveryFee?.lag ?? 0,
          nationwide: values?.deliveryFee?.nationwide ?? 0,
        }
      });

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push('/admin/products');
      }
    }

    //     on update
    if (type === 'Update') {
      console.log(values, 'values')
      if (!productId) {
        router.push('/admin/products');
      }
      const res = await updateProduct({ ...values, id: productId as string });

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push('/admin/products');
      }
    }
  };

  const images = form.watch('images');
  // const isFeatured = form.watch('isFeatured');
  // const banner = form.watch('banner');

  return (
    <Form {...form}>
      <form method={"POST"} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row items-start gap-5">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'name'>;
            }) => (
              <FormItem className="form-item w-full">
                <FormLabel htmlFor="name">Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name"  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'>;
            }) => (
              <FormItem className="form-item w-full">
                <FormLabel htmlFor="slug">Slug</FormLabel>
                <FormControl>
                  <div className="relative flex items-center gap-5">
                    <Input placeholder="Enter slug" {...field} />
                    <Button
                      type="button"
                      variant={"outline"}
                      className="px-4 py-1"
                      onClick={() => {
                        form.setValue('slug', slugify(form.getValues('name'), { lower: true }));
                      }}
                    >
                      Generate slug
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="form-item w-full">
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className={"w-full"}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem
                        key={category.name}
                        value={category.name}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'description'>;
            }) => (
              <FormItem className="form-item w-full">
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
          {/* Long Description */}
          <FormField
            control={form.control}
            name="longDescription"
            render={({ field }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'longDescription'>;
            }) => (
              <FormItem className="form-item w-full">
                <FormLabel htmlFor="longDescription">Long description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter longer product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Delivery Time */}
          <FormField
            control={form.control}
            name="deliveryTime"
            render={({ field }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'deliveryTime'>;
            }) => (
              <FormItem className="form-item w-full">
                <FormLabel htmlFor="deliveryTime">Delivery time</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Time estimate to delivery"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
          {/* Long Description */}
          <MultiInputField name={"features"} label="Features" placeholder={"Add a feature"} />

          <MultiInputField name={"materials"} label="Materials" placeholder={"Add material used"} />
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
          {/* Care */}
          <FormField
            control={form.control}
            name="care"
            render={({ field }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'care'>;
            }) => (
              <FormItem className="form-item w-full">
                <FormLabel htmlFor="care">Product care tips</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="resize-none"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fit */}
          <FormField
            control={form.control}
            name="fit"
            render={({ field }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'fit'>;
            }) => (
              <FormItem className="form-item w-full">
                <FormLabel htmlFor="fit">Product fit tips</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product fit"
                    className="resize-none"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="upload-field flex flex-col md:flex-row gap-5">
          {/* images */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="form-item w-full">
                <FormLabel htmlFor="images">Images</FormLabel>

                <Card className="px-1 py-0.5 shadow-xs">
                  <CardContent className="space-y-2 min-h-[48px] px-1 py-2">
                    {/* Preview */}
                    <div className="flex space-x-2">
                      {field.value?.map((image: string, index: number) => (
                        <div key={image} className="relative">
                          <Image
                            src={image}
                            alt={`Product Image ${ index + 1 }`}
                            className="w-20 h-20 object-cover rounded-md"
                            width={100}
                            height={100}
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              const removed = field.value[ index ]
                              // Delete from UploadThing
                              await fetch("/api/uploadthing/delete", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ key: removed }),
                              })

                              // Update form state
                              const updated = field.value.filter((_, i) => i !== index)
                              field.onChange(updated)

                              toast.success("Image removed")

                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Upload */}
                    <div className="border-t border-muted-foreground/20 pt-4">
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            const newUrls = res.map(file => file.ufsUrl);
                            const updatedImages = [
                              ...(field.value ?? []),
                              ...newUrls,
                            ].slice(0, 2); // 🚨 enforce max 2 images

                            field.onChange(updatedImages);
                            toast.success("Product image uploaded successfully");
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`ERROR! ${ error.message }`);
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          {/* price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'price'>;
            }) => (
              <FormItem className="form-item w-full">
                <FormLabel htmlFor="price">Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product price"  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* stock */}
          <FormField
            control={form.control}
            name="stock"
            render={({ field }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'stock'>;
            }) => (
              <FormItem className="form-item w-full">
                <FormLabel htmlFor="stock">Stock</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product stock"  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
          <h3 className="mb-3 text-lg font-semibold col-span-2">
            Delivery Fees
          </h3>

          {/* Lagos */}
          <FormField
            control={form.control}
            name="deliveryFee.lag"
            render={({ field }) => (
              <FormItem className="form-item w-full">
                <FormLabel>Within Lagos</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter delivery cost within Lagos"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nationwide */}
          <FormField
            control={form.control}
            name="deliveryFee.nationwide"
            render={({ field }) => (
              <FormItem className="form-item w-full">
                <FormLabel>Nationwide</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter delivery cost nationwide"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          {/* Submit */}
          <Button
            type="submit"
            size={'lg'}
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting ? 'Submitting...' : `${ type } Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
