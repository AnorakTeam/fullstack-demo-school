"use client";

import { Button } from "@/components/ui/button";

export default function Pagination({   
        page = 1, 
        count = 0, 
        hasPrev = false, 
        hasNext = false, 
        onPrev = () => {}, 
        onNext = () => {}
    }) {
    return (
        <div className="flex items-center justify-between">
        <Button variant="outline" disabled={!hasPrev} onClick={() => hasPrev && onPrev()}>
            Página anterior
        </Button>

        <div className="text-sm">
            Página {page} — Total: {count}
        </div>

        <Button variant="outline" disabled={!hasNext} onClick={() => hasNext && onNext()}>
            Página siguiente
        </Button>
        </div>
    );
}
