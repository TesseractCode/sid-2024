// datepicker.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Pass onDateChange as a prop to send the selected date back to the parent component
export function DatePickerDemo({ onDateChange }: { onDateChange: (date: Date | undefined) => void }) {
  const [date, setDate] = React.useState<Date | undefined>(); // Allow date to be Date or undefined

  // Update both local and parent states when a date is selected
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate); // Set the selected date (can be undefined)
    onDateChange(selectedDate); // Pass the selected date to the parent (can be undefined)
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect} // Use handleDateSelect to handle date selection
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
