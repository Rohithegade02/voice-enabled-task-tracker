"use client"

import { memo, useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Label, Button, Popover, PopoverContent, PopoverTrigger, Calendar } from "@/components/atoms"
import type { DatePickerProps } from "./type"


/**
 * DatePicker component for selecting a date.
 * It provides a calendar popup to choose a date.
 *
 * @param {DatePickerProps} props - The props for the DatePicker component.
 * @param {Date | null} props.date - The currently selected date.
 * @param {() => void} props.setDate - Callback function to update the selected date.
 * @param {string} props.label - The label for the date input field.
 */

export const DatePicker = memo(({
    date,
    setDate,
    label,
}: DatePickerProps) => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
                {label}
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal"
                    >
                        {date ? date.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
})
