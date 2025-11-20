"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:8000";

export default function CreateStudentDialog({ onCreated }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values) => {
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/students/`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        let msg = "";

        if (typeof err === "object") {
            for(const key in err) {
                msg += `${key}: ${err[key]}\n`;
            }
        } else msg = String(err);

        toast.error("Error creando estudiante", { description: msg });
        return;
      }

      toast.success("Estudiante creado");
      watch();
      setOpen(false);
      onCreated();

    } catch (err) {
      console.error(err);
      toast.error("Error creando estudiante");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Crear estudiante</Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)}/>
          
          <div className="bg-white rounded-lg shadow-lg z-10 w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Crear estudiante</h3>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              autoComplete="off">

              <Field>
                <FieldLabel>Nombre completo</FieldLabel>
                <Input {...register("full_name", { required: true })} />
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" {...register("email", { required: true })} />
              </Field>

              <Field>
                <FieldLabel>Código</FieldLabel>
                <Input {...register("code", { required: true })} />
              </Field>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setOpen(false)} type="button">
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Guardando..." : "Crear"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
