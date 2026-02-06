"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { XIcon } from "lucide-react";

export default function BookConsultationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const calendlyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadCalendly = () => {
      if (
        typeof window !== "undefined" &&
        (window as any).Calendly &&
        calendlyContainerRef.current
      ) {
        calendlyContainerRef.current.innerHTML = ""; // reset
        (window as any).Calendly.initInlineWidget({
          url: "https://calendly.com/chukwudaluay/30min?hide_event_type_details=1&primary_color=ba9951",
          parentElement: calendlyContainerRef.current,
        });
      }
    };

    // Small delay to ensure DOM is mounted
    const timeout = setTimeout(loadCalendly, 100);

    return () => clearTimeout(timeout);
  }, [isOpen]);


  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#ba9951] text-[#232323] px-6 py-4 rounded-sm text-xs tracking-[2px] font-normal hover:opacity-90 transition uppercase"
      >
        Book a consultation
      </button>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-[#e2d5c6] p-0 text-left align-middle shadow-xl transition-all h-[65vh] relative">
                  {/* Close button */}
                  <Button
                    variant={"ghost"}
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 left-2 z-9999 py-5 px-4 hover:cursor-pointer"
                  >
                    <XIcon />
                  </Button>

                  {/* Calendly container */}
                  <div ref={calendlyContainerRef} className="w-full h-full" />

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
