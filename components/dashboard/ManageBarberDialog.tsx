"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Barber } from "@/lib/types";
import { createBarber, updateBarber } from "@/services/barbers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  bio: z.string().optional(),
  is_active: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  shopId: string;
  barber?: Barber;
}

export function ManageBarberDialog({ shopId, barber }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!barber;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: barber?.name ?? "",
      bio: barber?.bio ?? "",
      is_active: barber?.is_active ?? true,
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      if (isEdit && barber) {
        await updateBarber(barber.id, data);
        toast.success("Barbero actualizado.");
      } else {
        await createBarber({
          shop_id: shopId,
          name: data.name,
          bio: data.bio ?? "",
          avatar_url: null,
          specialties: [],
          is_active: data.is_active,
        });
        toast.success("Barbero añadido.");
      }
      setOpen(false);
      reset();
      router.refresh();
    } catch {
      toast.error("Error al guardar el barbero.");
    } finally {
      setIsLoading(false);
    }
  }

  const triggerEl = isEdit ? (
    <button className="p-1.5 rounded-md hover:bg-zinc-100 transition-colors shrink-0">
      <Pencil className="w-4 h-4 text-zinc-400" />
    </button>
  ) : (
    <button className={cn(buttonVariants({ size: "sm" }))}>
      <Plus className="w-4 h-4 mr-1.5" />
      Añadir barbero
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={triggerEl} />
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar barbero" : "Añadir barbero"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder="Carlos Mendoza" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Input id="bio" placeholder="Especialista en cortes clásicos..." {...register("bio")} />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="is_active"
              type="checkbox"
              className="w-4 h-4 accent-amber-500"
              {...register("is_active")}
            />
            <Label htmlFor="is_active" className="font-normal cursor-pointer">
              Barbero activo
            </Label>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? "Guardar" : "Añadir"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
