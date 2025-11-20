"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:8000";

export default function StudentDetailPage({ params }) {
  const { id } = use(params);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const fetchStudent = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${API_BASE_URL}/students/${id}/`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        if (mounted) setStudent(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStudent();
    return () => (mounted = false);
  }, [id]);


  if (loading) return <div className="p-6">Cargando...</div>;
  if (!student) return <div className="p-6">Estudiante no encontrado</div>;
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{student.full_name}</h1>
      <p className="mb-1"><strong>Email:</strong> {student.email}</p>
      <p className="mb-1"><strong>Código:</strong> {student.code}</p>
      <p className="mb-1"><strong>ID:</strong> {student.id}</p>

      <div className="mt-4">
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    </div>
  );
}
