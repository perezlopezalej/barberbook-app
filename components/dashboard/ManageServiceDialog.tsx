"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Service } from "@/lib/types";
import { createService, updateService } from "@/services/services";
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
  description: z.string().optional(),
  duration_minutes: z.number().min(15, "Mínimo 15 minutos").max(240, "Máximo 240 minutos"),
  price: z.number().min(0, "El precio no puede ser negativo"),
  is_active: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  shopId: string;
  service?: Service;
}

export function ManageServiceDialog({ shopId, service }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!service;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: service?.name ?? "",
      description: service?.description ?? "",
      duration_minutes: service?.duration_minutes ?? 30,
      price: service?.price ?? 0,
      is_active: service?.is_active ?? true,
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      if (isEdit && service) {
        await updateService(service.id, data);
        toast.success("Servicio actualizado.");
      } else {
        await createService({
          shop_id: shopId,
          name: data.name,
          description: data.description ?? "",
          duration_minutes: data.duration_minutes,
          price: data.price,
          currency: "MXN",
          is_active: data.is_active,
        });
        toast.success("Servicio añadido.");
      }
      setOpen(false);
      reset();
      router.refresh();
    } catch {
      toast.error("Error al guardar el servicio.");
    } finally {
      setIsLoading(false);
    }
  }

  const triggerEl = isEdit ? (
    <button className="p-1.5 rounded-md hover:bg-zinc-100 transition-colors">
      <Pencil className="w-4 h-4 text-zinc-400" />
    </button>
  ) : (
    <button className={cn(buttonVariants({ size: "sm" }))}>
      <Plus className="w-4 h-4 mr-1.5" />
      Añadir servicio
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={triggerEl} />
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar servicio" : "Añadir servicio"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="s-name">Nombre</Label>
            <Input id="s-name" placeholder="Corte clásico" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-desc">Descripción</Label>
            <Input
              id="s-desc"
              placeholder="Corte con tijera y navaja..."
              {...register("description")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="s-dur">Duración (min)</Label>
              <Input
                id="s-dur"
                type="number"
                min={15}
                step={15}
                {...register("duration_minutes", { valueAsNumber: true })}
              />
              {errors.duration_minutes && (
                <p className="text-xs text-red-500">{errors.duration_minutes.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-price">Precio (MXN)</Label>
              <Input
                id="s-price"
                type="number"
                min={0}
                step={10}
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-xs text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="s-active"
              type="checkbox"
              className="w-4 h-4 accent-amber-500"
              {...register("is_active")}
            />
            <Label htmlFor="s-active" className="font-normal cursor-pointer">
              Servicio activo
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
