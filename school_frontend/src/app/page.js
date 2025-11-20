"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";

import CreateStudentDialog from "@/components/CreateStudentDialog";
import Pagination from "@/components/Pagination";

const API_BASE_URL = "http://localhost:8000";





export default function Home() {

  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [ordering, setOrdering] = useState("full_name")
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);


  const loadStudents = async (requestedPage=1) => {
    setLoading(true);
    
    try {
      
      const url = `${API_BASE_URL}/students/?page=${requestedPage}&search=${query}&ordering=${ordering}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error en el fetch de estudiantes");
      const data = await res.json();

      setStudents(data.results || []);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setCount(data.count);
      setPage(requestedPage);

    } catch (err) {
      console.error(err);
      toast.error("Error cargando estudiantes");
    } finally {
      setLoading(false);
    }
  }

  const orderingClickHandler = (button) => {
    if (button === 'name_button') {
      if (ordering === 'full_name') setOrdering('-full_name')
      else setOrdering('full_name')
    } else {
      if (ordering === 'code') setOrdering('-code')
      else setOrdering('code')
    }
  };

  useEffect(() => {
    loadStudents(page);
  }, [query, ordering]);

  const handleCreated = () => {
    loadStudents(page);
  };

  return (
    <Card className="w-3xl mx-auto mt-4">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Students</CardTitle>
        <CreateStudentDialog onCreated={handleCreated} />
      </CardHeader>

      <CardContent>
        <div className="flex gap-3">
          <Input
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}/>
          <Button
            variant="outline"
            onClick={() => orderingClickHandler("name_button")}
            title="Ordenar por nombre">
            {ordering === "full_name" ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </Button>
          <Button
            variant="outline"
            onClick={() => orderingClickHandler("code_button")}
            title="Ordenar por código">
            {ordering === "code" ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </Button>
        </div>

        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
        
        <div className="p-2 border rounded h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : (
            <ul>
              {students.map((student) => (
                <li
                  key={student.id ?? student.code}
                  className="text-md font-medium my-2 flex flex-row justify-between cursor-pointer hover:bg-gray-100 p-2 rounded"
                  title={student.email}>
                  <Link href={`/students/${student.id}`} className="flex-1" style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{student.full_name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                      <div className="ml-4 text-sm">{student.code}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4">
          <Pagination
            page={page}
            count={count}
            hasPrev={prevPage !== 0}
            hasNext={nextPage !== 0}
            onPrev={() => prevPage && loadStudents(page - 1)}
            onNext={() => nextPage && loadStudents(page + 1)}/>
        </div>
      </CardContent>
    </Card>
  );
}
