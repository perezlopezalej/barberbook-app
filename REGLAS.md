
# REGLAS

## NOMENCLATURA
- Componentes: PascalCase
- Funciones: camelCase
- Archivos: kebab-case o feature-based

---

## ARQUITECTURA

- components = UI pura (sin lógica de negocio)
- features = lógica de negocio (booking, slots, auth)
- services = API / persistencia / integración externa
- utils = funciones puras reutilizables

---

## DOMINIO (IMPORTANTE PARA BARBERBOOK)

Entidades principales:
- Booking (cita)
- User (cliente)
- Barber (profesional)
- Service (corte, barba, etc)
- TimeSlot (disponibilidad)

---

## FLUJO DE RESERVA (CRÍTICO)

El flujo siempre debe ser:

Service → Barber → Date → TimeSlot → Customer Info → Confirmation

No se puede romper este orden.

---

## UI / UX

- UI debe ser mobile-first
- siempre priorizar claridad sobre estética compleja
- cada acción debe tener feedback visual
- evitar pantallas innecesarias

---

## API / DATOS

- todas las llamadas pasan por services/
- nunca lógica de negocio en components
- validar inputs en services antes de persistir

---

## SEGURIDAD (BÁSICO)

- no confiar en datos del cliente
- validar siempre en backend/service layer

---

## CONSISTENCIA

- diseño tipo SaaS moderno (Stripe / Linear feel)
- spacing consistente
- jerarquía clara de acciones (CTA principal siempre visible)