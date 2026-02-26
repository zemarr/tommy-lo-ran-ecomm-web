'use client'
import { Button } from '@/components/ui/button';
import React, { useTransition } from 'react'
import { toast } from 'sonner';
import { useActionComponentStore } from '../store/action-components-store';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const DeleteDialog = ({
  id,
  action
}: {
  id: string;
  action: (id: string) => Promise<{ success: boolean, message: string }>,
}) => {
  const { confirmDelete, setConfirmDelete, deleting } = useActionComponentStore()
  const [isPending, startTransition] = useTransition();

  const handleDeleteClick = () => {
    startTransition(async () => {
      const response = await action(id);
      if (!response.success) {
        toast.error(response.message)
        return
      } else {
        setConfirmDelete(false)
        toast.success(response.message)
      }
    })
  }

  return (
    <>
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogTrigger asChild>
          {/* <Button className="text-destructive btn-sm" variant={"destructive"} size={"sm"}>Delete</Button> */}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-center'>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              {(id && deleting?.id) && (
                <span className="flex flex-col text-center">
                  <span>You are about deleting
                    <br />
                    {deleting?.items?.map(item => <React.Fragment key={item}><span>{item}</span><br /></React.Fragment>)}
                    <br />
                    with ID
                    <br />
                    <span className='font-semibold'>{deleting?.id}</span>.
                  </span>
                  <span>
                    <span className='font-semibold'>
                      Note:
                    </span>
                    This action CANNOT be undone
                  </span>
                </span>
              )}
              <span></span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex items-center !justify-center'>
            <DialogClose asChild>
              <Button variant={'outline'} size={'sm'} type='button'>Cancel</Button>
            </DialogClose>
            <Button
              className=" btn-sm" variant={"destructive"} size={"sm"}
              disabled={isPending}
              onClick={handleDeleteClick}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DeleteDialog