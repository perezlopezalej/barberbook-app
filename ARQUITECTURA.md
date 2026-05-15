
# ARQUITECTURA BARBERBOOK

## FLUJO DEL SISTEMA

UI
→ components
→ features
→ services
→ data layer

---

## MÓDULOS DEL SISTEMA

### Booking Flow
- selección de servicio
- selección de barbero
- calendario
- slots disponibles
- confirmación

### Dashboard
- gestión de citas
- vista calendario
- estado de reservas

---

## PRINCIPIOS

- UI es declarativa, no contiene lógica
- features controlan estado y reglas de negocio
- services gestionan API y persistencia
- separación estricta de responsabilidades

---

## OBJETIVO

Construir una app SaaS escalable, clara y fácil de mantener enfocada en reservas reales.