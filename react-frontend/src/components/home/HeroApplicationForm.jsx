'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { submitHeroApplication } from '@/_services/homeService';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ── Zod schema ────────────────────────────────────────────────────────────────
const schema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  dateOfBirth: z.date({ required_error: 'Please select your date of birth' }),
  city: z.string().min(2, 'City must be at least 2 characters').max(50, 'City is too long'),
  product: z.string().min(1, 'Please select a course'),
});

// ── Shared styles ─────────────────────────────────────────────────────────────
// Base styles live in globals.css as `.form-field`.
// triggerCls is only needed for Radix SelectTrigger / DOB button which require
// the class string passed as a prop — everything else just uses className="form-field".
const triggerCls = 'form-field flex items-center justify-between';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-[10px] text-red-500 mt-0.5 leading-tight">{message}</p>;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function HeroApplicationForm() {
  const [submitStatus, setSubmitStatus] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: undefined,
      city: '',
      product: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitStatus(null);
    try {
      const response = await submitHeroApplication({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        dateOfBirth: format(data.dateOfBirth, 'yyyy-MM-dd'),
        city: data.city.trim(),
        product: data.product,
      });
      if (response?.status) {
        reset();
        setSubmitStatus('success');
      } else {
        setSubmitStatus(response?.message || 'error');
      }
    } catch (err) {
      setSubmitStatus(err.message || 'error');
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl px-6 py-6">
      {/* Header */}
      <div className="text-center mb-4">
        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">APPLY TODAY FOR</p>
        <h2 className="text-gray-900 font-medium text-[28px] leading-tight mb-3">Salesforce Training Institute</h2>
        <div className="bg-[#009DE3] text-white text-xs font-medium text-center py-2.5 px-3 rounded-sm">
          Start your learning with a free orientation session
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3 mt-4">
        {/* Row 1: Name + Email */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Input
              {...register('name')}
              placeholder="Student Name"
              className="form-field"
              aria-invalid={!!errors.name}
            />
            <FieldError message={errors.name?.message} />
          </div>
          <div>
            <Input
              {...register('email')}
              type="email"
              placeholder="E Mail"
              className="form-field"
              aria-invalid={!!errors.email}
            />
            <FieldError message={errors.email?.message} />
          </div>
        </div>

        {/* Row 2: Phone with +91 prefix */}
        <div>
          <div className="form-field flex p-0 overflow-hidden focus-within:border-[#009DE3] focus-within:ring-2 focus-within:ring-[#009DE3]/20 transition">
            <span className="flex items-center px-3 text-sm text-gray-500 border-r border-gray-200 bg-gray-50 shrink-0 select-none">
              +91
            </span>
            <input
              {...register('phone')}
              type="tel"
              placeholder="Student Mobile Number"
              maxLength={10}
              className="flex-1 px-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
              aria-invalid={!!errors.phone}
            />
          </div>
          <FieldError message={errors.phone?.message} />
        </div>

        {/* Row 3: DOB date picker + City */}
        <div className="grid grid-cols-2 gap-2">
          {/* Date picker */}
          <div>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        triggerCls,
                        'flex items-center justify-between gap-2',
                        !field.value ? 'text-gray-400' : 'text-gray-700',
                      )}
                    >
                      <span className="truncate text-sm">
                        {field.value ? format(field.value, 'dd MMM yyyy') : 'Select DOB'}
                      </span>
                      <CalendarIcon className="size-4 shrink-0 text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setCalendarOpen(false);
                      }}
                      captionLayout="dropdown"
                      defaultMonth={new Date(2000, 0)}
                      startMonth={new Date(1950, 0)}
                      endMonth={new Date(new Date().getFullYear() - 5, 11)}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <FieldError message={errors.dateOfBirth?.message} />
          </div>

          {/* City */}
          <div>
            <Input
              {...register('city')}
              placeholder="Student City"
              className="form-field"
              aria-invalid={!!errors.city}
            />
            <FieldError message={errors.city?.message} />
          </div>
        </div>

        {/* Row 4: Course */}
        <div>
          <Controller
            name="product"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} modal={false}>
                <SelectTrigger className={triggerCls} aria-invalid={!!errors.product}>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={2} className={'rounded-xs'}>
                  <SelectItem value="SFDC" className={'hover:rounded-none'}>
                    SFDC — Salesforce Developer / Admin
                  </SelectItem>
                  <SelectItem value="SFMC" className={'hover:rounded-none'}>
                    SFMC — Salesforce Marketing Cloud
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.product?.message} />
        </div>

        {/* API status */}
        {submitStatus === 'success' && (
          <p className="text-xs bg-green-50 text-green-700 px-3 py-2 rounded-lg" role="status">
            Thank you! Your application has been submitted.
          </p>
        )}
        {submitStatus && submitStatus !== 'success' && (
          <p className="text-xs bg-red-50 text-red-600 px-3 py-2 rounded-lg" role="alert">
            {typeof submitStatus === 'string' && submitStatus !== 'error'
              ? submitStatus
              : 'Something went wrong. Please try again.'}
          </p>
        )}

        {/* Disclaimer */}
        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          By submitting this form, I agree to receive notifications from the Cloud Intellect in the form of
          SMS/E-mail/Call.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#009DE3] hover:bg-[#007acc] disabled:opacity-60 text-white font-bold text-sm py-3 rounded-sm transition tracking-widest"
        >
          {isSubmitting ? 'SUBMITTING…' : 'APPLY NOW'}
        </button>
      </form>
    </div>
  );
}
